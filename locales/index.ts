import en from "./en";
import zh from "./zh";
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en,
  zh,
};

// const i18n = new I18n(translations);

// export const initI18n = () => {
//   i18n.locale = getLocales()[0].languageCode ?? 'en';
//   i18n.enableFallback = true;
// };

export default translations;
// export default i18n;
