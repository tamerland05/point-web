import { showMenuAtom } from "@/atoms/ui"
import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { Menu } from "@point/ui/menu"
import { Outlet, createFileRoute, useLoaderData, useLocation, useMatches, useNavigate } from "@tanstack/react-router"
import { hapticFeedback, retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

export const Route = createFileRoute("/_withMenu")({
	component: RouteComponent,
	loader: async () => {
		try {
			const lp = retrieveLaunchParams()

			return { platform: lp.tgWebAppPlatform }
		} catch {
			return { platform: "android" }
		}
	},
	staleTime: Number.POSITIVE_INFINITY,
})

function RouteComponent() {
	const { t } = useTranslation()
	const showMenu = useAtomValue(showMenuAtom)
	const navigate = useNavigate()
	const pathname = useLocation({
		select: (location) => location.pathname,
	})

	const matches = useMatches({ select: (matches) => matches.map((match) => match.fullPath) })

	const { platform } = useLoaderData({ from: "/_withMenu" })

	// TODO: Придумать куда это вынести
	const items = [
		{
			label: t("Selections"),
			icon: <Icon name="Frame 1580" className="h-10 w-10" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
				navigate({ to: "/selections" })
			},
			active: matches.includes("/selections"),
			disabled: pathname === "/selections",
		},
		{
			label: t("Map"),
			icon: <Icon name="Globe Europe Africa Fill" className="h-10 w-10" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
				navigate({ to: "/map" })
			},
			active: matches.includes("/map"),
			disabled: pathname === "/map",
		},
		{
			label: t("Earn"),
			icon: <Icon name="CoinsFill" className="h-10 w-10" />,
			onClick: () => {
				hapticFeedback.impactOccurred("medium")
				navigate({ to: "/earn" })
			},
			active: matches.includes("/earn"),
			disabled: pathname === "/earn",
		},
		{
			label: t("Account"),
			icon: <Icon name="User Circle Outline" className="h-10 w-10" />,
			onClick: async () => {
				hapticFeedback.impactOccurred("medium")
				navigate({ to: "/account" })
			},
			active: matches.includes("/account"),
			disabled: pathname === "/account",
		},
	]

	const disablePadding = matches.includes("/map") || matches.includes("/earn")

	return (
		<>
			<div className="flex-grow overflow-y-auto">
				<div
					className={cn({
						"m-auto box-border flex h-full w-full flex-col": true,
						"p-4": !disablePadding,
					})}
				>
					<Outlet />
				</div>
			</div>

			{showMenu && <Menu items={items} standalone={platform === "ios"} />}
		</>
	)
}
