import { memo, useEffect } from "react"

import { secondaryButton } from "@telegram-apps/sdk-react"

import type { ButtonProps } from "./types"

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
      isLoaderVisible: !!loading,
      isEnabled: !disabled,
      isVisible: !hidden,
      text: title || "",
      position: position || "left",
    })
  }, [loading, disabled, hidden, title, position])

  return null
})

SecondaryButtonTMA.displayName = "SecondaryButtonTMA"
