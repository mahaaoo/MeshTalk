// import {get, set} from '../utils/storage';
// import * as constant from '../config/constant';
// import {Emoji} from '../config/interface';
// import {getInstanceEmojis} from '../server/app';

// class EmojiStore {
//   emojis: Array<Emoji> = [];

//   get emojisHash() {
//     const hash = new Map();
//     for (const emoji of this.emojis) {
//       hash.set(emoji.shortcode, emoji);
//     }
//     return hash;
//   }

//   constructor() {
//     this.initEmoji();
//   }

//   async initEmoji() {
  //   const emojiStorage = get(constant.EMOJI);
  //   if (!emojiStorage || emojiStorage === undefined) {
  //     const data = await getInstanceEmojis();
  //     if (data) {
  //       set(constant.EMOJI, JSON.stringify(data));
  //       this.emojis = data;
  //     }
  //   } else {
  //     this.emojis = JSON.parse(emojiStorage);
  //   }
  // }
// }

// export default new EmojiStore();

import {create} from 'zustand'
import * as constant from '../config/constant';
import {Emoji} from '../config/interface';
import {getInstanceEmojis} from '../server/app';
import {setItem, getItem} from '../utils/storage';

interface EmojiStoreState {
  emojis: Array<Emoji>,
  emojisHash: () => Map<string, Emoji>,
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
