import { create } from "zustand";

import { SupportLocaleProps } from "../../locales";

interface PreferenceStoreState {
  local: SupportLocaleProps | undefined;
  sensitive: boolean;
  openURLType: "app" | "brower";
  replyPermission: object;
  autoPlayGif: boolean;
}

const usePreferenceStore = create<PreferenceStoreState>((set, get) => ({
  local: undefined,
  sensitive: false,
  openURLType: "app",
  replyPermission: {},
  autoPlayGif: true,
}));

export default usePreferenceStore;
