import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { formatLoyaltyRub, type LoyaltyProgramDTO, type LoyaltyUsagePlaceDTO } from "@point/shared/api/point/loyalty"

import { selectionsAssets } from "@/components/selections/selectionsAssets"
import { useParityCapture } from "@/hooks/useParityCapture"

import { loyaltyAssets } from "./loyaltyAssets"

function LoyaltySectionHeading({ title }: { title: string }) {
  return (
    <div className="flex h-8 items-center">
      <p className="text-[#707579] text-[13px] uppercase leading-normal">{title}</p>
    </div>
  )
}

function LoyaltyProgramCard({
  onUsagePlacesClick,
  program,
}: {
  onUsagePlacesClick: () => void
  program: LoyaltyProgramDTO
}) {
  const { t } = useTranslation()

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="flex h-[68px] items-center px-4">
        <img alt="" className="size-12 shrink-0 rounded-full object-cover" src={program.photo} />
        <div className="ml-4 flex min-w-0 flex-1 items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium text-[#222222] text-[17px] leading-5">{program.name}</p>
              {program.verified ? <img alt="" className="h-3.5 w-3.5 shrink-0" src={loyaltyAssets.verified} /> : null}
            </div>
            <p className="truncate text-[#8d969d] text-[15px] leading-[18px]">{program.subtitle}</p>
          </div>
          <p className="ml-4 shrink-0 font-medium text-[#222222] text-[17px] leading-5">
            {formatLoyaltyRub(program.balanceRub)}
          </p>
        </div>
      </div>
      <button
        className="flex h-12 w-full items-center justify-between border-black/[0.06] border-t px-4 text-left"
        onClick={onUsagePlacesClick}
        type="button"
      >
        <span className="text-[#222222] text-[17px] leading-[22px]">{t("WAVE1.LOYALTY.USAGE_PLACES")}</span>
        <span className="flex items-center gap-2 text-[#222222] text-[17px] leading-5">
          {t("WAVE1.LOYALTY.USAGE_PLACES_COUNT", { count: program.usagePlacesCount })}
          <span className="text-[#8d969d]">›</span>
        </span>
      </button>
    </div>
  )
}

function LoyaltyEmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-6 size-[200px] rounded-[24px] bg-black/[0.04]" />
      <p className="font-medium text-[#222222] text-[17px] leading-5">{title}</p>
      <p className="mt-2 text-[#8d969d] text-[15px] leading-[18px]">{description}</p>
    </div>
  )
}

export function LoyaltyScreen({
  onUsagePlacesClick,
  programs,
  userName,
  userPhoto,
}: {
  onUsagePlacesClick: (programId: string) => void
  programs: LoyaltyProgramDTO[]
  userName: string
  userPhoto?: string | null
}) {
  const { t } = useTranslation()
  const parityCapture = useParityCapture()
  const [search, setSearch] = useState("")

  const displayName = parityCapture ? t("WAVE1.SELECTIONS.USER_NAME") : userName
  const displayPhoto = parityCapture ? selectionsAssets.avatar : userPhoto || selectionsAssets.avatar

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return programs
    }

    return programs.filter(
      (program) => program.name.toLowerCase().includes(query) || program.subtitle.toLowerCase().includes(query)
    )
  }, [programs, search])

  return (
    <div className="min-h-full px-4 pt-1">
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
        <img alt="" className="size-5 shrink-0" src={loyaltyAssets.search} />
        <input
          className="w-full bg-transparent text-[15px] text-text leading-normal outline-none placeholder:text-[#8d969d]"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("WAVE1.LOYALTY.SEARCH_INPUT")}
          value={search}
        />
      </div>

      {filteredPrograms.length > 0 ? (
        <div className="mt-1">
          <LoyaltySectionHeading title={t("WAVE1.LOYALTY.BONUS_BALANCES")} />
          <div className="space-y-2.5">
            {filteredPrograms.map((program) => (
              <LoyaltyProgramCard
                key={program.id}
                onUsagePlacesClick={() => onUsagePlacesClick(program.id)}
                program={program}
              />
            ))}
          </div>
        </div>
      ) : (
        <LoyaltyEmptyState description={t("WAVE1.LOYALTY.EMPTY_DESC")} title={t("WAVE1.LOYALTY.EMPTY_TITLE")} />
      )}
    </div>
  )
}

function LoyaltyUsagePlaceRow({ place }: { place: LoyaltyUsagePlaceDTO }) {
  const stars = Math.max(0, Math.min(5, Math.round(place.rating)))

  return (
    <div className="flex gap-4 border-black/[0.06] border-b py-3 last:border-b-0">
      <img alt="" className="size-[100px] shrink-0 rounded-2xl object-cover" src={place.photo} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#222222] text-[17px] leading-5">{place.title}</p>
        <p className="mt-0.5 truncate text-[#8d969d] text-[15px] leading-[18px]">{place.subtitle}</p>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: stars }, (_, index) => (
            <span className="text-[#ffb800] text-[12px]" key={`${place.id}-star-${index}`}>
              ★
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[#8d969d] text-[13px] leading-[14px]">
          <span>{place.distanceLabel}</span>
          <span>{place.hoursLabel}</span>
        </div>
      </div>
    </div>
  )
}

export function LoyaltyUsagePlacesScreen({
  places,
  program,
  search,
  onSearchChange,
}: {
  onSearchChange: (value: string) => void
  places: LoyaltyUsagePlaceDTO[]
  program: LoyaltyProgramDTO
  search: string
}) {
  const { t } = useTranslation()

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return places
    }

    return places.filter(
      (place) => place.title.toLowerCase().includes(query) || place.subtitle.toLowerCase().includes(query)
    )
  }, [places, search])

  return (
    <div className="min-h-full pt-1">
      <div className="mt-4 rounded-2xl bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <img alt="" className="size-12 rounded-full object-cover" src={program.photo} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate font-medium text-[#222222] text-[17px] leading-5">{program.name}</p>
              {program.verified ? <img alt="" className="h-3.5 w-3.5" src={loyaltyAssets.verified} /> : null}
            </div>
            <p className="truncate text-[#8d969d] text-[15px] leading-[18px]">{program.subtitle}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-black/[0.04] px-3 py-[13px]">
          <img alt="" className="size-5 shrink-0" src={loyaltyAssets.search} />
          <input
            className="w-full bg-transparent text-[15px] text-text leading-normal outline-none placeholder:text-[#8d969d]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("WAVE1.LOYALTY.SEARCH_INPUT")}
            value={search}
          />
        </div>
      </div>

      {filteredPlaces.length > 0 ? (
        <div className="mt-1 rounded-2xl bg-white px-4">
          <LoyaltySectionHeading title={t("WAVE1.LOYALTY.NEARBY_PLACES")} />
          {filteredPlaces.map((place) => (
            <LoyaltyUsagePlaceRow key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <LoyaltyEmptyState description={t("WAVE1.LOYALTY.NOT_FOUND_DESC")} title={t("WAVE1.LOYALTY.NOT_FOUND_TITLE")} />
      )}
    </div>
  )
}
