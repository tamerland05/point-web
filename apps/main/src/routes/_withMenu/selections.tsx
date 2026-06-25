import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { type AuthReq, authQueryOptions } from "@point/shared/api/point/auth"
import {
  type WallTabId,
  wallFeedQueryOptions,
  wallNearbyQueryOptions,
  wallPromosQueryOptions,
  wallRecommendedQueryOptions,
} from "@point/shared/api/point/wall"
import { wallCategoriesQueryOptions } from "@point/shared/api/point/wallCategories"

import { SelectionsWallScreen } from "@/components/selections/SelectionsWallScreen"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"

export const Route = createFileRoute("/_withMenu/selections")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    await Promise.all([
      queryClient.ensureQueryData(wallCategoriesQueryOptions),
      queryClient.ensureQueryData(wallRecommendedQueryOptions),
      queryClient.ensureQueryData(wallPromosQueryOptions),
    ])
  },
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const initDataRaw = ctx.initDataRaw
  const tgWebAppData = ctx.launchParams?.tgWebAppData

  if (!initDataRaw || !tgWebAppData) {
    throw new Error("Нет данных от телеги, перезагрузите приложение")
  }

  return <SelectionsRouteContent initDataRaw={initDataRaw} tgWebAppData={tgWebAppData} />
}

function SelectionsRouteContent({ initDataRaw, tgWebAppData }: { initDataRaw: string; tgWebAppData: AuthReq }) {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const [activeTab, setActiveTab] = useState<WallTabId>("popular")
  const [search, setSearch] = useState("")
  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data
  const wallQuery = useSuspenseQuery(
    wallFeedQueryOptions(activeTab, {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    })
  )
  const categoriesQuery = useSuspenseQuery(wallCategoriesQueryOptions)
  const recommendedQuery = useSuspenseQuery(wallRecommendedQueryOptions)
  const nearbyQuery = useSuspenseQuery(wallNearbyQueryOptions(userLocation.latitude, userLocation.longitude))
  const promosQuery = useSuspenseQuery(wallPromosQueryOptions)
  const authQuery = useSuspenseQuery(authQueryOptions(tgWebAppData, initDataRaw))
  const user = authQuery.data.user

  const filteredSections = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) {
      return wallQuery.data.sections
    }

    return wallQuery.data.sections
      .map((section) => ({
        ...section,
        cards: section.cards.filter(
          (card) =>
            card.title.toLowerCase().includes(needle) ||
            card.subtitle.toLowerCase().includes(needle) ||
            card.tag.toLowerCase().includes(needle)
        ),
      }))
      .filter((section) => section.cards.length > 0)
  }, [search, wallQuery.data.sections])

  const filteredFeedCards = useMemo(() => filteredSections.flatMap((section) => section.cards), [filteredSections])

  const isEmpty = filteredSections.length === 0

  const handlePlaceClick = (establishmentId?: string | null) => {
    void navigate({
      search: { establishmentId: establishmentId ?? undefined },
      to: "/booking/process",
    })
  }

  if (isEmpty) {
    return (
      <div className="min-h-full bg-[#efeff4] px-4 pt-2 pb-[118px]">
        <EmptyStateCard
          actionLabel={t("WAVE1.SELECTIONS.RESET_SEARCH")}
          description={t("WAVE1.SELECTIONS.NOT_FOUND_DESC")}
          onActionClick={() => setSearch("")}
          title={t("WAVE1.SELECTIONS.NOT_FOUND_TITLE")}
        />
      </div>
    )
  }

  return (
    <SelectionsWallScreen
      activeTab={activeTab}
      categories={categoriesQuery.data}
      feedCards={filteredFeedCards}
      nearbyCards={nearbyQuery.data}
      onPlaceClick={handlePlaceClick}
      onSearchChange={setSearch}
      onTabChange={setActiveTab}
      promos={promosQuery.data}
      recommendedCards={recommendedQuery.data}
      search={search}
      userName={user.employee?.name || user.name || ""}
      userPhoto={user.employee?.photo || user.photoUrl}
    />
  )
}
