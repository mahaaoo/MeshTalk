// import {makeAutoObservable, runInAction} from 'mobx';
// import {get, set} from '../utils/storage';
// import * as constant from '../config/constant';

// class AppStore {
//   hostUrl: string | undefined = undefined;
//   token: string | undefined = undefined;

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setHostUrl(url: string) {
//     this.hostUrl = url;
//     set(constant.HOSTURL, url);
//   }

//   setToken(newToken: string) {
//     this.token = newToken;
//     set(constant.ACCESSTOKEN, newToken);
//   }

//   initApp() {
//     const localHostUrl = get(constant.HOSTURL) || '';
//     const localToekn = get(constant.ACCESSTOKEN) || '';
//     runInAction(() => {
//       this.hostUrl = localHostUrl;
//       this.token = localToekn;
//     });
//   }
// }

// export default new AppStore();

import { create } from "zustand";

import * as constant from "../config/constant";
import { setItem, getItem } from "../utils/storage";

interface AppStoreState {
  hostURL: string | undefined;
  token: string | undefined;
  setHostURL: (url: string) => void;
  setToken: (token: string) => void;
  initApp: () => void;
}

const useAppStore = create<AppStoreState>((set) => ({
  hostURL: undefined,
  token: undefined,
  setHostURL: (url: string) => {
    set({ hostURL: url }), setItem(constant.HOSTURL, url);
  },
  setToken(token: string) {
    set({ token }), setItem(constant.ACCESSTOKEN, token);
  },
  initApp() {
    const localHostUrl = getItem(constant.HOSTURL) || "";
    const localToekn = getItem(constant.ACCESSTOKEN) || "";
    set({ token: localToekn as string, hostURL: localHostUrl as string });
  },
}));

export default useAppStore;
