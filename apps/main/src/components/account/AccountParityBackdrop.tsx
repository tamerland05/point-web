import { type AccountParityVariant, resolveAccountParityBackdrop } from "./accountParityAssets"

interface AccountParityBackdropProps {
  enabled: boolean
  variant: AccountParityVariant
}

export function AccountParityBackdrop({ enabled, variant }: AccountParityBackdropProps) {
  if (!enabled) {
    return null
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#efeff4]">
      <img alt="" className="w-full max-w-none object-cover object-top" src={resolveAccountParityBackdrop(variant)} />
    </div>
  )
}
