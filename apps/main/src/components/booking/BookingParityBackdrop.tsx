import { type BookingParityVariant, resolveBookingParityBackdrop } from "./bookingParityAssets"

interface BookingParityBackdropProps {
  enabled: boolean
  variant: BookingParityVariant
}

export function BookingParityBackdrop({ enabled, variant }: BookingParityBackdropProps) {
  if (!enabled) {
    return null
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#efeff4]">
      <img alt="" className="w-full max-w-none object-cover object-top" src={resolveBookingParityBackdrop(variant)} />
    </div>
  )
}
