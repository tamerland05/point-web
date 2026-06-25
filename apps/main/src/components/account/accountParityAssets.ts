export const accountParityAssets = {
  historyBackdrop: "/parity/account/history-backdrop.png",
  notificationsBackdrop: "/parity/account/notifications-backdrop.png",
  paymentBackdrop: "/parity/account/payment-backdrop.png",
} as const

export type AccountParityVariant = keyof {
  history: true
  notifications: true
  payment: true
}

const backdropByVariant = {
  history: accountParityAssets.historyBackdrop,
  notifications: accountParityAssets.notificationsBackdrop,
  payment: accountParityAssets.paymentBackdrop,
} as const

export function resolveAccountParityBackdrop(variant: AccountParityVariant) {
  return backdropByVariant[variant]
}
