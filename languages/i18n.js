import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr, es, it, de, zh, ar, tr, ja, pt } from "./translations";
const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
  it: {
    translation: it,
  },
  de: {
    translation: de,
  },
  zh: {
    translation: zh,
  },
  ar: {
    translation: ar,
  },
  tr: {
    translation: tr,
  },
  ja: {
    translation: ja,
  },
  pt: {
    translation: pt,
  }
};

i18next
  .use(initReactI18next).init({
    debug: true,
    resources,
    lng: 'fr', // Langue par défaut
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;