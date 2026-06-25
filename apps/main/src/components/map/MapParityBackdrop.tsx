import { resolveMapParityBackdrop } from "./mapParityAssets"

interface MapParityBackdropProps {
  enabled: boolean
}

export function MapParityBackdrop({ enabled }: MapParityBackdropProps) {
  if (!enabled) {
    return null
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#efeff4]">
      <img alt="" className="block h-[798px] w-[393px] max-w-none" src={resolveMapParityBackdrop()} />
    </div>
  )
}
