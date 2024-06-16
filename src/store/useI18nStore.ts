import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { create } from "zustand";

import translations, { SupportLocale } from "../../locales";

// 隐私内容已经点击过显示，则记录下来，避免因为list重用而导致的错误渲染

interface I18nState {
  i18n: I18n;
  initI18n: () => void;
  switchLocale: (local: SupportLocale) => void;
}

const useI18nStore = create<I18nState>((set, get) => ({
  i18n: new I18n(translations),
  initI18n: () => {
    const i18n = get().i18n;
    i18n.locale = getLocales()[0].languageCode ?? "en";
    i18n.enableFallback = true;
    set({
      i18n,
    });
  },
  switchLocale: (local: SupportLocale) => {
    const i18n = get().i18n;
    i18n.locale = local;
    set({
      i18n,
    });
  },
}));

export default useI18nStore;
