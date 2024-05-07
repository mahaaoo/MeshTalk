import { create } from "zustand";

import useAccountStore from "./useAccountStore";
import useEmojiStore from "./useEmojiStore";
import * as constant from "../config/constant";
import { api } from "../utils/request";
import { setItem, getItem } from "../utils/storage";

interface AppStoreState {
  hostURL: string | undefined;
  token: string | undefined;
  isReady: boolean;
  setHostURL: (url: string) => void;
  setToken: (token: string) => void;
  initApp: () => void;
}

const useAppStore = create<AppStoreState>((set) => ({
  hostURL: undefined,
  token: undefined,
  isReady: false,
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
    const localToken = await getItem(constant.ACCESSTOKEN);

    console.log("initApp", {
      localHostUrl,
      localToken,
    });

    if (
      localHostUrl &&
      localToken &&
      localHostUrl.length > 0 &&
      localToken.length > 0
    ) {
      const token = "Bearer " + localToken;
      const hostURL = localHostUrl;

      api.setHeader("Authorization", token);
      api.setBaseURL(hostURL);

      console.log("存在合法的token以及实例，验证token有效性");
      await useAccountStore.getState().verifyToken();
      useEmojiStore.getState().initEmoji();
      console.log("验证token完毕");
    }

    set({
      token: localToken as string,
      hostURL: localHostUrl as string,
      isReady: true,
    });
  },
}));

export default useAppStore;
