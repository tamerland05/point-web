import { Outlet, createFileRoute, useLoaderData, useLocation, useMatches, useNavigate } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

import { showMenuAtom } from "@/atoms/ui"
import { useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { Menu } from "@point/ui/menu"

export const Route = createFileRoute("/_withMenu")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      return { platform: "android" }
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))

    return { platform: context.launchParams.tgWebAppPlatform }
  },

  staleTime: Number.POSITIVE_INFINITY,
})

export const menuItems = [
  { label: "Selections", icon: "Frame 1580", path: "/selections" },
  { label: "Map", icon: "Globe Europe Africa Fill", path: "/map" },
  { label: "Earn", icon: "CoinsFill", path: "/earn" },
  { label: "Account", icon: "User Circle Outline", path: "/account" },
] as const

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
  const items = menuItems.map((item) => ({
    label: t(item.label),
    icon: <Icon name={item.icon} className="h-10 w-10" />,
    onClick: () => {
      hapticFeedback.impactOccurred("medium")
      navigate({ to: item.path })
    },
    active: matches.includes(item.path),
    disabled: pathname === item.path,
  }))

  const isMapPage = matches.includes("/map")

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        <div
          className={cn({
            "m-auto box-border flex h-full w-full flex-col": true,
            "p-4 [view-transition-name:main-content]": !isMapPage,
          })}
        >
          <Outlet />
        </div>
      </div>

      {showMenu && <Menu items={items} standalone={platform === "ios"} />}
    </>
  )
}
