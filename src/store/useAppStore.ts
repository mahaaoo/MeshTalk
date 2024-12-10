import { router } from "expo-router";
import { Platform } from "react-native";
import { Toast } from "react-native-ma-modal";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import useAccountStore from "./useAccountStore";
import useEmojiStore from "./useEmojiStore";
import useStatusStore from "./useStatusStore";
import * as constant from "../config/constant";
import { getInstanceEmojis, verifyToken } from "../server/app";
import { api } from "../utils/request";
import { setItem, getItem, removeItem } from "../utils/storage";
import useLoginStore from "./useLoginStore";
import usePublishStore from "./usePublishStore";

interface MultipleUserProsp {
  // 为了方便多账号显示，这里的acct拼接上了domain，如：@mesh@m.cmx.im
  // 和Account里面的acct并不一致
  // 可以作为MultipleUser的id使用
  acct: string;
  avatar: string;
  displayName: string;
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
  switchUser: (user: MultipleUserProsp, sort: boolean) => void;
  initApp: () => void;
  // updateMultipleUser: () => void;
  exitCurrentAccount: (acct: string) => void;
  resetStore: () => void; // 删除store所有内容
}

const useAppStore = create(
  subscribeWithSelector<AppStoreState>((set, get) => ({
    multipleUser: [],
    hostURL: undefined,
    token: undefined,
    isReady: false,
    resetStore: () =>
      set({
        multipleUser: [],
        hostURL: undefined,
        token: undefined,
        isReady: false,
      }),
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
        set({ isReady: true });
        return;
      }
      // 保存account信息，并设置为currentAccount
      useAccountStore.getState().setCurrentAccount(account!);

      set({ token: totalToken, hostURL: totalHost, isReady: true });

      if (isEmoji) {
        // 请求并保存当前实例emoji信息
        const { data: emoji } = await getInstanceEmojis();
        useEmojiStore.getState().setEmoji(emoji);
      }

      const emoji = useEmojiStore.getState().emojis;

      const multipleUser = get().multipleUser;

      const user: MultipleUserProsp = {
        domain,
        token,
        acct: `@${account?.acct}@${domain}`,
        displayName: account?.display_name || "",
        avatar: account!.avatar,
        emoji: JSON.stringify(emoji) || "",
      };

      if (isNewUser) {
        // 新增用户则添加到用户列表
        multipleUser.unshift(user);
        // 保存到localstorage
        setItem(constant.MULTIPLEUSER, JSON.stringify(multipleUser));
      } else {
        // 更新当前用户信息
        const index = multipleUser.map((m) => m.token).indexOf(token);
        if (index > -1) {
          multipleUser[index] = user;
        }
      }

      set({ multipleUser });
    },
    switchUser: (user: MultipleUserProsp, sort: boolean) => {
      const multipleUser = get().multipleUser;
      // 当前选中的用户排序到数组首位
      if (multipleUser.length > 1 && sort) {
        const index = multipleUser.map((m) => m.acct).indexOf(user.acct);
        if (index > -1) {
          const removed = multipleUser.splice(index, 1); // 删除元素并返回它
          multipleUser.unshift(...removed); // 将元素添加到数组开头
        }
        set({ multipleUser });
        setItem(constant.MULTIPLEUSER, JSON.stringify(multipleUser));
      }

      const emojiJSON = user.emoji;
      // 是否已经保存过了emoji，如果没有保存过，在checkTokenAndDomin里需要重新请求
      if (!emojiJSON) {
        get().checkTokenAndDomin(user.token, user.domain, true, false);
      } else {
        useEmojiStore.getState().setEmoji(JSON.parse(emojiJSON));
        get().checkTokenAndDomin(user.token, user.domain, false, false);
      }
    },
    initApp: async () => {
      console.log("initApp");
      const multipleUserJSON = await getItem(constant.MULTIPLEUSER);
      // 需要初始化草稿箱，是否有嘟文保存在了本地
      usePublishStore.getState().initDrafts();

      if (Platform.OS === "web") {
        const url = window.location.search;
        console.log("watch window location", url);
        if (url?.indexOf("code") > 0) {
          const urlList = url.split("?");
          if (urlList.length === 2 && urlList[1].length !== 0) {
            const codeList = urlList[1].split("=");
            useLoginStore.getState().webGetToken(codeList[1]);
          }
        }
        // 测试web
      }

      if (multipleUserJSON) {
        const multipleUser = JSON.parse(
          multipleUserJSON,
        ) as MultipleUserProsp[];
        console.log("当前登录的账户数量", multipleUser.length);

        if (multipleUser.length > 0) {
          console.log(
            "账户domain",
            multipleUser.map((m) => m.domain),
          );
          set({ multipleUser });
          // 默认数组第一个用户为登录用户
          const user = multipleUser[0];
          get().switchUser(user, false);
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
    exitCurrentAccount: (acct: string) => {
      // TODO:退出当前账号，自动切换到下一个账号，如果没有则退出到登录页面
      // TODO:这里需要调用删除oauth2的授权接口
      const multipleUser = get().multipleUser;
      if (multipleUser.length > 1) {
        const index = multipleUser.map((m) => m.acct).indexOf(acct);
        if (index > -1) {
          multipleUser.splice(index, 1); // 删除元素
        }
        setItem(constant.MULTIPLEUSER, JSON.stringify(multipleUser));

        set({ multipleUser });
        router.replace("/");
        // 切换到下一个用户
        const user = multipleUser[0];
        get().switchUser(user, false);
      } else {
        // 重置以下Store里面的所有内容
        const needClearStores = [
          useAccountStore.getState(),
          useAppStore.getState(),
          useStatusStore.getState(),
        ];
        needClearStores.forEach((store) => {
          store.resetStore();
        });

        router.replace("/");

        set({
          isReady: true,
        });

        removeItem(constant.MULTIPLEUSER);
      }
    },
  })),
);

export default useAppStore;
