import { useCanGoBack, useMatchRoute, useParams, useRouter, useSearch } from "@tanstack/react-router"
import { backButton, hideBackButton, showBackButton } from "@telegram-apps/sdk-react"
import { useCallback, useEffect } from "react"

const routesWithoutBB = [
  { to: "/account" },
  { search: { expanded: false }, to: "/map" },
  { to: "/earn" },
  { to: "/selections" },

  { to: "/tips/$placeId/success" },
  { to: "/tips/$placeId/error" },
  { to: "/account/profile-type-updated" },
  { to: "/account/profile-created" },
  { to: "/account/access-restricted" },
  { search: { step: "1" }, to: "/onboarding" },
]

export const BackButtonTMA = () => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const matchRoute = useMatchRoute()
  const params = useParams({ strict: false })
  const search = useSearch({ strict: false })

  const id = params?.id as string | undefined
  const selectedPlaceId = search?.selectedPlaceId as string | undefined

  const isOnMenuItem = !!matchRoute({ to: "/menu/$id/$menuItemId" })
  const isOnMenuList = !!matchRoute({ to: "/menu/$id" })
  const isOnExpandedPlace = !!matchRoute({ to: "/map" }) && search?.expanded === true && !!selectedPlaceId

  const backButtonExclude = routesWithoutBB.some((route) => !!matchRoute(route))

  const canGoLogicalBack =
    canGoBack || (isOnMenuItem && id) || (isOnMenuList && id) || (isOnExpandedPlace && selectedPlaceId)

  const handleBackClick = useCallback(() => {
    if (isOnMenuItem && id) {
      void router.navigate({
        params: { id },
        replace: true,
        to: "/menu/$id",
      })
      return
    }

    if (isOnMenuList && id) {
      void router.navigate({
        replace: true,
        search: {
          expanded: true,
          selectedPlaceId: id,
        },
        to: "/map",
      })
      return
    }

    if (isOnExpandedPlace && selectedPlaceId) {
      void router.navigate({
        replace: true,
        search: {
          expanded: false,
          selectedPlaceId,
        },
        to: "/map",
      })
      return
    }

    if (canGoBack) {
      router.history.back()
    }
  }, [isOnMenuItem, isOnMenuList, isOnExpandedPlace, id, selectedPlaceId, canGoBack, router])

  useEffect(() => {
    backButton.onClick(handleBackClick)
    return () => {
      backButton.offClick(handleBackClick)
    }
  }, [handleBackClick])

  useEffect(() => {
    if (canGoLogicalBack && !backButtonExclude) {
      showBackButton()
    } else {
      hideBackButton()
    }
  }, [canGoLogicalBack, backButtonExclude])

  return null
}
