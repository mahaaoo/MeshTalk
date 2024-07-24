import { I18n } from "i18n-js";
import { create } from "zustand";

import { SupportLocaleProps, translations, support } from "../../locales";
interface I18nState {
  i18n: I18n;
  switchLocale: (local: SupportLocaleProps) => void;
  getSupportLocale: () => SupportLocaleProps[];
}

const useI18nStore = create<I18nState>((set, get) => ({
  i18n: new I18n(translations),
  getSupportLocale: () => {
    return support;
  },
  switchLocale: (local: SupportLocaleProps) => {
    const i18n = get().i18n;
    i18n.locale = local.locale;

    set({
      i18n,
    });
  },
}));

export default useI18nStore;
