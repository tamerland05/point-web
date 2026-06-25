export const formatDate = (
  date: Date | undefined,
  detailed = true,
  customOptions: Intl.DateTimeFormatOptions = {},
  lang = "en-US"
) => {
  if (!date) return ""

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }

  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })

  if (isToday) {
    return detailed ? `${rtf.format(0, "day")}, ${date.toLocaleTimeString(lang, options)}` : rtf.format(0, "day")
  }
  if (isYesterday) {
    return detailed ? `${rtf.format(-1, "day")}, ${date.toLocaleTimeString(lang, options)}` : rtf.format(-1, "day")
  }

  return detailed
    ? `${date.toLocaleDateString(lang, { day: "numeric", month: "long", ...customOptions })}, ${date.toLocaleTimeString(lang, options)}`
    : date.toLocaleDateString(lang, { day: "numeric", month: "long", ...customOptions })
}

export const formatTokenValue = (value: number | bigint | undefined, lang = "en-US") => {
  if (value === undefined) return "N/A"
  if (Number.isNaN(value)) return "N/A"

  let amount: string

  if (value < 0.01) {
    // Для маленьких значений используем maximumSignificantDigits
    amount = new Intl.NumberFormat(lang, {
      maximumSignificantDigits: 6,
      minimumFractionDigits: 0,
      style: "decimal",
      useGrouping: true,
    }).format(value)
  } else {
    // Для остальных значений используем maximumFractionDigits
    amount = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      style: "decimal",
      useGrouping: true,
    }).format(value)
  }

  return amount
}

export const formatCurrency = (price: number | undefined, lang = "en-US") => {
  if (price === undefined) return "N/A"
  if (Number.isNaN(price)) return "N/A"

  let value: string

  if (price < 0.01) {
    // Для маленьких значений используем maximumSignificantDigits
    value = new Intl.NumberFormat(lang, {
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      style: "decimal",
      useGrouping: true,
    }).format(price)
  } else {
    // Для остальных значений используем maximumFractionDigits
    value = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
      style: "decimal",
      useGrouping: true,
    }).format(price)
  }

  return value
}

export const formatFromNano = (value: string | bigint | number | undefined, decimals = 9) => {
  if (value === undefined) return "N/A"

  let bigValue: bigint

  if (typeof value === "string") {
    bigValue = BigInt(value)
  } else if (typeof value === "number") {
    bigValue = BigInt(Math.round(value))
  } else {
    bigValue = value
  }

  const divisor = BigInt(10) ** BigInt(decimals)
  const beforeDecimal = bigValue / divisor
  const afterDecimal = bigValue % divisor

  const beforeDecimalStr = beforeDecimal.toString()
  const afterDecimalStr = afterDecimal.toString().padStart(decimals, "0")

  // biome-ignore lint/style/useTemplate: такой формат более читаем и понятен без излигней когнитивной нагрузки
  const numValue = Number(beforeDecimalStr + "." + afterDecimalStr)

  return numValue
}

export const formatToNano = (value: string | number | undefined, decimals = 9): bigint => {
  if (value === undefined) return BigInt(0)

  let strValue: string

  if (typeof value === "number") {
    if (Number.isNaN(value)) return BigInt(0)
    strValue = value.toString()
  } else {
    strValue = value
  }

  strValue = strValue.replace(",", ".")

  const [integerPart, fractionalPart = ""] = strValue.split(".")
  const paddedFractionalPart = fractionalPart.padEnd(decimals, "0").slice(0, decimals)
  const wholePart = `${integerPart}${paddedFractionalPart}`

  return BigInt(wholePart)
}

export const formatTime = (date: Date | undefined, options: Intl.DateTimeFormatOptions = {}, lang = "en-US") => {
  if (!date) {
    return ""
  }

  return date.toLocaleTimeString(lang, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
    ...options,
  })
}

export const calculateMapDistanceMeters = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number => {
  const earthRadiusMeters = 6_371_000
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const deltaLatitude = toRadians(to.latitude - from.latitude)
  const deltaLongitude = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)
  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(deltaLongitude / 2) ** 2

  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)))
}

export const formatMapDistanceLabel = (meters: number): string => {
  const value = Math.round(meters)

  if (value >= 1000) {
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}м`
  }

  return `${value}м`
}

export const formatRelativeTime = (date: Date | undefined, lang = "en-US"): string => {
  if (!date) return ""

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" })

  if (diffInSeconds < 60) {
    return rtf.format(0, "seconds")
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, "minutes")
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, "hours")
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, "days")
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, "months")
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return rtf.format(-diffInYears, "years")
}
