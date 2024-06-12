import { router } from "expo-router";
import { Platform } from "react-native";
import { Loading, Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { AppInterface } from "../config/interface";
import { getAppConfig, getToken } from "../server/app";
import useAppStore from "../store/useAppStore";

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
          window.open(url);
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
    const params = {
      client_id: get().loginData?.client_id,
      client_secret: get().loginData?.client_secret,
      code,
    };
    const { data, ok } = await getToken("https://" + get().path, params);
    if (data && ok) {
      await useAppStore
        .getState()
        .checkTokenAndDomin(data.access_token, get().path, true, true);
      router.replace("/");
    }
  },
}));

export default useLoginStore;
