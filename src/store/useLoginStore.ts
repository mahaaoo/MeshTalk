import { router } from "expo-router";
import { Platform } from "react-native";
import { Loading, Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { AppInterface } from "../config/interface";
import { getAppConfig, getToken } from "../server/app";
import useAppStore from "../store/useAppStore";
import { getItem, setItem } from "@utils/storage";
import * as constant from "../config/constant";

interface LoginStoreState {
  path: string;
  loginData: AppInterface | undefined;
  onChangePath: (text: string) => void;
  onPressLogin: () => void;
  webGetToken: (code: string) => void;
}

const useLoginStore = create<LoginStoreState>((set, get) => ({
  path: "",
  loginData: undefined,
  onChangePath: (text: string) => {
    set({ path: text });
  },
  onPressLogin: async () => {
    if (get().path.length > 0) {
      Loading.show();
      const { data, ok } = await getAppConfig("https://" + get().path);
      if (data && ok) {
        set({ loginData: data });

        const url = `https://${get().path}/oauth/authorize?scope=read%20write%20follow%20push&response_type=code&redirect_uri=${get().loginData?.redirect_uri}&client_id=${get().loginData?.client_id}`;

        if (Platform.OS === "web") {
          const tempData = {
            ...data,
            path: get().path,
          };
          window.open(url);
          // 由于回调回来的webview是新的窗口，所以需要通过localstorage来存储path
          // zustand无法持有path
          setItem(constant.WEBTEMPDATA, JSON.stringify(tempData));
        } else {
          router.push({
            pathname: "/webview",
            params: {
              initUrl: url,
            },
          });
        }
      } else {
        Toast.show("请检查网络设置");
      }
      Loading.hide();
    } else {
      Toast.show("请输入应用实例地址");
    }
  },
  webGetToken: async (code: string) => {
    let params: object = {
      code,
    };
    Loading.show();
    let path;
    if (Platform.OS === "web") {
      const tempDataJson = await getItem(constant.WEBTEMPDATA);
      const tempData = JSON.parse(tempDataJson || "");
      params = {
        ...params,
        client_id: tempData?.client_id,
        client_secret: tempData?.client_secret,
      };
      path = tempData?.path;
    } else {
      path = get().path;
      params = {
        ...params,
        client_id: get().loginData?.client_id,
        client_secret: get().loginData?.client_secret,
      };
    }

    const { data, ok } = await getToken("https://" + path, params);
    if (data && ok) {
      await useAppStore
        .getState()
        .checkTokenAndDomin(data.access_token, path, true, true);
      router.replace("/");
    }
    Loading.hide();
  },
}));

export default useLoginStore;
