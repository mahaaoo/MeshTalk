import { router } from "expo-router";
import { Platform } from "react-native";
import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import useAccountStore from "./useAccountStore";
import useEmojiStore from "./useEmojiStore";
import * as constant from "../config/constant";
import { Account } from "../config/interface";
import { getInstanceEmojis, verifyToken } from "../server/app";
import { api } from "../utils/request";
import { setItem, getItem, clear } from "../utils/storage";

interface MultipleUserProsp {
  acct: string;
  domain: string;
  token: string;
  emoji: string;
}

interface AppStoreState {
  multipleUser: MultipleUserProsp[];
  hostURL: string | undefined;
  token: string | undefined;
  isReady: boolean;
  checkTokenAndDomin: (
    token: string,
    domain: string,
    isEmoji: boolean,
    isNewUser: boolean,
  ) => void;
  addNewUser: (token: string, domain: string, account: Account) => void;
  initApp: () => void;
  exitCurrentAccount: () => void;
}

const useAppStore = create<AppStoreState>((set, get) => ({
  multipleUser: [],
  hostURL: undefined,
  token: undefined,
  isReady: false,
  checkTokenAndDomin: async (
    token: string,
    domain: string,
    isEmoji: boolean,
    isNewUser: boolean,
  ) => {
    const totalToken = "Bearer " + token;
    const totalHost = "https://" + domain;
    api.setHeader("Authorization", totalToken);
    api.setBaseURL(totalHost);

    // 验证token以及domain是否有效
    const { data: account, ok: accountOk } = await verifyToken();
    console.log("验证token是否有效，并返回当前账户信息", accountOk);
    if (!accountOk || !account) {
      Toast.show("验证用户信息失败，请重新登录");
      router.replace("/");
    }
    // 保存account信息，并设置为currentAccount
    useAccountStore.getState().setCurrentAccount(account!);

    set({ token: totalToken, hostURL: totalHost, isReady: true });

    if (isEmoji) {
      // 请求并保存当前实例emoji信息
      const { data: emoji } = await getInstanceEmojis();
      useEmojiStore.getState().setEmoji(emoji);
    }
    if (isNewUser) {
      get().addNewUser(token, domain, account!);
    }
  },
  addNewUser: async (token: string, domain: string, account: Account) => {
    const emoji = useEmojiStore.getState().emojis;
    const user = {
      domain,
      token,
      acct: `@${account?.acct}@${domain}`,
      emoji: JSON.stringify(emoji) || "",
    };

    const newUser = [...get().multipleUser];
    newUser.push(user);

    set({ multipleUser: newUser });
    // 保存到localstorage
    setItem(constant.MULTIPLEUSER, JSON.stringify(newUser));
  },

  initApp: async () => {
    console.log("initApp");
    const multipleUserJSON = await getItem(constant.MULTIPLEUSER);

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

    if (multipleUserJSON) {
      const multipleUser = JSON.parse(multipleUserJSON) as MultipleUserProsp[];
      console.log("当前登录的账户数量", multipleUser.length);

      if (multipleUser.length > 0) {
        console.log(
          "账户domain",
          multipleUser.map((m) => m.domain),
        );
        set({ multipleUser });
        // 默认数组第一个用户为登录用户
        const user = multipleUser[0];
        const emojiJSON = user.emoji;
        if (!emojiJSON) {
          get().checkTokenAndDomin(user.token, user.domain, true, false);
        } else {
          useEmojiStore.getState().setEmoji(JSON.parse(emojiJSON));
          get().checkTokenAndDomin(user.token, user.domain, false, false);
        }
      } else {
        set({
          isReady: true,
        });
      }
    } else {
      set({
        isReady: true,
      });
    }
  },
  exitCurrentAccount: () => {
    // TODO:退出当前账号，自动切换到下一个账号，如果没有则退出到登录页面
    clear();
  },
}));

export default useAppStore;
