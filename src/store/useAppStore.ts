import { Platform } from "react-native";
import { create } from "zustand";

import useAccountStore from "./useAccountStore";
import useEmojiStore from "./useEmojiStore";
import useLoginStore from "./useLoginStore";
import * as constant from "../config/constant";
import { api } from "../utils/request";
import { setItem, getItem } from "../utils/storage";

interface AppStoreState {
  hostURL: string | undefined;
  token: string | undefined;
  isReady: boolean;
  setHostURL: (url: string) => void;
  setToken: (token: string) => void;
  afterToken: (localToken: string, localHostUrl: string) => void;
  initApp: () => void;
}

const useAppStore = create<AppStoreState>((set, get) => ({
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
  afterToken: async (localToken: string, localHostUrl: string) => {
    const token = "Bearer " + localToken;
    const hostURL = localHostUrl;

    api.setHeader("Authorization", token);
    api.setBaseURL(hostURL);

    console.log("存在合法的token以及实例，验证token有效性", {
      baseURL: api.getBaseURL(),
      header: api.headers,
    });
    await useAccountStore.getState().verifyToken();
    useEmojiStore.getState().initEmoji();
    console.log("验证token完毕");
  },
  initApp: async () => {
    console.log("initApp");
    // const localHostUrl = await getItem(constant.HOSTURL);
    // const localToken = await getItem(constant.ACCESSTOKEN);

    const localHostUrl = "https://m.cmx.im";
    const localToken = "-dn3UARVqfxy7ZwHpCONzJkY_U-llZxdMVDyvWO0TYs";

    console.log("initApp", {
      localHostUrl,
      localToken,
    });
    // web端回调的时候code在这处理
    if (Platform.OS === "web") {
      // const url = window.location.search;
      // if (url?.indexOf("code") > 0) {
      //   const urlList = url.split("?");
      //   if (urlList.length === 2 && urlList[1].length !== 0) {
      //     const codeList = urlList[1].split("=");
      //     useLoginStore.getState().webGetToken(codeList[1]);
      //   }
      // }
      // 测试web
    }

    if (
      localHostUrl &&
      localToken &&
      localHostUrl.length > 0 &&
      localToken.length > 0
    ) {
      await get().afterToken(localToken, localHostUrl);
    }

    set({
      token: localToken as string,
      hostURL: localHostUrl as string,
      isReady: true,
    });
  },
}));

export default useAppStore;
