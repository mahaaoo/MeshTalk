import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { AppInterface, AppToken } from "../config/interface";
import { getAppConfig, getToken } from "../server/app";
import useAppStore from "../store/useAppStore";
import { navigate, reset } from "../utils";

interface LoginStoreState {
  path: string;
  loginData: AppInterface;
  tokenData: AppToken;
  onChangePath: (text: string) => void;
  onPressLogin: () => void;
  webGetToken: (code: string) => void;
}

const useLoginStore = create<LoginStoreState>((set, get) => ({
  path: "mastodon.social",
  loginData: undefined,
  tokenData: undefined,
  onChangePath: (text: string) => {
    set({ path: text });
  },
  onPressLogin: async () => {
    if (get().path.length > 0) {
      const data = await getAppConfig("https://" + get().path);
      if (data) {
        set({ loginData: data });

        const url = `https://${get().path}/oauth/authorize?scope=read%20write%20follow%20push&response_type=code&redirect_uri=${get().loginData?.redirect_uri}&client_id=${get().loginData?.client_id}`;
        navigate("WebView", {
          initUrl: url,
          callBack: get().webGetToken,
        });
      }
    } else {
      Toast.show("请输入应用实例地址");
    }
  },
  webGetToken: async (code: string) => {
    const params = {
      client_id: get().loginData.client_id,
      client_secret: get().loginData.client_secret,
      code,
    };
    const data = await getToken("https://" + get().path, params);
    if (data) {
      set({ tokenData: data });
      useAppStore.getState().setHostURL("https://" + get().path);
      useAppStore.getState().setToken(get().tokenData.access_token);
      reset("App");
    }
  },
}));

export default useLoginStore;
