import { useMemo } from "react"

import { useTranslation } from "@point/i18n"

import {
  formatCurrency,
  formatDate,
  formatFromNano,
  formatRelativeTime,
  formatTime,
  formatTokenValue,
  formatToNano,
} from "@/utils/format"

/**
 * @deprecated we can use i18n built-in formatter instead, only exeption is nanoFormatters, formatTokenValue and formatRelativeTime
 */
export const useFormatter = () => {
  const { i18n } = useTranslation()
  const { language } = i18n

  return useMemo(
    () => ({
      formatCurrency: (price: number | undefined) => formatCurrency(price, language),
      formatDate: (date: Date | undefined, detailed = true, options: Intl.DateTimeFormatOptions = {}) =>
        formatDate(date, detailed, options, language),
      formatFromNano: (value: string | bigint | number | undefined, decimals = 9) => formatFromNano(value, decimals),
      formatRelativeTime: (date: Date | undefined) => formatRelativeTime(date, language),
      formatTime: (date: Date | undefined, options: Intl.DateTimeFormatOptions = {}) =>
        formatTime(date, options, language),
      formatTokenValue: (value: number | bigint | undefined) => formatTokenValue(value, language),
      formatToNano: (value: string | number | undefined, decimals = 9) => formatToNano(value, decimals),
    }),
    [language]
  )
}
