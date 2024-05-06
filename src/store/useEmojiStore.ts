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
    const emojiStorage = await getItem(constant.EMOJI);
    console.log('ooo', emojiStorage);
    if (!emojiStorage || emojiStorage === undefined) {
      console.log('请求getInstanceEmojis');
      const data = await getInstanceEmojis();
      if (data) {
        setItem(constant.EMOJI, JSON.stringify(data));
        set({ emojis: data });
      }
    } else {
      console.log('aaa?');
      set({ emojis: JSON.parse(emojiStorage) });
    }
  },
}));

export default useEmojiStore;
