import { memo } from "react"

import type { Platform } from "@telegram-apps/sdk-react"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

import { useTranslation } from "@point/i18n"
import { SCROLL_CONTAINER_ID } from "@point/shared/constants/ui"
import { cn } from "@point/ui/cn"
import { Menu } from "@point/ui/menu"

import { showMenuAtom } from "@/atoms/ui"

import { Icon } from "@point/ui/icon"
import BackButton from "./BackButton"
import { MainButton } from "./MainButton"
import { StyledToaster } from "./Toaster"

interface LayoutProps {
	platform: Platform
	children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = memo(({ platform, children }) => {
	const { t } = useTranslation()
	const showMenu = useAtomValue(showMenuAtom)

	// TODO: Придумать куда это вынести
	const items = [
		{
			label: t("Selections"),
			icon: <Icon name="Frame 1580" className="h-10 w-10 text-[#979797] dark:text-text-secondary" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
			},
			active: location.pathname.startsWith("/selections"),
			disabled: location.pathname === "/selections",
		},
		{
			label: t("Map"),
			icon: <Icon name="Globe Europe Africa Fill" className="h-10 w-10 text-[#979797] dark:text-text-secondary" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
			},
			active: location.pathname.startsWith("/map"),
			disabled: location.pathname === "/map",
		},
		{
			label: t("Earn"),
			icon: <Icon name="CoinsFill" className="h-10 w-10 text-[#979797] dark:text-text-secondary" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
			},
			active: location.pathname.startsWith("/earn"),
			disabled: location.pathname === "/earn",
		},
		{
			label: t("Account"),
			icon: <Icon name="User Circle Outline" className="h-10 w-10 text-[#979797] dark:text-text-secondary" />,
			onClick: async () => {
				hapticFeedback.impactOccurred("medium")
			},
			active: location.pathname.startsWith("/bank"),
			disabled: location.pathname === "/bank",
		},
	]

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-background">
			<StyledToaster />
			<div className="flex-grow overflow-y-auto" id={SCROLL_CONTAINER_ID}>
				<div
					className={cn({
						"m-auto box-border flex h-full w-full flex-col p-4": true,
					})}
				>
					{children}
				</div>
			</div>

			{showMenu && <Menu items={items} standalone={platform === "ios"} />}

			<MainButton />
			<BackButton />
		</div>
	)
})

Layout.displayName = "Layout"
