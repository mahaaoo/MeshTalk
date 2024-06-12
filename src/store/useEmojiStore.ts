import { create } from "zustand";

import { Emoji } from "../config/interface";
import { getInstanceEmojis } from "../server/app";

interface EmojiStoreState {
  emojis: Emoji[];
  emojisHash: Map<string, Emoji>;
  initEmoji: () => void;
  setEmoji: (enmoji: Emoji[] | undefined) => void;
}

const useEmojiStore = create<EmojiStoreState>((set, get) => ({
  emojis: [],
  emojisHash: new Map(),
  setEmoji: (enmoji: Emoji[] | undefined) => {
    if (enmoji) {
      const hash = new Map();
      const emojis = enmoji;
      for (const emoji of emojis) {
        hash.set(emoji.shortcode, emoji);
      }
      set({ emojis, emojisHash: hash });
    }
  },
  initEmoji: async () => {
    if (!get().emojis || get().emojis.length === 0) {
      const { data, ok } = await getInstanceEmojis();
      if (data && ok) {
        get().setEmoji(data);
      }
    }
  },
}));

export default useEmojiStore;
