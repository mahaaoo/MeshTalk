import { create } from "zustand";

import * as constant from "../config/constant";
import { Emoji } from "../config/interface";
import { getInstanceEmojis } from "../server/app";
import { setItem, getItem } from "../utils/storage";

interface EmojiStoreState {
  emojis: Emoji[];
  emojisHash: Map<string, Emoji>;
  initEmoji: () => void;
}

const useEmojiStore = create<EmojiStoreState>((set, get) => ({
  emojis: [],
  emojisHash: new Map(),
  initEmoji: async () => {
    const emojiStorage = await getItem(constant.EMOJI);
    if (!emojiStorage || emojiStorage === undefined) {
      const { data } = await getInstanceEmojis();
      if (data) {
        setItem(constant.EMOJI, JSON.stringify(data));
        const hash = new Map();
        const emojis = data;
        for (const emoji of emojis) {
          hash.set(emoji.shortcode, emoji);
        }
        set({ emojis: data, emojisHash: hash });
      }
    } else {
      const emojis = JSON.parse(emojiStorage);
      const hash = new Map();
      for (const emoji of emojis) {
        hash.set(emoji.shortcode, emoji);
      }
      set({ emojis, emojisHash: hash });
    }
  },
}));

export default useEmojiStore;
