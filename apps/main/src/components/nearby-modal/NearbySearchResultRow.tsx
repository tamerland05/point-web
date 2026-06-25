import { memo } from "react"

import { SelectionsStarRating } from "@/components/selections/SelectionsStarRating"
import { selectionsAssets } from "@/components/selections/selectionsAssets"

export interface NearbySearchResultItem {
  distance: string
  hours: string | null
  id: string
  image: string
  logo?: string
  stars: "4" | "5"
  subtitle: string
  title: string
}

export const NearbySearchResultRow = memo(function NearbySearchResultRow({
  item,
  onClick,
}: {
  item: NearbySearchResultItem
  onClick: () => void
  parityCapture: boolean
}) {
  return (
    <button
      className="flex h-[106px] w-full items-center gap-4 rounded-[16px] bg-white px-4 text-left focus:outline-none active:bg-black/[0.02]"
      onClick={onClick}
      type="button"
    >
      <div className="relative h-[82px] w-[100px] shrink-0">
        <div className="absolute top-[5.5px] right-0 h-[71px] w-[67px] overflow-hidden rounded-[10px]">
          <img alt="" className="size-full object-cover" src={item.image} />
        </div>
        {item.logo ? (
          <div className="absolute top-0 left-0 flex h-[82px] w-[78px] items-center justify-center">
            <div className="backface-hidden rotate-[-10.53deg] skew-x-[-1.03deg] transform-gpu">
              <div className="h-[71px] w-[67px] overflow-hidden rounded-[10px] border-2 border-white">
                <img alt="" className="size-full object-cover" src={item.logo} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex flex-col gap-[2px]">
          <p className="font-medium text-[#222222] text-[17px] leading-[19px]">{item.title}</p>
          <p className="truncate text-[#8d969d] text-[15px] leading-[19px]">{item.subtitle}</p>
        </div>

        <SelectionsStarRating className="mt-1" stars={item.stars} />

        <div className="mt-2 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-2xl bg-[#efeff4] px-1.5 py-[3px]">
            <img alt="" className="h-2.5 w-2" src={selectionsAssets.pin} />
            <span className="text-[12px] text-accent">{item.distance}</span>
          </div>
          {item.hours ? (
            <div className="flex items-center gap-1 rounded-xl bg-[#efeff4] px-1.5 py-[3px]">
              <img alt="" className="size-2.5" src={selectionsAssets.clock} />
              <span className="text-[12px] text-accent">{item.hours}</span>
            </div>
          ) : null}
        </div>
      </div>
    </button>
  )
})

NearbySearchResultRow.displayName = "NearbySearchResultRow"
