import { createFileRoute, Outlet, useLoaderData, useLocation, useMatches, useNavigate } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

import { useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { Menu } from "@point/ui/menu"

import { showMenuAtom } from "@/atoms/ui"

export const Route = createFileRoute("/_withMenu")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      return { platform: "android" }
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    return { platform: context.launchParams.tgWebAppPlatform }
  },
})

export const menuItems = [
  { icon: "CoinsFill", label: "Earn", path: "/earn" },
  { icon: "Globe Europe Africa Fill", label: "Map", path: "/map" },
  { icon: "User Circle Outline", label: "Account", path: "/account" },
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
    active: matches.includes(item.path),
    disabled: pathname === item.path,
    icon: <Icon className="h-10 w-10" name={item.icon} />,
    label: t(item.label),
    onClick: () => {
      hapticFeedback.impactOccurred("medium")
      void navigate({ to: item.path })
    },
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
