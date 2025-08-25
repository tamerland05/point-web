import i18n from "i18next"
import languageDetector from "i18next-browser-languagedetector"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next"

const importTranslation = (language: string, ns: string) => {
  console.debug(`Импорт перевода: язык=${language}, пространство имен=${ns}`)

  return import(`./locale/${language}/${ns}.json`)
    .then((module) => module)
    .catch((error) => {
      throw error
    })
}

i18n
  .use(resourcesToBackend(importTranslation))
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    defaultNS: "common",
    detection: {
      convertDetectedLanguage: (lng) => lng.split("-")[0] || lng,
    },
    fallbackLng: "en",
    fallbackNS: "common",
    interpolation: {
      escapeValue: false,
    },
    ns: ["common"],
  })

i18n.services.formatter?.add("notNaN", (value) => {
  if (value === "NaN" || value === "не число") {
    return ""
  }

  return `${value}`
})

i18n.services.formatter?.add("rightSpace", (value) => {
  if (value === undefined || value === "") {
    return ""
  }

  return `${value} `
})

export default i18n
