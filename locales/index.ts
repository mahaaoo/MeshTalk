import en from "./en";
import zh from "./zh";

export interface SupportLocaleProps {
  language: string;
  locale: string;
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
