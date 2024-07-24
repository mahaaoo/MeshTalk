import { create } from "zustand";

import { I18n } from "i18n-js";

import { SupportLocaleProps, translations, support } from "../../locales";
import { getLocales } from "expo-localization";
import { getItem } from "@utils/storage";
import { PREFERENCES } from "../config/constant";
import useI18nStore from "./useI18nStore";

interface PreferenceStorage {
  local: SupportLocaleProps;
  sensitive: boolean;
  openURLType: "app" | "brower";
  replyPermission: object;
  autoPlayGif: boolean;
}

interface PreferenceStoreState {
  local: SupportLocaleProps | undefined;
  sensitive: boolean;
  openURLType: "app" | "brower";
  replyPermission: object;
  autoPlayGif: boolean;
  switchLocal: (local: SupportLocaleProps) => void;
  initPreference: () => void;
}

const initLocale = () => {
  let languageCode = getLocales()[0].languageCode ?? "en";
  let local;

  if (support.map((sup) => sup.locale).indexOf(languageCode) === -1) {
    // app不支持当前地区语言，默认en
    languageCode = "en";
  }

  support.forEach((sup) => {
    if (sup.locale === languageCode) {
      local = { ...sup };
    }
  });
  return {
    local,
    languageCode,
  };
};

const usePreferenceStore = create<PreferenceStoreState>((set, get) => ({
  local: undefined,
  sensitive: false,
  openURLType: "app",
  replyPermission: {},
  autoPlayGif: true,
  switchLocal: (local: SupportLocaleProps) => {
    set({
      local,
    });
  },
  initPreference: async () => {
    const i18n = new I18n(translations);
    i18n.enableFallback = true;
    let initLocal;
    const preferenceJson = await getItem(PREFERENCES);
    if (preferenceJson) {
      const preference = JSON.parse(preferenceJson) as PreferenceStorage;

      if (preference.local) {
        i18n.locale = preference.local.locale;
        initLocal = preference.local;
      } else {
        // 初始化偏好设置
        const { languageCode, local } = initLocale();
        i18n.locale = languageCode;
        initLocal = local;
      }
    } else {
      const { languageCode, local } = initLocale();
      i18n.locale = languageCode;
      initLocal = local;
    }

    useI18nStore.setState({
      i18n,
    });
    set({
      local: initLocal,
    });
  },
}));

export default usePreferenceStore;
