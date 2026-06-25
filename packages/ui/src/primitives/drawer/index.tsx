import type React from "react"

import { useEffect, useRef } from "react"

import { cn } from "@/utils/cn"

interface DrawerProps {
  children: React.ReactNode
  height?: "full" | "xl" | "lg" | "md" | "sm" | "pimp-only"
  standalone?: boolean
  additionalTopSpace?: number
  /** Extra pixels below `additionalTopSpace` when `height="full"`. */
  topGap?: number
  handle?: React.ReactNode

  /** Pixels subtracted from fractional drawer height (moves top edge down when bottom-anchored). */
  heightInset?: number

  /** Overrides preset fractional height, e.g. `56%`. */
  panelHeight?: string

  className?: string
  panelClassName?: string

  backgroundImage?: string
  disableScroll?: boolean

  isOpen: boolean
  onClose: () => void
  onExpand?: () => void
}

export const Drawer = ({
  children,
  height = "md",
  standalone = false,
  additionalTopSpace,
  topGap = 0,
  heightInset = 0,
  panelHeight,
  handle,
  className,
  panelClassName,
  backgroundImage,
  isOpen,
  onClose,
  onExpand,
  disableScroll = false,
}: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const drawerPimp = useRef<HTMLDivElement>(null)
  const scrollableAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    let touchableElement = drawerRef.current
    // TODO: нужна доработка, если есть скролл у контента, то ест он выше чем высота самого drawer, то надо отключать эту логику
    // вернее, сделать возможность ее отключить пропом либо закрывать только если scrollY === 0 (то есть только в самом верху,)
    // чтобы пользователь мог свободно скроллить вверх-вниз, не закрывая drawer
    if (height === "full") {
      touchableElement = drawerPimp.current
    }

    let startY: number
    let currentY: number

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0]?.clientY ?? 0
    }

    const handleTouchEnd = () => {
      if (currentY - startY > 40) {
        onClose()
      }

      if (currentY - startY < -40) {
        onExpand?.()
      }
    }

    if (touchableElement) {
      touchableElement.addEventListener("touchstart", handleTouchStart)
      touchableElement.addEventListener("touchmove", handleTouchMove)
      touchableElement.addEventListener("touchend", handleTouchEnd)
      // TODO: add mouse triggers
    }

    return () => {
      if (touchableElement) {
        touchableElement.removeEventListener("touchstart", handleTouchStart)
        touchableElement.removeEventListener("touchmove", handleTouchMove)
        touchableElement.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isOpen, onClose, height, onExpand])

  useEffect(() => {
    if (!isOpen && !disableScroll) return
    scrollableAreaRef.current?.scrollTo(0, 0)
  }, [isOpen, disableScroll])

  const topInset = (additionalTopSpace ?? 0) + topGap
  const hasCustomPanel = !!panelClassName
  const fractionalHeightPercent =
    height === "sm"
      ? "33.333333%"
      : height === "md"
        ? "50%"
        : height === "lg"
          ? "66.666667%"
          : height === "xl"
            ? "83.333333%"
            : null
  const customPanelHeightStyle = panelHeight ? { height: panelHeight } : undefined
  const fractionalHeightStyle =
    !customPanelHeightStyle && fractionalHeightPercent && heightInset > 0
      ? { height: `calc(${fractionalHeightPercent} - ${heightInset}px)` }
      : undefined
  const fullHeightStyle =
    !customPanelHeightStyle && height === "full" && topInset > 0 ? { height: `calc(100% - ${topInset}px)` } : undefined
  const panelHeightStyle = customPanelHeightStyle ?? fractionalHeightStyle ?? fullHeightStyle
  const hasExplicitPanelHeight = !!panelHeight || !!panelHeightStyle

  return (
    <dialog className={cn("z-40 flex", { "z-20": height === "pimp-only" }, className)}>
      <div
        className={cn(
          "fixed bottom-0 left-0 flex w-full translate-y-full transform flex-col overflow-hidden shadow-lg transition-all duration-500",
          panelClassName ?? "rounded-t-2xl bg-background",
          {
            "h-2/6": height === "sm" && !hasExplicitPanelHeight,
            "h-3/6": height === "md" && !hasExplicitPanelHeight,
            "h-4/6": height === "lg" && !hasExplicitPanelHeight,
            "h-5/6": height === "xl" && !hasExplicitPanelHeight,
            "h-28": height === "pimp-only" && !standalone,
            "h-30": height === "pimp-only" && standalone,
            "h-full": height === "full" && !hasExplicitPanelHeight,
            "rounded-t-none": height === "full" && !hasCustomPanel,
            "translate-y-0": isOpen,
          }
        )}
        ref={drawerRef}
        role="presentation"
        style={panelHeightStyle}
      >
        <div className="relative shrink-0" ref={drawerPimp}>
          {!!backgroundImage && (
            <div
              className={cn("left-0 h-32 w-full rounded-t-2xl bg-black/10 bg-center bg-cover bg-no-repeat", {
                "rounded-t-none": height === "full",
              })}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}

          <div
            className={cn(
              "flex w-full justify-center px-2 py-3",
              hasCustomPanel ? "bg-inherit" : "rounded-t-2xl bg-background",
              {
                "absolute bottom-0 left-0": !!backgroundImage,
              }
            )}
          >
            {handle ?? <div className="h-1 w-8 rounded-full bg-[#8D969D]" />}
          </div>
        </div>

        <div className="flex min-h-0 flex-grow flex-col overflow-hidden">
          <div
            className={cn("flex min-h-0 flex-grow flex-col pb-4", { "overflow-y-auto": !disableScroll })}
            ref={scrollableAreaRef}
          >
            {children}
          </div>
        </div>
      </div>
    </dialog>
  )
}
