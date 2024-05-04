import { create } from "zustand";

import * as constant from "../config/constant";
import { Emoji } from "../config/interface";
import { getInstanceEmojis } from "../server/app";
import { setItem, getItem } from "../utils/storage";

interface EmojiStoreState {
  emojis: Emoji[];
  emojisHash: () => Map<string, Emoji>;
  initEmoji: () => void;
}

const useEmojiStore = create<EmojiStoreState>((set, get) => ({
  emojis: [],
  emojisHash: () => {
    const hash = new Map();
    const emojis = get().emojis;
    for (const emoji of emojis) {
      hash.set(emoji.shortcode, emoji);
    }
    return hash;
  },
  initEmoji: async () => {
    const emojiStorage = getItem(constant.EMOJI);
    if (!emojiStorage || emojiStorage === undefined) {
      const data = await getInstanceEmojis();
      if (data) {
        setItem(constant.EMOJI, JSON.stringify(data));
        set({ emojis: data });
      }
    } else {
      set({ emojis: JSON.parse(emojiStorage) });
    }
  },
}));

export default useEmojiStore;
