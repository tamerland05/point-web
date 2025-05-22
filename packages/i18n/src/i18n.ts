import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const importTranslation = (language: string, ns: string) => {
  console.debug(`Импорт перевода: язык=${language}, пространство имен=${ns}`);

  return import(`./locale/${language}/${ns}.json`)
    .then((module) => module)
    .catch((error) => {
      throw error;
    });
};

i18n
  .use(resourcesToBackend(importTranslation))
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    ns: ["common"],
    defaultNS: "common",
    fallbackNS: "common",

    fallbackLng: "en",
    debug: true,

    detection: {
      convertDetectedLanguage: (lng) => lng.split("-")[0] || lng,
    },

    interpolation: {
      escapeValue: false,
    },
  });

i18n.services.formatter?.add("notNaN", (value) => {
  if (value === "NaN" || value === "не число") {
    return "";
  }

  return `${value}`;
});

i18n.services.formatter?.add("rightSpace", (value) => {
  if (value === undefined || value === "") {
    return "";
  }

  return `${value} `;
});

export default i18n;
