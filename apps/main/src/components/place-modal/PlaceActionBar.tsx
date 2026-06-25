import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"

import { mapAssets } from "@/components/map/mapAssets"

import { placeAssets } from "./placeAssets"

interface PlaceActionBarProps {
  distanceLabel?: string | null
  hasChannel?: boolean
  onBookingClick: () => void
  onChannelClick: () => void
}

export function PlaceActionBar({ distanceLabel, hasChannel, onBookingClick, onChannelClick }: PlaceActionBarProps) {
  const { t } = useTranslation()

  return (
    <div className="-mx-4 sticky bottom-0 mt-6 flex items-stretch gap-2 bg-[#efeff4] px-4 pt-2 pb-4">
      <div
        aria-hidden
        className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl bg-accent px-4 py-3 text-white"
      >
        <div className="flex min-w-0 items-center gap-2">
          <img alt="" className="h-5 w-5 shrink-0 brightness-0 invert" src={placeAssets.route} />
          <span className="truncate font-medium text-[17px]">{t("WAVE1.PLACE.ROUTE")}</span>
        </div>
        {distanceLabel ? (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-0.5">
            <img alt="" className="h-2.5 w-2" src={mapAssets.pin} />
            <span className="font-medium text-[12px] text-accent">{distanceLabel}</span>
          </div>
        ) : null}
      </div>

      <button
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white"
        onClick={onBookingClick}
        type="button"
      >
        <img alt="" className="h-5 w-5" src={placeAssets.calendar} />
      </button>

      <button
        className={cn(
          "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white",
          !hasChannel && "opacity-40"
        )}
        disabled={!hasChannel}
        onClick={onChannelClick}
        type="button"
      >
        <Icon className="h-5 w-5 text-accent" name="Globe Europe Africa Fill" />
      </button>

      <button
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white opacity-40"
        disabled
        type="button"
      >
        <Icon className="h-5 w-5 text-accent" name="Share" />
      </button>
    </div>
  )
}
