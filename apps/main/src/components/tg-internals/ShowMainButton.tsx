/* eslint-disable react-hooks/exhaustive-deps */

import type { ButtonProps } from "./types"

import { useSetAtom } from "jotai"
import { memo, useCallback, useEffect } from "react"

import { sleep } from "@point/shared/utils/sleep"

import { mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"

interface ShowMainButtonProps extends ButtonProps {
  children?: React.ReactNode
  secondary?: ButtonProps

  withDelay?: boolean
}

export const ShowMainButton: React.FC<ShowMainButtonProps> = memo(
  ({ onClick, loading, disabled, title, hidden, secondary, children, withDelay = false }) => {
    const setMainButton = useSetAtom(mainButtonAtom)
    const setSecondaryButton = useSetAtom(secondaryButtonAtom)

    const revealButtonsWithDelay = useCallback(async () => {
      // NOTE: это попытка убрать подлагивание анимаций при появлении mainButton
      if (withDelay) await sleep(800)

      setMainButton({ disabled, hidden, loading, onClick, title })

      if (secondary) {
        setSecondaryButton({
          disabled: secondary.disabled,
          hidden: secondary.hidden,
          loading: secondary.loading,
          onClick: secondary.onClick,
          position: secondary.position,
          title: secondary.title,
        })
      }
    }, [withDelay, onClick, loading, disabled, title, hidden, secondary, setMainButton, setSecondaryButton])

    // biome-ignore lint/correctness/useExhaustiveDependencies: i want to control this effect manually
    useEffect(() => {
      void revealButtonsWithDelay()

      return () => {
        setMainButton({})
        setSecondaryButton({})
      }
    }, [revealButtonsWithDelay])

    return children
  }
)

ShowMainButton.displayName = "ShowMainButton"
