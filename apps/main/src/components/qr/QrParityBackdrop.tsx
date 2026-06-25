import { qrAssets } from "./qrAssets"

interface QrParityBackdropProps {
  enabled: boolean
}

export function QrParityBackdrop({ enabled }: QrParityBackdropProps) {
  if (!enabled) {
    return null
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#efeff4]">
      <img alt="" className="block h-[798px] w-full max-w-none object-cover object-top" src={qrAssets.topBackdrop} />
    </div>
  )
}
