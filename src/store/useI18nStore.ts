import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { create } from "zustand";

import { SupportLocaleProps, translations, support } from "../../locales";
interface I18nState {
  i18n: I18n;
  initI18n: () => void;
  local: SupportLocaleProps | undefined;
  switchLocale: (local: SupportLocaleProps) => void;
  getSupportLocale: () => SupportLocaleProps[];
}

const useI18nStore = create<I18nState>((set, get) => ({
  i18n: new I18n(translations),
  local: undefined,
  initI18n: () => {
    const i18n = get().i18n;
    let languageCode = getLocales()[0].languageCode ?? "en";
    let local;

    if (support.map((sup) => sup.locale).indexOf(languageCode) === -1) {
      // app不支持当前地区语言，默认en
      languageCode = "en";
    }

    i18n.locale = languageCode;

    support.forEach((sup) => {
      if (sup.locale === languageCode) {
        local = { ...sup };
      }
    });

    i18n.enableFallback = true;
    set({
      i18n,
      local,
    });
  },
  getSupportLocale: () => {
    return support;
  },
  switchLocale: (local: SupportLocaleProps) => {
    const i18n = get().i18n;
    i18n.locale = local.locale;

    set({
      i18n,
      local,
    });
  },
}));

export default useI18nStore;
