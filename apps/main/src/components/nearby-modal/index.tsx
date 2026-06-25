import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { hapticFeedback, useLaunchParams, useSignal, viewport } from "@telegram-apps/sdk-react"
import { useAtom, useAtomValue } from "jotai"
import { type KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useTranslation } from "@point/i18n"
import { type EstablishmentDTO, placesNearQueryOptions } from "@point/shared/api/point/establishments"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { calculateMapDistanceMeters, formatMapDistanceLabel } from "@point/shared/utils/format"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"

import { NearbyModalStates, nearbyModalStateAtom, selectedMapCategoryIdsAtom } from "@/atoms/map"
import { CategoryFilterCancelChip, CategoryFilterChip } from "@/components/map/CategoryFilterChip"
import { EstablishmentTypeIcon } from "@/components/map/EstablishmentTypeIcon"
import { type MapFilterPanel, MapSearchFilterBar } from "@/components/map/MapSearchFilterBar"
import { MAP_CATEGORY_TONES, mapAssets } from "@/components/map/mapAssets"
import { selectionsAssets } from "@/components/selections/selectionsAssets"
import {
  MAP_NEARBY_DEFAULT_DRAWER_PANEL_CLASS,
  MAP_NEARBY_DEFAULT_HEIGHT_DVH,
  MAP_NEARBY_EXPANDED_EXTRA_TOP_GAP_PX,
  MAP_NEARBY_LOW_DRAWER_PANEL_CLASS,
  MAP_NEARBY_LOW_HEIGHT_DVH,
  MAP_NEARBY_SEARCH_TOP_GAP_PX,
  truncateMapAddress,
} from "@/constants/mapLayout"
import { useParityCapture } from "@/hooks/useParityCapture"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { truncateCategoryLabel } from "@/utils/truncateCategoryLabel"

import { type NearbySearchResultItem, NearbySearchResultRow } from "./NearbySearchResultRow"

interface NearbyModalProps {
  isSearchInputActive: boolean
  onExpand: () => void
  onShow: () => void
  onHide: () => void
  onSelectPlace: (place: EstablishmentDTO) => void
  onSearchFocus: () => void
  onSearchBlur: () => void
  onSearchModeExit: () => void
  onSearchResultsViewChange?: (active: boolean) => void
}

interface NearbyListItem {
  distance: string
  iconBg: string
  iconSrc?: string
  id: string
  place?: EstablishmentDTO
  subtitle: string
  title: string
}

interface CategoryItem {
  icon: string
  id: string
  label: string
  tone: string
}

const defaultDrawerHandle = <div className="h-[5px] w-9 shrink-0 rounded-full bg-[#8d969d]" />

const lowDrawerHandle = <img alt="" className="h-[10px] w-9 shrink-0" src={mapAssets.drawerHandleLow} />

const expandedDrawerHandle = <img alt="" className="h-[10px] w-9 shrink-0" src={mapAssets.drawerHandleExpanded} />

function ratingToStars(rating: number): "4" | "5" {
  return rating >= 4.5 ? "5" : "4"
}

function resolveSearchResultMedia(place: EstablishmentDTO): { image: string; logo?: string } {
  const image = place.gallery?.[0] ?? place.photo
  const logo = place.icon && place.icon !== image ? place.icon : undefined

  return { image, logo }
}

const NearbyRow = memo(function NearbyRow({
  isLast,
  item,
  onClick,
  separatorInset,
}: {
  isLast: boolean
  item: NearbyListItem
  onClick: () => void
  separatorInset?: boolean
}) {
  return (
    <button
      className="flex w-full items-center gap-4 bg-white pr-0 pl-4 text-left focus:outline-none active:bg-black/[0.02]"
      onClick={onClick}
      type="button"
    >
      <EstablishmentTypeIcon icon={item.iconSrc} tone={item.iconBg} />
      <div
        className={cn(
          "min-w-0 flex-1 pt-3.5 pr-4 pb-3",
          separatorInset && !isLast && "border-black/[0.15] border-b-[0.5px]"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <p className="font-medium text-[#222222] text-[17px] leading-[17px]">{item.title}</p>
            <p className="truncate text-[#8d969d] text-[15px] leading-[15px]">{item.subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-[#f0f0f2] px-1.5 py-0.5">
            <img alt="" className="h-2.5 w-2" src={mapAssets.pin} />
            <span className="text-[12px] text-accent leading-[12px]">{item.distance}</span>
          </div>
        </div>
      </div>
    </button>
  )
})

const EMPTY_NEARBY_PLACES: EstablishmentDTO[] = []

export const NearbyModal = memo(
  ({
    isSearchInputActive,
    onExpand,
    onShow,
    onHide,
    onSelectPlace,
    onSearchFocus,
    onSearchBlur,
    onSearchModeExit,
    onSearchResultsViewChange,
  }: NearbyModalProps) => {
    const { t } = useTranslation()
    const parityCapture = useParityCapture()
    const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
    const userLocation = userLocationQuery.data
    const lp = useLaunchParams()

    const inset = useSignal(viewport.safeAreaInsets)
    const contentInset = useSignal(viewport.contentSafeAreaInsets)
    const additionalTopSpace = useMemo(() => inset.top + contentInset.top, [inset, contentInset])

    const state = useAtomValue(nearbyModalStateAtom)
    const [selectedCategoryIds, setSelectedCategoryIds] = useAtom(selectedMapCategoryIdsAtom)
    const inputRef = useRef<HTMLInputElement>(null)
    const [search, setSearch] = useState("")
    const [minRating, setMinRating] = useState<number | null>(null)
    const [activeFilterPanel, setActiveFilterPanel] = useState<MapFilterPanel>(null)
    const debouncedSearch = useDebounce(search, 500)

    const isExpanded = state === NearbyModalStates.EXPANDED
    const hasSearchQuery = search.trim().length > 0
    const isSearchResultsView = isExpanded && (isSearchInputActive || hasSearchQuery)
    const isExpandedSwipe = isExpanded && !isSearchResultsView

    const querySearch = isSearchResultsView ? debouncedSearch : ""

    const nearFilters = useMemo(
      () => ({
        establishmentTypeIds:
          parityCapture || isSearchResultsView || selectedCategoryIds.length === 0 ? null : selectedCategoryIds,
        minRating: parityCapture || !isSearchResultsView ? null : minRating,
      }),
      [isSearchResultsView, minRating, parityCapture, selectedCategoryIds]
    )

    const placesQuery = useQuery({
      ...placesNearQueryOptions(querySearch, userLocation, nearFilters),
      select: (data) => data,
    })
    const places = placesQuery.data ?? EMPTY_NEARBY_PLACES

    const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
    const establishmentTypes = establishmentTypesQuery.data

    const height = useMemo(() => {
      if (state === NearbyModalStates.EXPANDED) return "full"
      if (state === NearbyModalStates.DEFAULT) return "md"
      if (state === NearbyModalStates.PIMP_ONLY) return "pimp-only"

      return "md"
    }, [state])

    const drawerTopGap = useMemo(() => {
      if (isSearchResultsView) return MAP_NEARBY_SEARCH_TOP_GAP_PX
      if (isExpandedSwipe) return MAP_NEARBY_EXPANDED_EXTRA_TOP_GAP_PX
      return 0
    }, [isExpandedSwipe, isSearchResultsView])

    useEffect(() => {
      onSearchResultsViewChange?.(isSearchResultsView)
    }, [isSearchResultsView, onSearchResultsViewChange])

    useEffect(() => {
      if (!isSearchInputActive) return

      inputRef.current?.focus()
    }, [isSearchInputActive])

    useEffect(() => {
      if (state !== NearbyModalStates.PIMP_ONLY && state !== NearbyModalStates.HIDDEN) return
      if (document.activeElement !== inputRef.current) return

      inputRef.current?.blur()
    }, [state])

    const handleSearchKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") return

      event.currentTarget.blur()
    }, [])

    const handleCategoryClick = useCallback(
      (categoryId: string) => {
        hapticFeedback.impactOccurred("light")
        setSelectedCategoryIds((current) =>
          current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId]
        )
      },
      [setSelectedCategoryIds]
    )

    const handleCategoriesClear = useCallback(() => {
      hapticFeedback.impactOccurred("light")
      setSelectedCategoryIds([])
    }, [setSelectedCategoryIds])

    const handleCategoryToggle = useCallback(
      (categoryId: string) => {
        hapticFeedback.impactOccurred("light")
        setSelectedCategoryIds((current) =>
          current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId]
        )
      },
      [setSelectedCategoryIds]
    )

    const handleSearchActivate = useCallback(() => {
      onSearchFocus()
      inputRef.current?.focus()
    }, [onSearchFocus])

    const handleDrawerExpand = useCallback(() => {
      inputRef.current?.blur()
      onSearchBlur()
      onExpand()
    }, [onExpand, onSearchBlur])

    const handleClearSearch = useCallback(() => {
      setSearch("")
      setActiveFilterPanel(null)
      inputRef.current?.blur()
      onSearchBlur()
    }, [onSearchBlur])

    const handleInputBlur = useCallback(() => {
      onSearchBlur()

      window.setTimeout(() => {
        if (document.activeElement === inputRef.current) {
          return
        }

        // Expanded sheet stays up; only swipe-down collapses to default.
        if (state === NearbyModalStates.EXPANDED) {
          return
        }

        if (!search.trim() && selectedCategoryIds.length === 0 && minRating === null) {
          onSearchModeExit()
        }
      }, 120)
    }, [minRating, onSearchBlur, onSearchModeExit, search, selectedCategoryIds.length, state])

    const handleDrawerClose = useCallback(() => {
      if (isSearchResultsView) {
        setSearch("")
        inputRef.current?.blur()
        onSearchModeExit()
        return
      }

      if (state === NearbyModalStates.EXPANDED) {
        onShow()
        return
      }

      onHide()
    }, [isSearchResultsView, onHide, onSearchModeExit, onShow, state])

    const figmaCategories: CategoryItem[] = [
      {
        icon: mapAssets.catBakery,
        id: "figma-bakery",
        label: t("WAVE1.MAP.CAT_BAKERY"),
        tone: MAP_CATEGORY_TONES.bakery,
      },
      {
        icon: mapAssets.catCoffee,
        id: "figma-coffee",
        label: t("WAVE1.MAP.CAT_COFFEE"),
        tone: MAP_CATEGORY_TONES.coffee,
      },
      { icon: mapAssets.catVeg, id: "figma-veg", label: t("WAVE1.MAP.CAT_VEGETARIAN"), tone: MAP_CATEGORY_TONES.veg },
      { icon: mapAssets.catSeafood, id: "figma-fish", label: t("WAVE1.MAP.CAT_FISH"), tone: MAP_CATEGORY_TONES.fish },
      {
        icon: mapAssets.catSeafood,
        id: "figma-seafood",
        label: t("WAVE1.MAP.CAT_SEAFOOD"),
        tone: MAP_CATEGORY_TONES.seafood,
      },
    ]

    const liveCategories = useMemo((): CategoryItem[] => {
      if (!establishmentTypes) {
        return []
      }

      return Object.values(establishmentTypes)
        .filter((type) => type.count > 0 && type.icon)
        .sort((left, right) => right.count - left.count)
        .slice(0, 5)
        .map((type) => ({
          icon: type.icon,
          id: type.id,
          label: type.name,
          tone: type.colorCode ?? "",
        }))
    }, [establishmentTypes])

    const categories = parityCapture ? figmaCategories : liveCategories

    const filterCategories = useMemo(
      () =>
        categories.map((category) => ({
          id: category.id,
          label: truncateCategoryLabel(category.label),
        })),
      [categories]
    )

    const categoryFilterValue = useMemo(() => {
      if (selectedCategoryIds.length === 0) {
        return t("WAVE1.MAP.FILTER_ALL")
      }

      if (selectedCategoryIds.length === 1) {
        const selected = categories.find((category) => category.id === selectedCategoryIds[0])
        return selected ? truncateCategoryLabel(selected.label) : t("WAVE1.MAP.FILTER_ALL")
      }

      return t("WAVE1.MAP.FILTER_CATEGORIES_COUNT", { count: selectedCategoryIds.length })
    }, [categories, selectedCategoryIds, t])

    const hasCategorySelection = selectedCategoryIds.length > 0
    const selectedCategoryIdSet = useMemo(() => new Set(selectedCategoryIds), [selectedCategoryIds])

    const visibleCategories = useMemo(() => {
      if (!hasCategorySelection) {
        return categories
      }

      const selected = selectedCategoryIds
        .map((id) => categories.find((category) => category.id === id))
        .filter((category): category is CategoryItem => category !== undefined)

      const unselected = categories.filter((category) => !selectedCategoryIdSet.has(category.id))

      return [...selected, ...unselected]
    }, [categories, hasCategorySelection, selectedCategoryIdSet, selectedCategoryIds])

    const formatPlaceDistance = useCallback(
      (place: EstablishmentDTO) => formatMapDistanceLabel(calculateMapDistanceMeters(userLocation, place.position)),
      [userLocation]
    )

    const filteredPlaces = useMemo((): EstablishmentDTO[] => {
      if (parityCapture || isSearchResultsView || selectedCategoryIds.length === 0) {
        return places
      }

      const selectedTypes = new Set(selectedCategoryIds)
      return places.filter((place) => selectedTypes.has(place.establishmentTypeId))
    }, [isSearchResultsView, parityCapture, places, selectedCategoryIds])

    const listItems = useMemo((): NearbyListItem[] => {
      if (parityCapture) {
        return [
          {
            distance: t("WAVE1.MAP.DISTANCE_1"),
            iconBg: MAP_CATEGORY_TONES.bakery,
            iconSrc: mapAssets.catBakery,
            id: "figma-1",
            subtitle: truncateMapAddress(t("WAVE1.MAP.PLACE_1_ADDRESS")),
            title: t("WAVE1.MAP.PLACE_1_TITLE"),
          },
          {
            distance: t("WAVE1.MAP.DISTANCE_2"),
            iconBg: "bg-[#f48fb1]",
            id: "figma-2",
            subtitle: truncateMapAddress(t("WAVE1.MAP.PLACE_2_ADDRESS")),
            title: t("WAVE1.MAP.PLACE_2_TITLE"),
          },
          {
            distance: t("WAVE1.MAP.DISTANCE_3"),
            iconBg: "bg-[#ff8e00]",
            id: "figma-3",
            subtitle: truncateMapAddress(t("WAVE1.MAP.PLACE_3_ADDRESS")),
            title: t("WAVE1.MAP.PLACE_3_TITLE"),
          },
        ] satisfies NearbyListItem[]
      }

      if (!filteredPlaces.length) {
        return []
      }

      return filteredPlaces.map((place) => {
        const establishmentType = establishmentTypes?.[place.establishmentTypeId]

        return {
          distance: formatPlaceDistance(place),
          iconBg: establishmentType?.colorCode ?? "",
          iconSrc: establishmentType?.icon,
          id: place.id,
          place,
          subtitle: truncateMapAddress(place.position.address ?? ""),
          title: place.name,
        } satisfies NearbyListItem
      })
    }, [establishmentTypes, filteredPlaces, formatPlaceDistance, parityCapture, t])

    const searchListItems = useMemo((): NearbySearchResultItem[] => {
      if (parityCapture) {
        return [
          {
            distance: "254м",
            hours: t("WAVE1.MAP.OPERATING_HOURS_SAMPLE"),
            id: "figma-search-1",
            image: selectionsAssets.place1,
            logo: selectionsAssets.listLogoFront,
            stars: "4",
            subtitle: "Кирочная улица 8А",
            title: "Пытка Мясом",
          },
          {
            distance: "354м",
            hours: t("WAVE1.MAP.OPERATING_HOURS_SAMPLE"),
            id: "figma-search-2",
            image: selectionsAssets.place2,
            logo: selectionsAssets.listLogoBack,
            stars: "4",
            subtitle: "Кирочная улица 8А",
            title: "Абрау-Дюрсо",
          },
          {
            distance: "554м",
            hours: t("WAVE1.MAP.OPERATING_HOURS_SAMPLE"),
            id: "figma-search-3",
            image: selectionsAssets.listPlace3,
            logo: selectionsAssets.listLogoFront,
            stars: "5",
            subtitle: t("WAVE1.MAP.PLACE_2_ADDRESS"),
            title: "Тануки",
          },
        ] satisfies NearbySearchResultItem[]
      }

      if (!filteredPlaces.length) {
        return []
      }

      return filteredPlaces.map((place) => {
        const media = resolveSearchResultMedia(place)

        return {
          distance: formatPlaceDistance(place),
          hours: null,
          id: place.id,
          ...media,
          stars: ratingToStars(place.rating),
          subtitle: place.position.address ?? "",
          title: place.name,
        }
      })
    }, [filteredPlaces, formatPlaceDistance, parityCapture, t])

    const placeClickHandlers = useRef(new Map<string, () => void>())

    const getPlaceClickHandler = useCallback(
      (place: EstablishmentDTO) => {
        const cached = placeClickHandlers.current.get(place.id)
        if (cached) {
          return cached
        }

        const handler = () => onSelectPlace(place)
        placeClickHandlers.current.set(place.id, handler)
        return handler
      },
      [onSelectPlace]
    )

    const showChevronHandle = isExpandedSwipe || isSearchResultsView

    const drawerHandle = useMemo(() => {
      if (showChevronHandle) return expandedDrawerHandle
      if (state === NearbyModalStates.PIMP_ONLY) return lowDrawerHandle
      return defaultDrawerHandle
    }, [showChevronHandle, state])

    return (
      <Drawer
        additionalTopSpace={additionalTopSpace}
        backgroundImage={undefined}
        className={cn(
          "z-20",
          state === NearbyModalStates.DEFAULT && MAP_NEARBY_DEFAULT_DRAWER_PANEL_CLASS,
          state === NearbyModalStates.PIMP_ONLY && MAP_NEARBY_LOW_DRAWER_PANEL_CLASS
        )}
        disableScroll
        handle={drawerHandle}
        height={height}
        isOpen={state !== NearbyModalStates.HIDDEN}
        onClose={handleDrawerClose}
        onExpand={state === NearbyModalStates.PIMP_ONLY ? onShow : handleDrawerExpand}
        panelClassName="overflow-hidden rounded-t-[10px] bg-[#efeff4]"
        panelHeight={
          state === NearbyModalStates.DEFAULT
            ? `${MAP_NEARBY_DEFAULT_HEIGHT_DVH}dvh`
            : state === NearbyModalStates.PIMP_ONLY
              ? `${MAP_NEARBY_LOW_HEIGHT_DVH}dvh`
              : undefined
        }
        standalone={lp.tgWebAppPlatform === "ios"}
        topGap={drawerTopGap}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col px-4",
            isExpanded && !isSearchResultsView ? "pb-0" : isSearchResultsView ? "pb-0" : "pb-4"
          )}
        >
          {isSearchResultsView ? (
            <div className="mb-4 flex shrink-0 gap-1.5">
              <div
                className="flex h-[46px] min-w-0 flex-1 items-center rounded-[14px] bg-black/[0.04] px-3"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <img alt="" className="mr-2 h-5 w-5 shrink-0" src={mapAssets.search} />
                <input
                  className="w-full min-w-0 bg-transparent text-[#222222] text-[15px] outline-none placeholder:text-[#8d969d]"
                  onBlur={handleInputBlur}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("WAVE1.MAP.SEARCH_INPUT")}
                  ref={inputRef}
                  value={search}
                />
              </div>
              <button
                className="size-[46px] shrink-0"
                onClick={handleClearSearch}
                onMouseDown={(event) => event.preventDefault()}
                type="button"
              >
                <img alt="" className="size-[46px]" src={mapAssets.searchClear} />
              </button>
            </div>
          ) : (
            <div
              className="mb-4 flex h-[46px] shrink-0 items-center rounded-[14px] bg-black/[0.04] px-3"
              onPointerDown={(event) => {
                event.stopPropagation()
                handleSearchActivate()
              }}
            >
              <img alt="" className="mr-2 h-5 w-5" src={mapAssets.search} />
              <input
                className="w-full bg-transparent text-[15px] text-text outline-none placeholder:text-[#8d969d]"
                onBlur={handleInputBlur}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t("WAVE1.MAP.SEARCH_INPUT")}
                readOnly
                ref={inputRef}
                tabIndex={-1}
                value={search}
              />
            </div>
          )}

          {isSearchResultsView ? (
            <div className="mb-0 shrink-0">
              <MapSearchFilterBar
                activePanel={activeFilterPanel}
                categories={filterCategories}
                categoryValue={categoryFilterValue}
                hideCategoryFilter
                minRating={minRating}
                onCategoriesClear={handleCategoriesClear}
                onCategoryToggle={handleCategoryToggle}
                onPanelChange={setActiveFilterPanel}
                onRatingChange={setMinRating}
                selectedCategoryIds={selectedCategoryIds}
              />
            </div>
          ) : categories.length > 0 ? (
            <div className="-mx-4 mb-4 shrink-0 overflow-hidden">
              <div className="flex gap-5 overflow-x-auto pb-1 pl-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {hasCategorySelection ? <CategoryFilterCancelChip onClick={handleCategoriesClear} /> : null}
                {visibleCategories.map((category) => {
                  const isDimmed = hasCategorySelection && !selectedCategoryIdSet.has(category.id)

                  return (
                    <CategoryFilterChip
                      dimmed={isDimmed}
                      icon={category.icon}
                      key={category.id}
                      label={category.label}
                      onClick={() => handleCategoryClick(category.id)}
                      tone={category.tone}
                    />
                  )
                })}
              </div>
            </div>
          ) : null}

          <p
            className={cn(
              "mb-0 flex h-8 shrink-0 items-center text-[#707579] text-[13px] uppercase",
              isSearchResultsView ? "mt-4 pl-4" : "pl-4"
            )}
          >
            {isSearchResultsView ? t("WAVE1.MAP.SEARCH_RESULTS_TITLE") : t("WAVE1.MAP.NEARBY_TITLE")}
          </p>

          {isSearchResultsView ? (
            <div className="mt-0 min-h-0 flex-1 space-y-2.5 overflow-y-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {searchListItems.length > 0 ? (
                searchListItems.map((item) => {
                  const place = filteredPlaces.find((entry) => entry.id === item.id)

                  return (
                    <NearbySearchResultRow
                      item={item}
                      key={item.id}
                      onClick={place ? getPlaceClickHandler(place) : () => {}}
                      parityCapture={parityCapture}
                    />
                  )
                })
              ) : (
                <p className="py-6 text-center text-[#8d969d] text-[15px]">{t("WAVE1.MAP.EMPTY_NEARBY")}</p>
              )}
            </div>
          ) : (
            <div className="mt-0 min-h-0 flex-1 overflow-y-auto rounded-2xl bg-white [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {listItems.length > 0 ? (
                listItems.map((item, index) => (
                  <NearbyRow
                    isLast={index === listItems.length - 1}
                    item={item}
                    key={item.id}
                    onClick={item.place ? getPlaceClickHandler(item.place) : () => {}}
                    separatorInset
                  />
                ))
              ) : (
                <p className="py-6 text-center text-[#8d969d] text-[15px]">{t("WAVE1.MAP.EMPTY_NEARBY")}</p>
              )}
            </div>
          )}
        </div>
      </Drawer>
    )
  }
)

NearbyModal.displayName = "NearbyModal"
