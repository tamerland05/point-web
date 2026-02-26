import { useCanGoBack, useMatches, useMatchRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { backButton, hideBackButton, showBackButton } from "@telegram-apps/sdk-react"
import { useCallback, useEffect, useMemo } from "react"

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
  const navigate = useNavigate()
  const canGoBack = useCanGoBack()
  const matchFn = useMatchRoute()
  const matches = useMatches()

  const backButtonExclude = routesWithoutBB.some((route) => !!matchFn(route))

  const { getLogicalBackTarget, params: matchParams } = useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i]
      if (!match) continue
      const getBackTarget = (
        match.staticData as {
          getLogicalBackTarget?: (p: Record<string, string | undefined>) => {
            to: string
            params?: Record<string, string>
            search?: Record<string, unknown>
          }
        }
      )?.getLogicalBackTarget
      if (getBackTarget) {
        return { getLogicalBackTarget: getBackTarget, params: match.params }
      }
    }
    return { getLogicalBackTarget: undefined, params: {} as Record<string, string | undefined> }
  }, [matches])

  const hasLogicalParent = !!getLogicalBackTarget
  const canShowBack = canGoBack || hasLogicalParent

  const handleBackClick = useCallback(() => {
    if (getLogicalBackTarget && matchParams) {
      const target = getLogicalBackTarget(matchParams)
      if (target) {
        void navigate({ ...target, replace: true })
        return
      }
    }

    if (canGoBack) {
      router.history.back()
    }
  }, [canGoBack, getLogicalBackTarget, matchParams, navigate, router])

  useEffect(() => {
    backButton.onClick(handleBackClick)
    hideBackButton()
  }, [handleBackClick])

  useEffect(() => {
    if (!backButtonExclude && canShowBack) {
      showBackButton()
    } else {
      hideBackButton()
    }

    return () => {
      hideBackButton()
    }
  }, [backButtonExclude, canShowBack])

  return null
}
