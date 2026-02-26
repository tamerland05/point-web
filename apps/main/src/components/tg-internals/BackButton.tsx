import { useCanGoBack, useMatchRoute, useRouter } from "@tanstack/react-router"
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
  const matchFn = useMatchRoute()

  const backButtonExclude = routesWithoutBB.some((route) => !!matchFn(route))

  const handleBackClick = useCallback(() => {
    router.history.back()

    return
  }, [router])

  useEffect(() => {
    backButton.onClick(handleBackClick)
    hideBackButton()
  }, [handleBackClick])

  useEffect(() => {
    if (!backButtonExclude && canGoBack) {
      showBackButton()
    } else {
      hideBackButton()
    }

    return () => {
      hideBackButton()
    }
  }, [backButtonExclude, canGoBack])

  return null
}
