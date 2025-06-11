import { useCallback, useEffect } from "react"

import { useCanGoBack, useMatches, useRouter } from "@tanstack/react-router"
import { backButton, hideBackButton, showBackButton } from "@telegram-apps/sdk-react"

const routesWithoutBB = ["/account", "/map", "/earn", "/selections", "/selections/$id"]

export const BackButtonTMA = () => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const matches = useMatches()
  const backButtonExclude = matches.some((match) => routesWithoutBB.includes(match.pathname))

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
