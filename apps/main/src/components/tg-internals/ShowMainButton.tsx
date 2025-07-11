/* eslint-disable react-hooks/exhaustive-deps */

import { memo, useCallback, useEffect } from "react"

import { useSetAtom } from "jotai"

import { mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"
import { sleep } from "@point/shared/utils/sleep"
import type { ButtonProps } from "./types"

export interface ShowMainButtonProps extends ButtonProps {
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
    }, [withDelay, onClick, loading, disabled, title, hidden, secondary, setMainButton, setSecondaryButton])

    // biome-ignore lint/correctness/useExhaustiveDependencies: i want to control this effect manually
    useEffect(() => {
      revealButtonsWithDelay()

      return () => {
        setMainButton({})
        setSecondaryButton({})
      }
    }, [revealButtonsWithDelay])

    return children
  }
)

ShowMainButton.displayName = "ShowMainButton"
