import { create } from "zustand";
import { I18n } from 'i18n-js';
import translations from "../../locales";


// 隐私内容已经点击过显示，则记录下来，避免因为list重用而导致的错误渲染

interface I18nState {
  i18n: any;
  initI18n: () => void;
  switchLocale: () => void;
}

const useI18nStore = create<I18nState>((set, get) => ({
  i18n: undefined,
  initI18n: () => {
    const i18n = new I18n(translations);
    // Set the locale once at the beginning of your app.
    i18n.locale = "en";
    i18n.enableFallback = true;
    set({
      i18n,
    });
  },
  switchLocale: () => {
    const i18n = new I18n(translations);
    // Set the locale once at the beginning of your app.
    i18n.locale = "zh";
    i18n.enableFallback = true;
    set({
      i18n,
    });
  }
}));

export default useI18nStore;
