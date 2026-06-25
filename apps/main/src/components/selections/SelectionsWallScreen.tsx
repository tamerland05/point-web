import type { WallCardDTO, WallPromoDTO, WallTabId } from "@point/shared/api/point/wall"
import type { WallCategoryDTO } from "@point/shared/api/point/wallCategories"

import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"

import { MAP_CATEGORY_TONES } from "@/components/map/mapAssets"
import { useParityCapture, useParityScrollTarget } from "@/hooks/useParityCapture"

import { SelectionsFeedSection } from "./SelectionsFeedSection"
import { SelectionsParityBackdrop } from "./SelectionsParityBackdrop"
import { SelectionsStarRating } from "./SelectionsStarRating"
import { selectionsAssets } from "./selectionsAssets"

function wallCardStars(rating: number): "4" | "5" {
  return rating >= 4.8 ? "5" : "4"
}

interface SelectionsWallScreenProps {
  activeTab: WallTabId
  categories: WallCategoryDTO[]
  feedCards: WallCardDTO[]
  nearbyCards: WallCardDTO[]
  promos: WallPromoDTO[]
  recommendedCards: WallCardDTO[]
  onTabChange: (tab: WallTabId) => void
  search: string
  onSearchChange: (value: string) => void
  onPlaceClick?: (establishmentId?: string | null) => void
  userName: string
  userPhoto?: string | null
}

const FALLBACK_CATEGORY_TONES = [
  MAP_CATEGORY_TONES.coffee,
  MAP_CATEGORY_TONES.bakery,
  MAP_CATEGORY_TONES.veg,
  MAP_CATEGORY_TONES.seafood,
] as const

function resolveCategoryBackgroundColor(tone: string): string {
  if (tone.startsWith("#")) {
    return tone
  }

  const match = /^bg-\[(#[0-9a-fA-F]{3,8})\]$/.exec(tone)
  return match?.[1] ?? "#0a78ff"
}

function CategoryTile({
  countLabel,
  icon,
  label,
  tone,
}: {
  countLabel: string
  icon: string
  label: string
  tone: string
}) {
  return (
    <div
      className="flex h-[111px] w-[106px] shrink-0 flex-col items-center gap-[10px] rounded-2xl p-4"
      style={{ backgroundColor: resolveCategoryBackgroundColor(tone) }}
    >
      {icon ? <img alt="" className="h-8 w-7 shrink-0 object-contain" src={icon} /> : null}
      <div className="flex h-[37px] w-[86px] flex-col items-center justify-center gap-0.5 text-center text-white">
        <p className="w-full truncate font-semibold text-[15px] leading-normal">{label}</p>
        <p className="whitespace-nowrap font-medium text-[12px] text-white/70 leading-normal">{countLabel}</p>
      </div>
    </div>
  )
}

function SectionHeader({ moreLabel, title }: { moreLabel: string; title: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <p className="w-[170px] text-[#707579] text-[13px] uppercase leading-normal">{title}</p>
      <p className="text-[13px] text-accent uppercase leading-normal">{moreLabel}</p>
    </div>
  )
}

function MetaPill({
  children,
  icon,
  rounded = "xl",
}: {
  children: string
  icon?: "clock" | "pin"
  rounded?: "2xl" | "xl"
}) {
  return (
    <div
      className={`flex items-center gap-1 bg-[#efeff4] px-1.5 py-0.5 ${rounded === "2xl" ? "rounded-2xl" : "rounded-xl"}`}
    >
      {icon ? (
        <img alt="" className="h-2.5 w-2.5" src={icon === "clock" ? selectionsAssets.clock : selectionsAssets.pin} />
      ) : null}
      <span className="text-[12px] text-accent leading-normal">{children}</span>
    </div>
  )
}

function PlaceCard({
  distance,
  image,
  onClick,
  size = "rec",
  stars,
  subtitle,
  time,
  title,
  verified = true,
}: {
  distance?: string
  image: string
  onClick?: () => void
  size?: "nearby" | "rec"
  stars: "4" | "5"
  subtitle: string
  time: string
  title: string
  verified?: boolean
}) {
  const isNearby = size === "nearby"

  return (
    <button
      className={`shrink-0 overflow-hidden rounded-2xl bg-white text-left ${isNearby ? "w-[245px]" : "w-[192px]"}`}
      onClick={onClick}
      type="button"
    >
      <img alt="" className={`w-full object-cover ${isNearby ? "h-[156px]" : "h-[137px]"}`} src={image} />
      <div className="space-y-2 px-4 py-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <p className="font-medium text-[#222222] text-[17px] leading-normal">{title}</p>
            {verified ? <img alt="" className="h-3.5 w-3.5" src={selectionsAssets.verified} /> : null}
          </div>
          <p className="text-[#8d969d] text-[15px] leading-normal">{subtitle}</p>
        </div>
        <SelectionsStarRating stars={stars} />
        <div className="flex flex-wrap gap-2">
          {distance ? (
            <MetaPill icon="pin" rounded="2xl">
              {distance}
            </MetaPill>
          ) : null}
          <MetaPill icon="clock">{time}</MetaPill>
        </div>
      </div>
    </button>
  )
}

export function SelectionsWallScreen({
  activeTab,
  categories,
  feedCards,
  nearbyCards,
  onPlaceClick,
  onSearchChange,
  onTabChange,
  promos,
  recommendedCards,
  search,
  userName,
  userPhoto,
}: SelectionsWallScreenProps) {
  const { t } = useTranslation()
  const parityCapture = useParityCapture()
  const parityScrollTarget = useParityScrollTarget()
  const isFeedParity = parityCapture && parityScrollTarget === "selections-feed"
  const parityVariant = parityCapture ? (isFeedParity ? "feed" : "top") : null
  const showFeedSection = !parityCapture || isFeedParity
  const displayName = parityCapture ? t("WAVE1.SELECTIONS.USER_NAME") : userName
  const displayPhoto = parityCapture ? selectionsAssets.avatar : userPhoto || selectionsAssets.avatar

  const figmaCategories = [
    {
      countLabel: t("WAVE1.SELECTIONS.CAT_COFFEE_COUNT"),
      icon: selectionsAssets.catCoffee,
      label: t("WAVE1.SELECTIONS.CAT_COFFEE"),
      tone: MAP_CATEGORY_TONES.coffee,
    },
    {
      countLabel: t("WAVE1.SELECTIONS.CAT_BAKERY_COUNT"),
      icon: selectionsAssets.catBakery,
      label: t("WAVE1.SELECTIONS.CAT_BAKERY"),
      tone: MAP_CATEGORY_TONES.bakery,
    },
    {
      countLabel: t("WAVE1.SELECTIONS.CAT_VEGETARIAN_COUNT"),
      icon: selectionsAssets.catVeg,
      label: t("WAVE1.SELECTIONS.CAT_VEGETARIAN"),
      tone: MAP_CATEGORY_TONES.veg,
    },
    {
      countLabel: t("WAVE1.SELECTIONS.CAT_SEAFOOD_COUNT"),
      icon: selectionsAssets.catSeafood,
      label: t("WAVE1.SELECTIONS.CAT_SEAFOOD"),
      tone: MAP_CATEGORY_TONES.seafood,
    },
  ]

  const liveCategories = categories.map((category, index) => ({
    countLabel: t("WAVE1.SELECTIONS.PLACES_COUNT", { count: category.count }),
    icon: category.icon || selectionsAssets.catCoffee,
    label: category.name,
    tone:
      category.colorCode ??
      FALLBACK_CATEGORY_TONES[index % FALLBACK_CATEGORY_TONES.length] ??
      MAP_CATEGORY_TONES.coffee,
  }))

  const displayCategories = parityCapture ? figmaCategories : liveCategories

  return (
    <>
      <SelectionsParityBackdrop variant={parityVariant} />
      <div
        className={cn(
          "min-h-full bg-[#efeff4] px-4",
          parityCapture ? "pt-1 pb-4" : "pt-1 pb-[118px]",
          parityCapture && "hidden"
        )}
      >
        <div className="mt-4 rounded-2xl bg-white pl-4">
          <div className="flex items-center gap-4 py-3 pr-4">
            <img alt="" className="size-12 rounded-full border border-black/[0.05] object-cover" src={displayPhoto} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[#222222] text-[17px] leading-normal">{displayName}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <img alt="" className="h-3 w-[15px]" src={selectionsAssets.expertThumb} />
                <p className="text-[#8d969d] text-[15px] leading-normal">{t("WAVE1.SELECTIONS.USER_ROLE")}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <img alt="" className="size-11" src={selectionsAssets.actionQr} />
              <img alt="" className="size-11" src={selectionsAssets.actionBell} />
            </div>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-2 rounded-[14px] bg-black/[0.04] px-3 py-[13px]">
          <img alt="" className="size-5 shrink-0" src={selectionsAssets.search} />
          <input
            className="w-full bg-transparent text-[15px] text-text leading-normal outline-none placeholder:text-[#8d969d]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("WAVE1.SELECTIONS.SEARCH_INPUT")}
            value={search}
          />
        </div>

        <SectionHeader moreLabel={t("WAVE1.SELECTIONS.MORE")} title={t("WAVE1.SELECTIONS.RECOMMENDED")} />
        {parityCapture ? (
          <div className="flex gap-[11px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <PlaceCard
              image={selectionsAssets.rec1}
              stars="5"
              subtitle={t("WAVE1.SELECTIONS.REC_CARD_1_SUBTITLE")}
              time={t("WAVE1.SELECTIONS.REC_CARD_TIME")}
              title={t("WAVE1.SELECTIONS.REC_CARD_1_TITLE")}
            />
            <PlaceCard
              image={selectionsAssets.rec2}
              stars="4"
              subtitle={t("WAVE1.SELECTIONS.REC_CARD_2_SUBTITLE")}
              time={t("WAVE1.SELECTIONS.REC_CARD_2_TIME")}
              title={t("WAVE1.SELECTIONS.REC_CARD_2_TITLE")}
            />
          </div>
        ) : recommendedCards.length > 0 ? (
          <div className="flex gap-[11px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recommendedCards.slice(0, 6).map((card) => (
              <PlaceCard
                image={card.imageUrl || selectionsAssets.rec1}
                key={card.id}
                onClick={() => onPlaceClick?.(card.establishmentId)}
                stars={wallCardStars(card.rating)}
                subtitle={card.subtitle}
                time={card.travelTimeLabel ?? ""}
                title={card.title}
              />
            ))}
          </div>
        ) : null}

        {displayCategories.length > 0 ? (
          <>
            <SectionHeader moreLabel={t("WAVE1.SELECTIONS.MORE")} title={t("WAVE1.SELECTIONS.CATEGORIES")} />
            <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {displayCategories.map((category) => (
                <CategoryTile
                  countLabel={category.countLabel}
                  icon={category.icon}
                  key={`${category.label}-${category.countLabel}`}
                  label={category.label}
                  tone={category.tone}
                />
              ))}
            </div>
          </>
        ) : null}

        <SectionHeader moreLabel={t("WAVE1.SELECTIONS.MORE")} title={t("WAVE1.SELECTIONS.NEARBY")} />
        {parityCapture ? (
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <PlaceCard
              distance={t("WAVE1.SELECTIONS.PLACE_DISTANCE_1")}
              image={selectionsAssets.place1}
              onClick={() => onPlaceClick?.()}
              size="nearby"
              stars="5"
              subtitle={t("WAVE1.SELECTIONS.PLACE_CARD_1_SUBTITLE")}
              time={t("WAVE1.SELECTIONS.REC_CARD_TIME")}
              title={t("WAVE1.SELECTIONS.PLACE_CARD_1_TITLE")}
            />
            <PlaceCard
              distance={t("WAVE1.SELECTIONS.PLACE_DISTANCE_2")}
              image={selectionsAssets.place2}
              onClick={() => onPlaceClick?.()}
              size="nearby"
              stars="4"
              subtitle={t("WAVE1.SELECTIONS.PLACE_CARD_2_SUBTITLE")}
              time={t("WAVE1.SELECTIONS.PLACE_CARD_2_TIME")}
              title={t("WAVE1.SELECTIONS.PLACE_CARD_2_TITLE")}
            />
          </div>
        ) : nearbyCards.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nearbyCards.slice(0, 6).map((card) => (
              <PlaceCard
                distance={card.distanceLabel ?? undefined}
                image={card.imageUrl || selectionsAssets.place1}
                key={card.id}
                onClick={() => onPlaceClick?.(card.establishmentId)}
                size="nearby"
                stars={wallCardStars(card.rating)}
                subtitle={card.subtitle}
                time={card.travelTimeLabel ?? ""}
                title={card.title}
              />
            ))}
          </div>
        ) : null}

        {!parityCapture && promos[0] ? (
          <div className="relative mt-1 h-[122px] overflow-hidden rounded-2xl bg-[#e5454b]">
            <img
              alt=""
              className="absolute inset-0 size-full object-cover"
              src={promos[0].imageUrl || selectionsAssets.bannerBg}
            />
            <div className="relative z-10 px-4 pt-3">
              <p className="font-semibold text-[15px] text-white leading-5 tracking-[-0.23px]">{promos[0].title}</p>
              <p className="mt-8 font-bold text-[25px] text-white/90 leading-5 tracking-[-0.23px]">
                {promos[0].priceLabel}
              </p>
              <p className="font-medium text-[15px] text-white/90 leading-5 tracking-[-0.23px]">{promos[0].subtitle}</p>
            </div>
          </div>
        ) : null}

        {parityCapture ? (
          <div className="relative mt-1 h-[122px] overflow-hidden rounded-2xl bg-[#e5454b]">
            <img alt="" className="absolute inset-0 size-full object-cover" src={selectionsAssets.bannerBg} />
            <div className="relative z-10 px-4 pt-3">
              <p className="font-semibold text-[15px] text-white leading-5 tracking-[-0.23px]">
                {t("WAVE1.SELECTIONS.BANNER_TITLE")}
              </p>
              <p className="mt-8 font-bold text-[25px] text-white/90 leading-5 tracking-[-0.23px]">
                {t("WAVE1.SELECTIONS.BANNER_PRICE")}
              </p>
              <p className="font-medium text-[15px] text-white/90 leading-5 tracking-[-0.23px]">
                {t("WAVE1.SELECTIONS.BANNER_SUBTITLE")}
              </p>
            </div>
            <div
              className="-right-2 -top-[17px] pointer-events-none absolute size-[209px]"
              style={{
                maskImage: `url(${selectionsAssets.pizzaMask})`,
                maskPosition: "-190px 17px",
                maskRepeat: "no-repeat",
                maskSize: "342px 122px",
                WebkitMaskImage: `url(${selectionsAssets.pizzaMask})`,
                WebkitMaskPosition: "-190px 17px",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "342px 122px",
              }}
            >
              <img alt="" className="size-full object-cover" src={selectionsAssets.pizzaSlice} />
            </div>
          </div>
        ) : null}

        <SelectionsFeedSection
          activeTab={activeTab}
          cards={feedCards}
          className={showFeedSection ? undefined : "hidden"}
          onPlaceClick={onPlaceClick}
          onTabChange={onTabChange}
        />
      </div>
    </>
  )
}
