export const bookingParityAssets = {
  filledBackdrop: "/parity/booking/filled-backdrop.png",
  processBackdrop: "/parity/booking/process-backdrop.png",
  successBackdrop: "/parity/booking/success-backdrop.png",
} as const

export type BookingParityVariant = keyof {
  filled: true
  process: true
  success: true
}

const backdropByVariant = {
  filled: bookingParityAssets.filledBackdrop,
  process: bookingParityAssets.processBackdrop,
  success: bookingParityAssets.successBackdrop,
} as const

export function resolveBookingParityBackdrop(variant: BookingParityVariant) {
  return backdropByVariant[variant]
}
