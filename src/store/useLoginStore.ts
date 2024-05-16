import { router } from "expo-router";
import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import useAccountStore from "./useAccountStore";
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
  path: "m.cmx.im",
  loginData: undefined,
  onChangePath: (text: string) => {
    set({ path: text });
  },
  onPressLogin: async () => {
    if (get().path.length > 0) {
      const { data } = await getAppConfig("https://" + get().path);
      if (data) {
        set({ loginData: data });

        const url = `https://${get().path}/oauth/authorize?scope=read%20write%20follow%20push&response_type=code&redirect_uri=${get().loginData?.redirect_uri}&client_id=${get().loginData?.client_id}`;
        router.push({
          pathname: "/webview",
          params: {
            initUrl: url,
          },
        });
      }
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
    const { data } = await getToken("https://" + get().path, params);
    if (data) {
      useAppStore.getState().setHostURL("https://" + get().path);
      useAppStore.getState().setToken(data.access_token);
      useAppStore
        .getState()
        .afterToken(data.access_token, "https://" + get().path);
      await useAccountStore.getState().verifyToken();
      router.replace("/");
    }
  },
}));

export default useLoginStore;
