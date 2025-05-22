import type React from "react"
import { useEffect, useRef } from "react"

import { Icon } from "@/primitives/icon"
import { cn } from "@/utils/cn"

interface DrawerProps {
	children: React.ReactNode
	isOpen: boolean
	onClose: () => void
	title?: string
	height?: "full" | "xl" | "lg" | "md" | "sm"
	isBorderHidden?: boolean
}

export const Drawer = ({ children, isOpen, onClose, title, height = "md", isBorderHidden = false }: DrawerProps) => {
	const drawerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return

		// TODO: нужна доработка, если есть скролл у контента, то ест он выше чем высота самого drawer, то надо отключать эту логику
		// вернее, сделать возможность ее отключить пропом либо закрывать только если scrollY === 0 (то есть только в самом верху,)
		// чтобы пользователь мог свободно скроллить вверх-вниз, не закрывая drawer
		if (height === "full") {
			return
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
		}

		const drawerElement = drawerRef.current

		if (drawerElement) {
			drawerElement.addEventListener("touchstart", handleTouchStart)
			drawerElement.addEventListener("touchmove", handleTouchMove)
			drawerElement.addEventListener("touchend", handleTouchEnd)
		}

		return () => {
			if (drawerElement) {
				drawerElement.removeEventListener("touchstart", handleTouchStart)
				drawerElement.removeEventListener("touchmove", handleTouchMove)
				drawerElement.removeEventListener("touchend", handleTouchEnd)
			}
		}
	}, [isOpen, onClose, height])

	return (
		<div className="z-40 flex">
			{isOpen && (
				<div className={cn("fixed inset-0 z-10 bg-black/35 dark:bg-white/35")} role="presentation" onClick={onClose} />
			)}

			<div
				ref={drawerRef}
				className={cn(
					"fixed bottom-0 left-0 z-20 flex h-[60%] w-full translate-y-full transform flex-col bg-background shadow-lg transition-all duration-500",
					{
						"translate-y-0": isOpen,
						"h-full": height === "full",
						"h-5/6 rounded-t-2xl": height === "xl",
						"h-4/6 rounded-t-2xl": height === "lg",
						"h-3/6 rounded-t-2xl": height === "md",
						"h-2/6 rounded-t-2xl": height === "sm",
					}
				)}
				role="dialog"
			>
				<div className="-top-4 -translate-x-1/2 absolute left-1/2 p-2">
					<div className="h-1 w-8 rounded-full bg-background" />
				</div>

				<div className="flex flex-grow flex-col overflow-hidden rounded-t-2xl">
					<div
						className={cn("flex items-center justify-between pt-2 pr-2 pb-2 pl-4", {
							"pt-4": !!title,
							"border-black/5 border-b dark:border-white/5": !isBorderHidden,
						})}
					>
						<h2 className="font-normal text-text text-title-1">{title}</h2>
						<button type="button" onClick={onClose}>
							<Icon name="Globe Europe Africa Fill" className="h-10 w-10 animate-float text-text" />
						</button>
					</div>

					<div className="flex-grow overflow-y-auto pb-4">{children}</div>
				</div>
			</div>
		</div>
	)
}
