import type common from "./locale/en/common.json"

export interface I18nNamespaces {
  common: typeof common
  // more namespaces
}

export { Trans, useTranslation } from "react-i18next"

export { default as i18n } from "./i18n"
export { LANGUAGES_LIST } from "./LIST"
