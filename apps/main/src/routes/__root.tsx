import type { QueryClient } from "@tanstack/react-query"

import { createRootRouteWithContext, Outlet, useMatches } from "@tanstack/react-router"
import { retrieveLaunchParams, retrieveRawInitData, useSignal, viewport } from "@telegram-apps/sdk-react"
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react"
import { useMemo } from "react"
import toast from "react-hot-toast"
import { MapProvider } from "react-map-gl/mapbox"

import { GetLanguageData } from "@/components/app-internals/GetLanguageData"
import { StyledToaster } from "@/components/app-internals/Toaster"
import { WalletAddressWatcher } from "@/components/app-internals/WalletAddressWatcher"
import { ButtonsController } from "@/components/tg-internals"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: ({ context, location }) => {
    if (location.pathname.startsWith("/pos/pay/stub")) {
      return { ...context, initDataRaw: null, launchParams: null }
    }
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
  const parityCapture = useParityCapture()
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
  const disableTgSpaces = parityCapture || matches.includes("/map") || matches.some((p) => p.startsWith("/pos/pay/"))

  return (
    <TonConnectUIProvider
      manifestUrl="https://tamerland05.github.io/point-web/apps/main/public/tonconnect-manifest.json"
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

          {!parityCapture ? <ButtonsController /> : null}
          <StyledToaster />
        </div>

        <GetLanguageData />
        {launchParams?.tgWebAppData && (
          <WalletAddressWatcher auth={launchParams.tgWebAppData} initDataRaw={initDataRaw} />
        )}
        {/*{import.meta.env.DEV && !parityCapture ? <TanStackRouterDevtools /> : null}*/}
      </MapProvider>
    </TonConnectUIProvider>
  )
}
