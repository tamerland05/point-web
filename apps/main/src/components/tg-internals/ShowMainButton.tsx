/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useEffect } from "react"

import { useSetAtom } from "jotai"

import { mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"
import type { ButtonProps } from "./types"

export interface ShowMainButtonProps extends ButtonProps {
  children?: React.ReactNode
  secondary?: ButtonProps
}

export const ShowMainButton: React.FC<ShowMainButtonProps> = memo(
  ({ onClick, loading, disabled, title, hidden, secondary, children }) => {
    const setMainButton = useSetAtom(mainButtonAtom)
    const setSecondaryButton = useSetAtom(secondaryButtonAtom)

    // biome-ignore lint/correctness/useExhaustiveDependencies: i want to control this effect manually
    useEffect(() => {
      setMainButton({ onClick, loading, disabled, title, hidden })
      if (secondary) {
        setSecondaryButton({
          onClick: secondary.onClick,
          loading: secondary.loading,
          disabled: secondary.disabled,
          title: secondary.title,
          hidden: secondary.hidden,
          position: secondary.position,
        })
      }
      return () => {
        setMainButton({})
        setSecondaryButton({})
      }
    }, [
      onClick,
      loading,
      disabled,
      title,
      hidden,
      secondary?.disabled,
      secondary?.loading,
      secondary?.onClick,
      secondary?.title,
      secondary?.hidden,
      secondary?.position,
    ])

    return children
  }
)

ShowMainButton.displayName = "ShowMainButton"
