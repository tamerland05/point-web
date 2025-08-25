import type { QueryClient } from "@tanstack/react-query"

import { createRootRouteWithContext, Outlet, useMatches } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { retrieveLaunchParams, retrieveRawInitData, useSignal, viewport } from "@telegram-apps/sdk-react"
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react"
import { useMemo } from "react"
import toast from "react-hot-toast"
import { MapProvider } from "react-map-gl/mapbox"

import { GetLanguageData } from "@/components/app-internals/GetLanguageData"
import { StyledToaster } from "@/components/app-internals/Toaster"
import { WalletAddressWatcher } from "@/components/app-internals/WalletAddressWatcher"
import { ButtonsController } from "@/components/tg-internals"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: ({ context }) => {
    try {
      const launchParams = retrieveLaunchParams(true)
      const initDataRaw = retrieveRawInitData()

      return { ...context, initDataRaw, launchParams }
    } catch {
      toast.error("Не удалось получить telegram launch params, перезагрузите приложение")
      return { ...context, initDataRaw: null, launchParams: null }
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const inset = useSignal(viewport.safeAreaInsets)
  const contentInset = useSignal(viewport.contentSafeAreaInsets)
  const { launchParams, initDataRaw } = Route.useRouteContext()

  const tgSpacesStyle = useMemo(
    () => ({
      paddingLeft: inset.left,
      paddingRight: inset.right,
      paddingTop: inset.top + contentInset.top,
    }),
    [inset, contentInset]
  )

  const matches = useMatches({ select: (matches) => matches.map((match) => match.fullPath) })
  const disableTgSpaces = matches.includes("/map") || matches.includes("/menu/$id/$menuItemId")

  return (
    <TonConnectUIProvider
      manifestUrl="https://point-dev.meyson.tech/tonconnect-manifest.json"
      uiPreferences={{
        theme: THEME.LIGHT,
      }}
    >
      <MapProvider>
        <div
          className="flex h-screen flex-col overflow-y-auto bg-background"
          style={disableTgSpaces ? {} : tgSpacesStyle}
        >
          <Outlet />

          <ButtonsController />
          <StyledToaster />
        </div>

        <GetLanguageData />
        {launchParams?.tgWebAppData && (
          <WalletAddressWatcher auth={launchParams.tgWebAppData} initDataRaw={initDataRaw} />
        )}
        <TanStackRouterDevtools />
      </MapProvider>
    </TonConnectUIProvider>
  )
}
