import { create } from "zustand";
import { I18n } from "i18n-js";
import { SupportLocaleProps, translations, support } from "../../locales";
import { getLocales } from "expo-localization";
import { getItem } from "@utils/storage";
import { PREFERENCES } from "../config/constant";
import useI18nStore from "./useI18nStore";
import { getPostVisibility, PostVisibility } from "@config/i18nText";

type PreferenceStorage = Pick<
  PreferenceStoreState,
  "local" | "sensitive" | "openURLType" | "replyVisibility" | "autoPlayGif"
>;

export type OpenURLType = "open_link_in_app" | "open_link_in_browser";

interface PreferenceStoreState {
  local: SupportLocaleProps | undefined;
  sensitive: boolean;
  openURLType: OpenURLType;
  replyVisibility: PostVisibility;
  autoPlayGif: boolean;
  switchLocal: (local: SupportLocaleProps) => void;
  initPreference: () => void;
}

// 初始化本地信息
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
  openURLType: "open_link_in_app",
  replyVisibility: {} as PostVisibility,
  autoPlayGif: true,
  switchLocal: (local: SupportLocaleProps) => {
    const i18n = useI18nStore.getState().i18n;
    i18n.locale = local.locale;

    useI18nStore.setState({
      i18n,
    });
    set({
      local,
    });
  },
  initPreference: async () => {
    const i18n = new I18n(translations);
    i18n.enableFallback = true;
    let initLocal;
    let replyVisibility;
    let openURLType: OpenURLType = "open_link_in_app";
    const preferenceJson = await getItem(PREFERENCES);
    if (preferenceJson) {
      const preference = JSON.parse(preferenceJson) as PreferenceStorage;

      if (!!preference?.local) {
        i18n.locale = preference.local.locale;
        initLocal = preference.local;
      } else {
        // 初始化偏好设置
        const { languageCode, local } = initLocale();
        i18n.locale = languageCode;
        initLocal = local;
      }
      // 初始化默认回复可见范围
      if (!!preference?.replyVisibility) {
        replyVisibility = preference.replyVisibility;
      } else {
        replyVisibility = getPostVisibility()[0];
      }
      // 初始化链接打开方式
      if (!!preference?.openURLType) {
        openURLType = preference.openURLType;
      }
    } else {
      const { languageCode, local } = initLocale();
      i18n.locale = languageCode;
      initLocal = local;
      replyVisibility = getPostVisibility()[0];
    }

    useI18nStore.setState({
      i18n,
    });
    set({
      local: initLocal,
      replyVisibility,
      openURLType,
    });
  },
}));

usePreferenceStore.subscribe((state) => {
  const { local, sensitive, openURLType, replyVisibility, autoPlayGif } = state;
  console.log("state发生改变", {
    local,
    sensitive,
    openURLType,
    replyVisibility,
    autoPlayGif,
  });
});

export default usePreferenceStore;
