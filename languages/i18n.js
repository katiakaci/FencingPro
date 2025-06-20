import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr, es, pt_br, it, zh, de, ja, tr } from "./translations"; // ar, ru
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
  pt_br: {
    translation: pt_br
  },
  it: {
    translation: it,
  },
  zh: {
    translation: zh,
  },
  de: {
    translation: de,
  },
  tr: {
    translation: tr,
  },
  ja: {
    translation: ja,
  },
  // ar: {
  //   translation: ar,
  // },
  // ru: {
  //   translation: ru,
  // },
}

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