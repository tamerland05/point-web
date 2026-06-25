import { createFileRoute, Outlet, useLocation, useMatches, useNavigate } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"

import { useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { cn } from "@point/ui/cn"

import { showMenuAtom } from "@/atoms/ui"
import { mapAssets } from "@/components/map/mapAssets"
import { AppBottomMenu } from "@/components/navigation/AppBottomMenu"
import { NavMenuIcon } from "@/components/navigation/NavMenuIcon"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createFileRoute("/_withMenu")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (context.launchParams?.tgWebAppData && context.initDataRaw) {
      queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    }
  },
})

export const menuItems = [
  { icon: mapAssets.navBonuses, iconActive: mapAssets.navBonusesActive, label: "WAVE1.MENU.BONUSES", path: "/loyalty" },
  {
    icon: mapAssets.navWall,
    iconActive: mapAssets.navWallActive,
    iconClassName: "h-8 w-8",
    label: "WAVE1.MENU.WALL",
    path: "/selections",
  },
  { icon: mapAssets.navMap, iconActive: mapAssets.navMapActive, label: "WAVE1.MENU.MAP", path: "/map" },
  { icon: mapAssets.navAccount, iconActive: mapAssets.navAccountActive, label: "WAVE1.MENU.ACCOUNT", path: "/account" },
] as const

function RouteComponent() {
  const { t } = useTranslation()
  const showMenu = useAtomValue(showMenuAtom)
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const matches = useMatches({ select: (matches) => matches.map((match) => match.fullPath) })
  const parityCapture = useParityCapture()

  const items = menuItems.map((item) => {
    const active = matches.includes(item.path)

    return {
      active,
      disabled: pathname === item.path,
      icon: (
        <NavMenuIcon
          active={active}
          activeSrc={item.iconActive}
          iconClassName={"iconClassName" in item ? item.iconClassName : undefined}
          src={item.icon}
        />
      ),
      label: t(item.label),
      onClick: () => {
        hapticFeedback.impactOccurred("medium")
        void navigate({ to: item.path })
      },
    }
  })

  const isMapPage = matches.includes("/map")
  const isSelectionsPage = pathname === "/selections"
  const isLoyaltyPage = pathname === "/loyalty"
  const isAccountPage = pathname === "/account"
  const isFullBleedPage = isMapPage || isSelectionsPage || isLoyaltyPage
  const showBottomMenu = showMenu && !parityCapture

  return (
    <>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 [view-transition-name:main-content]">
          <div
            className={cn(
              "h-full w-full overflow-y-auto",
              { "bg-[#efeff4]": isSelectionsPage || isLoyaltyPage || isAccountPage },
              !isFullBleedPage && "p-4",
              showBottomMenu && "pb-[118px]"
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {showBottomMenu ? <AppBottomMenu items={items} /> : null}
    </>
  )
}
