/** ISO 4217 codes from POS orders → display symbol (backend stores e.g. `RUB`, not `₽`). */
const ISO_TO_SYMBOL: Record<string, string> = {
  BYN: "Br",
  EUR: "€",
  GBP: "£",
  KZT: "₸",
  RUB: "₽",
  UAH: "₴",
  USD: "$",
}

export function posOrderCurrencyDisplay(code: string | null | undefined): string {
  if (code == null || code === "") {
    return "₽"
  }
  const upper = code.trim().toUpperCase()
  return ISO_TO_SYMBOL[upper] ?? code
}
