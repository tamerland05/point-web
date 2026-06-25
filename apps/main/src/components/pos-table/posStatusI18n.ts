/** Минимальный тип `t` из `useTranslation()` для POS-строк. */
type PosTranslate = (key: string, options?: Record<string, unknown>) => unknown

const ORDER_STATUS_KEYS: Record<string, string> = {
  awaiting_payment: "POS.ORDER_STATUS.AWAITING_PAYMENT",
  cancelled: "POS.ORDER_STATUS.CANCELLED",
  draft: "POS.ORDER_STATUS.DRAFT",
  failed: "POS.ORDER_STATUS.FAILED",
  paid: "POS.ORDER_STATUS.PAID",
}

const PAYMENT_STATUS_KEYS: Record<string, string> = {
  failed: "POS.PAYMENT_STATUS.FAILED",
  pending: "POS.PAYMENT_STATUS.PENDING",
  succeeded: "POS.PAYMENT_STATUS.SUCCEEDED",
}

export function posOrderStatusLabel(t: PosTranslate, status: string): string {
  const k = (status ?? "").toLowerCase()
  const path = ORDER_STATUS_KEYS[k]
  return path ? String(t(path)) : String(t("POS.ORDER_STATUS.UNKNOWN", { status: status || "—" }))
}

export function posPaymentStatusLabel(t: PosTranslate, status: string): string {
  const k = (status ?? "").toLowerCase()
  const path = PAYMENT_STATUS_KEYS[k]
  return path ? String(t(path)) : String(t("POS.PAYMENT_STATUS.UNKNOWN", { status: status || "—" }))
}
