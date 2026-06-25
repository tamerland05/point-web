import { useTranslation } from "@point/i18n"

import { wave1Assets } from "./wave1Assets"

interface MiniAppOverlayHeaderProps {
  closeLabelKey?: string
  onBackClick?: () => void
  variant?: "back" | "close"
}

export function MiniAppOverlayHeader({ closeLabelKey, onBackClick, variant = "close" }: MiniAppOverlayHeaderProps) {
  const { t } = useTranslation()
  const labelKey = closeLabelKey ?? (variant === "back" ? "WAVE1.BOOKING.BACK" : "WAVE1.SELECTIONS.CLOSE")

  return (
    <div className="flex items-center justify-between">
      <button
        className="flex items-center gap-0.5 rounded-[32px] bg-[rgba(65,63,64,0.4)] py-1 pr-3 pl-1 backdrop-blur-[5px]"
        onClick={onBackClick}
        type="button"
      >
        <span className="flex h-6 w-6 items-center justify-center">
          {variant === "back" ? (
            <img alt="" className="-rotate-90 h-2.5 w-1.5" src={wave1Assets.headerCollapse} />
          ) : (
            <img alt="" className="size-3" src={wave1Assets.headerClose} />
          )}
        </span>
        <span className="font-medium text-[14px] text-white leading-[22px]">{t(labelKey)}</span>
      </button>
      <button
        className="flex h-8 items-center gap-4 rounded-[32px] bg-[rgba(65,63,64,0.4)] px-2 py-1 backdrop-blur-[5px]"
        type="button"
      >
        <img alt="" className="h-2 w-3.5" src={wave1Assets.headerCollapse} />
        <img alt="" className="h-4 w-1" src={wave1Assets.headerMore} />
      </button>
    </div>
  )
}
