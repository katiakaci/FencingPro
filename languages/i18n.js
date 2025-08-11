import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr, es, it, de } from "./translations";
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