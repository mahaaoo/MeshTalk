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
    set({ hostURL: url });
    setItem(constant.HOSTURL, url);
  },
  setToken: (token: string) => {
    set({ token });
    setItem(constant.ACCESSTOKEN, token);
  },
  initApp: async () => {
    console.log("initApp");
    const localHostUrl = await getItem(constant.HOSTURL);
    const localToekn = await getItem(constant.ACCESSTOKEN);

    console.log("initApp", {
      localHostUrl,
      localToekn,
    });
    set({ token: localToekn as string, hostURL: localHostUrl as string });
  },
}));

export default useAppStore;
