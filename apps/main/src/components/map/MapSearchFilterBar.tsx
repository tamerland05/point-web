import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"

import { mapAssets } from "@/components/map/mapAssets"
import { selectionsAssets } from "@/components/selections/selectionsAssets"
import { truncateCategoryLabel } from "@/utils/truncateCategoryLabel"

/** Wave 1 UI-only: price/booking/availability — target NearEstablishmentCriteria extension. */

export type MapFilterPanel = "category" | "price" | "rating" | "booking" | "availability" | null

interface MapSearchFilterBarProps {
  activePanel: MapFilterPanel

  categories?: { id: string; label: string }[]

  categoryValue: string

  hideCategoryFilter?: boolean

  minRating: number | null

  onCategoriesClear?: () => void

  onCategoryToggle?: (categoryId: string) => void

  onPanelChange: (panel: MapFilterPanel) => void

  onRatingChange: (rating: number | null) => void

  selectedCategoryIds?: string[]
}

function FilterChipButton({
  active,

  highlightActive = true,

  label,

  onClick,

  value,

  variant = "text",
}: {
  active: boolean

  highlightActive?: boolean

  label: string

  onClick: () => void

  value: string

  variant?: "price" | "stars" | "text"
}) {
  return (
    <button
      className={cn(
        "flex h-[52px] shrink-0 items-center gap-2 rounded-[12px] bg-white px-2 py-[9px] text-left",

        highlightActive && active && "ring-1 ring-accent ring-inset"
      )}
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      type="button"
    >
      <div className="flex flex-col justify-center">
        <p className="whitespace-nowrap text-[#707579] text-[12px] leading-normal">{label}</p>

        {variant === "stars" ? (
          <img alt="" className="mt-1 h-3.5 w-[62px]" src={selectionsAssets.filterStars} />
        ) : (
          <p className="whitespace-nowrap text-[#222222] text-[17px] leading-normal">{value}</p>
        )}
      </div>

      <img alt="" className="size-5 shrink-0" src={mapAssets.filterChevron} />
    </button>
  )
}

const RATING_OPTIONS = [null, 4, 4.5, 5] as const

export function MapSearchFilterBar({
  activePanel,

  categories = [],

  categoryValue,

  hideCategoryFilter = false,

  minRating,

  onCategoriesClear,

  onCategoryToggle,

  onPanelChange,

  onRatingChange,

  selectedCategoryIds = [],
}: MapSearchFilterBarProps) {
  const { t } = useTranslation()

  const filterAll = t("WAVE1.MAP.FILTER_ALL")

  const selectedSet = new Set(selectedCategoryIds)

  const ratingLabel = minRating === null ? filterAll : t("WAVE1.MAP.FILTER_RATING_FROM", { rating: minRating })

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hideCategoryFilter ? null : (
          <FilterChipButton
            active={activePanel === "category"}
            highlightActive={false}
            label={t("WAVE1.MAP.FILTER_CATEGORY")}
            onClick={() => onPanelChange(activePanel === "category" ? null : "category")}
            value={categoryValue}
          />
        )}

        <FilterChipButton
          active={activePanel === "price"}
          label={t("WAVE1.MAP.FILTER_PRICE")}
          onClick={() => onPanelChange(activePanel === "price" ? null : "price")}
          value={filterAll}
          variant="text"
        />

        <FilterChipButton
          active={activePanel === "rating"}
          label={t("WAVE1.MAP.FILTER_RATING")}
          onClick={() => onPanelChange(activePanel === "rating" ? null : "rating")}
          value={ratingLabel}
          variant="text"
        />

        <FilterChipButton
          active={activePanel === "booking"}
          label={t("WAVE1.MAP.FILTER_BOOKING")}
          onClick={() => onPanelChange(activePanel === "booking" ? null : "booking")}
          value={filterAll}
        />

        <FilterChipButton
          active={activePanel === "availability"}
          label={t("WAVE1.MAP.FILTER_AVAILABILITY")}
          onClick={() => onPanelChange(activePanel === "availability" ? null : "availability")}
          value={filterAll}
        />

        <button
          className="flex size-[52px] shrink-0 items-center justify-center rounded-[12px] bg-white"
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <img alt="" className="size-[52px]" src={selectionsAssets.filterSettings} />
        </button>
      </div>

      {activePanel === "category" && !hideCategoryFilter && categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            className={cn(
              "rounded-xl px-3 py-2 text-[15px]",

              selectedCategoryIds.length === 0 ? "bg-accent text-white" : "bg-[#efeff4] text-[#222222]"
            )}
            onClick={() => onCategoriesClear?.()}
            onMouseDown={(event) => event.preventDefault()}
            type="button"
          >
            {filterAll}
          </button>

          {categories.map((category) => {
            const isSelected = selectedSet.has(category.id)

            return (
              <button
                className={cn(
                  "rounded-xl px-3 py-2 text-[15px]",

                  isSelected ? "bg-accent text-white" : "bg-[#efeff4] text-[#222222]"
                )}
                key={category.id}
                onClick={() => onCategoryToggle?.(category.id)}
                onMouseDown={(event) => event.preventDefault()}
                type="button"
              >
                {truncateCategoryLabel(category.label)}
              </button>
            )
          })}
        </div>
      ) : null}

      {activePanel === "rating" ? (
        <div className="flex flex-wrap gap-2 rounded-2xl bg-white px-3 py-2">
          {RATING_OPTIONS.map((rating) => (
            <button
              className={cn(
                "rounded-xl px-3 py-2 text-[15px]",

                minRating === rating ? "bg-accent text-white" : "bg-[#efeff4] text-[#222222]"
              )}
              key={rating ?? "all"}
              onClick={() => onRatingChange(rating)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {rating === null ? t("WAVE1.MAP.FILTER_RATING_ALL") : `${rating}+`}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
