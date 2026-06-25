import { useTranslation } from "@point/i18n"

import { mapAssets } from "./mapAssets"

interface DecorMarker {
  icon: string
  labelKey: string
  left: number
  textClassName: string
  textSizeClassName?: string
  top: number
}

const DECOR_MARKERS: DecorMarker[] = [
  {
    icon: mapAssets.fastFood,
    labelKey: "WAVE1.MAP.MARKER_FAST_FOOD",
    left: 82,
    textClassName: "text-[#ff8e00]",
    top: 44,
  },
  { icon: mapAssets.noodle, labelKey: "WAVE1.MAP.MARKER_NOODLE", left: 177, textClassName: "text-[#1e1e1c]", top: 194 },
  { icon: mapAssets.pizza, labelKey: "WAVE1.MAP.MARKER_PIZZA", left: 311, textClassName: "text-[#e13738]", top: 150 },
  {
    icon: mapAssets.salad,
    labelKey: "WAVE1.MAP.MARKER_VEGETARIAN",
    left: 71,
    textClassName: "text-[#69c700]",
    top: 225,
  },
  { icon: mapAssets.noodle, labelKey: "WAVE1.MAP.MARKER_NOODLE", left: 161, textClassName: "text-[#ad8b43]", top: 288 },
  { icon: mapAssets.coffee, labelKey: "WAVE1.MAP.MARKER_COFFEE", left: 279, textClassName: "text-[#0a78ff]", top: 239 },
  {
    icon: mapAssets.seafood,
    labelKey: "WAVE1.MAP.MARKER_SEAFOOD",
    left: 312,
    textClassName: "text-[#dd5948]",
    top: 323,
  },
  { icon: mapAssets.bar, labelKey: "WAVE1.MAP.MARKER_BAR", left: 24, textClassName: "text-[#9c2bff]", top: 351 },
  { icon: mapAssets.fish, labelKey: "WAVE1.MAP.MARKER_FISH", left: 116, textClassName: "text-[#2f619d]", top: 417 },
  { icon: mapAssets.noodle, labelKey: "WAVE1.MAP.MARKER_NOODLE", left: 310, textClassName: "text-[#ad8b43]", top: 497 },
  { icon: mapAssets.bar, labelKey: "WAVE1.MAP.MARKER_BAR", left: 127, textClassName: "text-[#9c2bff]", top: 523 },
  { icon: mapAssets.coffee, labelKey: "WAVE1.MAP.MARKER_COFFEE", left: 11, textClassName: "text-[#0a78ff]", top: 585 },
  {
    icon: mapAssets.salad,
    labelKey: "WAVE1.MAP.MARKER_VEGETARIAN",
    left: 226,
    textClassName: "text-[#69c700]",
    top: 579,
  },
]

export function MapFigmaDecorMarkers() {
  const { t } = useTranslation()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[6]">
      <div className="absolute top-[338px] left-[239px] flex size-[117px] items-center justify-center">
        <img alt="" className="size-full object-contain" src={mapAssets.pinGradient} />
      </div>

      {DECOR_MARKERS.map((marker) => (
        <div
          className="absolute flex w-20 flex-col items-center gap-0.5"
          key={`${marker.labelKey}-${marker.left}-${marker.top}`}
          style={{ left: marker.left, top: marker.top }}
        >
          <img alt="" className="size-[30px] object-contain" src={marker.icon} />
          <p
            className={`text-center font-medium text-[13px] leading-none tracking-[0.2px] ${marker.textSizeClassName ?? ""} ${marker.textClassName}`}
          >
            {t(marker.labelKey)}
          </p>
        </div>
      ))}
    </div>
  )
}
