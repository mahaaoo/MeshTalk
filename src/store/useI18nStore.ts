import { I18n } from "i18n-js";
import { create } from "zustand";

import { SupportLocaleProps, translations, support } from "../../locales";
interface I18nState {
  i18n: I18n;
  getSupportLocale: () => SupportLocaleProps[];
}

const useI18nStore = create<I18nState>((set, get) => ({
  i18n: new I18n(translations),
  getSupportLocale: () => {
    return support;
  },
}));

export default useI18nStore;
