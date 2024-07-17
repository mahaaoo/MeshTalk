import en from "./en";
import zh from "./zh";

export interface SupportLocaleProps {
  language: string; // 简体中文
  locale: string; // zh
}

export const translations = {
  en,
  zh,
};

export const support = Object.values(translations).map((values) => {
  return {
    language: values.language,
    locale: values.locale,
  };
}) as SupportLocaleProps[];

export default translations;
