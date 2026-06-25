import type { WallCardDTO, WallTabId } from "@point/shared/api/point/wall"

import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"

import { useParityCapture } from "@/hooks/useParityCapture"

import { SelectionsStarRating } from "./SelectionsStarRating"
import { selectionsAssets } from "./selectionsAssets"

interface SelectionsFeedSectionProps {
  activeTab: WallTabId
  cards: WallCardDTO[]
  className?: string
  onPlaceClick?: () => void
  onTabChange: (tab: WallTabId) => void
}

type FeedListItemData = {
  distance: string
  image: string
  stackedLogos?: { back: string; front: string }
  stars: "4" | "5"
  subtitle: string
  time: string
  title: string
}

function FilterChip({
  label,
  parityCapture,
  value,
  variant = "text",
  widthClass,
}: {
  label: string
  parityCapture: boolean
  value: string
  variant?: "price" | "stars" | "text"
  widthClass: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-[52px] shrink-0 items-center rounded-xl bg-[#efeff4] py-2 pl-2",
        parityCapture ? "pr-12" : "pr-10",
        widthClass
      )}
    >
      <div className="px-1">
        <p className="text-[#707579] text-[12px] leading-normal">{label}</p>
        {variant === "stars" ? (
          <img alt="" className="mt-1 h-3.5 w-[62px]" src={selectionsAssets.filterStars} />
        ) : variant === "price" ? (
          <p className="text-[17px] text-black leading-normal">
            <span>$</span>
            <span>$</span>
            <span className="text-[#a2acb0]">$</span>
          </p>
        ) : (
          <p className="text-[17px] text-black leading-normal">{value}</p>
        )}
      </div>
      <img
        alt=""
        className={cn("-translate-y-1/2 absolute top-1/2 right-2 size-5", { hidden: !parityCapture })}
        src={selectionsAssets.chevron}
      />
      <span className={cn("-translate-y-1/2 absolute top-1/2 right-2 text-[#707579]", { hidden: parityCapture })}>
        ▾
      </span>
    </div>
  )
}

function FeedListItem({
  distance,
  image,
  onClick,
  parityCapture,
  stackedLogos,
  stars,
  subtitle,
  time,
  title,
}: FeedListItemData & { onClick?: () => void; parityCapture: boolean }) {
  return (
    <button
      className="flex w-full gap-4 border-black/10 border-b py-2.5 text-left last:border-b-0"
      onClick={onClick}
      type="button"
    >
      <div className="relative h-[82px] w-[78px] shrink-0">
        {stackedLogos ? (
          <>
            <img
              alt=""
              className="absolute top-1.5 right-0 h-[71px] w-[67px] rounded-[10px] object-cover"
              src={stackedLogos.back}
            />
            <img
              alt=""
              className="-rotate-[10deg] absolute top-0 left-0 h-[71px] w-[67px] rounded-[10px] border-2 border-white object-cover"
              src={stackedLogos.front}
            />
          </>
        ) : (
          <>
            <img
              alt=""
              className="absolute top-1.5 right-0 h-[71px] w-[67px] rounded-[10px] object-cover"
              src={image}
            />
            <img
              alt=""
              className="-rotate-[10deg] absolute top-0 left-0 h-[71px] w-[67px] rounded-[10px] border-2 border-white object-cover"
              src={image}
            />
          </>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2 py-1">
        <div className="space-y-0.5">
          <p className="font-medium text-[#222222] text-[17px] leading-normal">{title}</p>
          <p className="text-[#8d969d] text-[15px] leading-normal">{subtitle}</p>
        </div>
        <SelectionsStarRating stars={stars} />
        <div className="flex flex-wrap gap-2">
          <div
            className={cn("flex items-center gap-1 rounded-2xl px-1.5 py-0.5", {
              "bg-[#efeff4]": !parityCapture,
              "bg-[#f0f0f2]": parityCapture,
            })}
          >
            <img alt="" className="h-2.5 w-2" src={selectionsAssets.pin} />
            <span className="text-[12px] text-accent">{distance}</span>
          </div>
          <div
            className={cn("flex items-center gap-1 rounded-xl px-1.5 py-0.5", {
              "bg-[#efeff4]": !parityCapture,
              "bg-[#f0f2f1]": parityCapture,
            })}
          >
            <img alt="" className="h-2.5 w-2.5" src={selectionsAssets.clock} />
            <span className="text-[12px] text-accent">{time}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

function buildFigmaList(t: (key: string) => string): FeedListItemData[] {
  return [
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_1"),
      image: selectionsAssets.place1,
      stackedLogos: { back: selectionsAssets.listLogoBack, front: selectionsAssets.listLogoFront },
      stars: "4",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_1_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_1_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_1_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_3"),
      image: selectionsAssets.place2,
      stars: "5",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_2_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_2_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_2_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_3"),
      image: selectionsAssets.listPlace3,
      stars: "5",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_3_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_3_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_3_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_4"),
      image: selectionsAssets.place1,
      stars: "5",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_4_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_4_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_4_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_5"),
      image: selectionsAssets.rec1,
      stars: "4",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_5_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_5_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_5_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_6"),
      image: selectionsAssets.rec1,
      stars: "5",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_6_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_6_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_6_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_7"),
      image: selectionsAssets.rec2,
      stars: "4",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_7_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_7_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_7_TITLE"),
    },
    {
      distance: t("WAVE1.SELECTIONS.PLACE_DISTANCE_8"),
      image: selectionsAssets.listPlace3,
      stars: "4",
      subtitle: t("WAVE1.SELECTIONS.LIST_ITEM_8_SUBTITLE"),
      time: t("WAVE1.SELECTIONS.LIST_ITEM_8_TIME"),
      title: t("WAVE1.SELECTIONS.LIST_ITEM_8_TITLE"),
    },
  ]
}

export function SelectionsFeedSection({
  activeTab,
  cards,
  className,
  onPlaceClick,
  onTabChange,
}: SelectionsFeedSectionProps) {
  const { t } = useTranslation()
  const parityCapture = useParityCapture()

  const tabs: { label: string; value: WallTabId }[] = [
    { label: t("WAVE1.SELECTIONS.TAB_POPULAR"), value: "popular" },
    { label: t("WAVE1.SELECTIONS.TAB_NEW"), value: "new" },
    { label: t("WAVE1.SELECTIONS.TAB_BEAUTIFUL"), value: "beautiful" },
    { label: t("WAVE1.SELECTIONS.TAB_MEDIA"), value: "media" },
  ]

  const displayTabs = parityCapture
    ? [...tabs, { label: t("WAVE1.SELECTIONS.TAB_SALADS"), value: "media" as WallTabId }]
    : tabs

  const figmaList = buildFigmaList(t)

  const apiList: FeedListItemData[] = cards.slice(0, 8).map((card) => ({
    distance: card.distanceLabel ?? "",
    image: card.imageUrl || selectionsAssets.place1,
    stars: card.rating >= 4.8 ? ("5" as const) : ("4" as const),
    subtitle: card.subtitle,
    time: card.travelTimeLabel ?? "",
    title: card.title,
  }))

  const listItems = parityCapture ? figmaList : apiList

  return (
    <div
      className={cn("rounded-2xl bg-white pt-0 pb-6", parityCapture ? "mt-0" : "mt-2", className)}
      data-parity-anchor="selections-feed"
    >
      <div className="relative border-black/15 border-b">
        <div
          className={cn(
            "flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            {
              "gap-[40px] px-8 py-[13px]": parityCapture,
              "gap-10 px-4 py-3": !parityCapture,
            }
          )}
        >
          {displayTabs.map((tab, index) => {
            const isSaladsDecor =
              parityCapture && index === displayTabs.length - 1 && tab.label === t("WAVE1.SELECTIONS.TAB_SALADS")

            if (isSaladsDecor) {
              return (
                <span className="shrink-0 font-medium text-[15px] text-black leading-normal" key="salads-decor">
                  {tab.label}
                </span>
              )
            }

            return (
              <button
                className={cn("shrink-0 font-medium text-[15px] leading-normal", {
                  "border-[#007aff] border-b-2 pb-1 text-[#007aff]": !parityCapture && activeTab === tab.value,
                  "text-[#007aff]": parityCapture && index === 0,
                  "text-black": parityCapture ? index !== 0 : activeTab !== tab.value,
                })}
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                type="button"
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        {parityCapture ? (
          <div className="pointer-events-none absolute bottom-0 left-8 h-0.5 w-[92px] rounded-full bg-[#007aff]" />
        ) : null}
      </div>

      <div
        className={cn(
          "mt-3 flex overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          {
            "gap-1.5 px-4": !parityCapture,
            "mx-auto w-[361px] gap-[6px]": parityCapture,
          }
        )}
      >
        <FilterChip
          label={t("WAVE1.SELECTIONS.FILTER_CATEGORY")}
          parityCapture={parityCapture}
          value={t("WAVE1.SELECTIONS.FILTER_CATEGORY_VALUE")}
          widthClass={parityCapture ? "w-[108px]" : "min-w-[108px]"}
        />
        <FilterChip
          label={t("WAVE1.SELECTIONS.FILTER_PRICE")}
          parityCapture={parityCapture}
          value={t("WAVE1.SELECTIONS.FILTER_PRICE_VALUE")}
          variant="price"
          widthClass={parityCapture ? "w-[82px]" : "min-w-[82px]"}
        />
        <FilterChip
          label={t("WAVE1.SELECTIONS.FILTER_RATING")}
          parityCapture={parityCapture}
          value="★★★★"
          variant="stars"
          widthClass={parityCapture ? "w-[112px]" : "min-w-[112px]"}
        />
        <FilterChip
          label={t("WAVE1.SELECTIONS.FILTER_AVAILABILITY")}
          parityCapture={parityCapture}
          value={t("WAVE1.SELECTIONS.FILTER_OPEN")}
          widthClass={parityCapture ? "w-[108px]" : "min-w-[108px]"}
        />
        {parityCapture ? <img alt="" className="size-[52px] shrink-0" src={selectionsAssets.filterSettings} /> : null}
      </div>

      <div className={cn("mt-2 space-y-0", parityCapture ? "px-4" : "px-4")}>
        {listItems.length > 0 ? (
          listItems.map((item) => (
            <FeedListItem
              distance={item.distance}
              image={item.image}
              key={`${item.title}-${item.subtitle}`}
              onClick={onPlaceClick}
              parityCapture={parityCapture}
              stackedLogos={item.stackedLogos}
              stars={item.stars}
              subtitle={item.subtitle}
              time={item.time}
              title={item.title}
            />
          ))
        ) : (
          <p className="px-1 py-4 text-[#8d969d] text-[15px]">{t("WAVE1.SELECTIONS.NOT_FOUND_DESC")}</p>
        )}
      </div>
    </div>
  )
}
