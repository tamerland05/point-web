import { GetLanguageData } from "@/components/app-internals/GetLanguageData"
import { StyledToaster } from "@/components/app-internals/Toaster"
import { ButtonsController } from "@/components/tg-internals"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, useMatches } from "@tanstack/react-router"
import { Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { retrieveLaunchParams, useSignal } from "@telegram-apps/sdk-react"
import { viewport } from "@telegram-apps/sdk-react"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { useMemo } from "react"
import { MapProvider } from "react-map-gl/mapbox"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  beforeLoad: ({ context }) => {
    try {
      const launchParams = retrieveLaunchParams(true)

      return { ...context, launchParams }
    } catch {
      return { ...context, launchParams: null }
    }
  },
})

function RootComponent() {
  const inset = useSignal(viewport.safeAreaInsets)
  const contentInset = useSignal(viewport.contentSafeAreaInsets)

  const tgSpacesStyle = useMemo(
    () => ({
      paddingTop: inset.top + contentInset.top,
      paddingLeft: inset.left,
      paddingRight: inset.right,
    }),
    [inset, contentInset]
  )

  const matches = useMatches({ select: (matches) => matches.map((match) => match.fullPath) })
  const disableTgSpaces = matches.includes("/map")

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
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
        <TanStackRouterDevtools />
      </MapProvider>
    </TonConnectUIProvider>
  )
}
