import type { ButtonProps } from "./types"

import { secondaryButton } from "@telegram-apps/sdk-react"
import { memo, useEffect } from "react"

export const SecondaryButtonTMA = memo(({ title, onClick, loading, disabled, hidden, position }: ButtonProps) => {
  useEffect(() => {
    if (onClick !== undefined) {
      secondaryButton.onClick(onClick)
      return () => secondaryButton.offClick(onClick)
    }

    secondaryButton.setParams({ isVisible: false })
    return undefined
  }, [onClick])

  useEffect(() => {
    if (loading) {
      secondaryButton.setParams({ isLoaderVisible: true })
    } else {
      secondaryButton.setParams({ isLoaderVisible: false })
    }
  }, [loading])

  useEffect(() => {
    if (disabled) {
      secondaryButton.setParams({ isEnabled: false })
    } else {
      secondaryButton.setParams({ isEnabled: true })
    }
  }, [disabled])

  useEffect(() => {
    if (title) {
      secondaryButton.setParams({ text: title })
    } else {
      secondaryButton.setParams({ text: "" })
    }
  }, [title])

  useEffect(() => {
    if (hidden) {
      secondaryButton.setParams({ isVisible: false })
    } else {
      secondaryButton.setParams({ isVisible: true })
    }
  }, [hidden])

  useEffect(() => {
    if (position) {
      secondaryButton.setParams({ position })
    } else {
      secondaryButton.setParams({ position: "left" })
    }
  }, [position])

  useEffect(() => {
    secondaryButton.setParams({
      isEnabled: !disabled,
      isLoaderVisible: !!loading,
      isVisible: !hidden,
      position: position || "left",
      text: title || "",
    })
  }, [loading, disabled, hidden, title, position])

  return null
})

SecondaryButtonTMA.displayName = "SecondaryButtonTMA"
