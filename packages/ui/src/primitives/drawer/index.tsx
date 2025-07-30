import { cn } from "@/utils/cn"
import type React from "react"
import { useEffect, useRef } from "react"

interface DrawerProps {
  children: React.ReactNode
  height?: "full" | "xl" | "lg" | "md" | "sm" | "pimp-only"
  standalone?: boolean
  additionalTopSpace?: number

  className?: string

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
  className,
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

  return (
    <dialog className={cn("z-40 flex", { "z-20": height === "pimp-only" }, className)}>
      <div
        ref={drawerRef}
        className={cn(
          "fixed bottom-0 left-0 flex h-[60%] w-full translate-y-full transform flex-col rounded-t-2xl bg-background shadow-lg transition-all duration-500",
          {
            "translate-y-0": isOpen,
            // TODO: remove this hack, need to find a better way to handle this
            "h-full rounded-t-none": height === "full" && !additionalTopSpace,
            "h-[calc(100%-100px)] rounded-t-none": height === "full" && additionalTopSpace,
            "h-5/6": height === "xl",
            "h-4/6": height === "lg",
            "h-3/6": height === "md",
            "h-2/6": height === "sm",
            // TODO: remove this hack, need to find a better way to handle this
            "h-44": height === "pimp-only" && standalone,
            "h-42": height === "pimp-only" && !standalone,
          }
        )}
        role="presentation"
      >
        <div ref={drawerPimp} className="relative">
          {!!backgroundImage && (
            <div
              style={{ backgroundImage: `url(${backgroundImage})` }}
              className={cn("left-0 h-32 w-full rounded-t-2xl bg-black/10 bg-center bg-cover bg-no-repeat", {
                "rounded-t-none": height === "full",
              })}
            />
          )}

          <div
            className={cn("flex w-full justify-center rounded-t-2xl bg-background p-2", {
              "absolute bottom-0 left-0 ": !!backgroundImage,
            })}
          >
            <div className="h-1 w-8 rounded-full bg-[#CBCBCB]" />
          </div>
        </div>

        <div className="flex flex-grow flex-col overflow-hidden">
          <div ref={scrollableAreaRef} className={cn("flex-grow pb-4", { "overflow-y-auto": !disableScroll })}>
            {children}
          </div>
        </div>
      </div>
    </dialog>
  )
}
