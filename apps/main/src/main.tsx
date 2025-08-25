import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { memo, StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { EnvUnsupported } from "@/components/app-internals/EnvUnsupported"
import { init } from "@/init"
import { menuItems as menuItemsRaw } from "@/routes/_withMenu/route"
import { routeTree } from "@/routeTree.gen"

import "@/utils/mockEnv"
import "@point/i18n"
import "@/index.css"

import Tracker from "@openreplay/tracker"

import { notFoundError } from "@point/shared/constants/errors"
import { PageLoader } from "@point/ui/loader"

import { DefaultCatchBoundary } from "./components/app-internals/ErrorBoundary"
import { ErrorPage } from "./components/app-internals/ErrorPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 sec
    },
  },
})

const menuItems = menuItemsRaw.map((item) => item.path) as string[]

// Set up a Router instance
const router = createRouter({
  context: {
    queryClient,
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: memo(() => <ErrorPage error={notFoundError} />),
  defaultPendingComponent: PageLoader,
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      let direction = "none"

      if (fromLocation) {
        const fromIndex = fromLocation.state.__TSR_index
        const toIndex = toLocation.state.__TSR_index
        const isStayingOnTheSamePage = fromLocation?.pathname === toLocation?.pathname
        const isOnboarding = fromLocation?.pathname === "/onboarding"
        const isNavigatingInMenu =
          menuItems.includes(fromLocation?.pathname) && menuItems.includes(toLocation?.pathname)

        if (isStayingOnTheSamePage && !isOnboarding) {
          return ["none"]
        }

        if (isNavigatingInMenu) {
          const fromMenuIndex = menuItems.indexOf(fromLocation?.pathname)
          const toMenuIndex = menuItems.indexOf(toLocation?.pathname)
          direction = fromMenuIndex > toMenuIndex ? "right" : "left"
          return [`slide-${direction}`]
        }

        direction = fromIndex > toIndex ? "right" : "left"
      }

      return [`slide-${direction}`]
    },
  },
  routeTree,
  scrollRestoration: true,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(rootElement)

try {
  const launchParams = retrieveLaunchParams()

  const { tgWebAppPlatform: platform } = launchParams
  const debug = (launchParams.tgWebAppStartParam || "").includes("debug") || import.meta.env.DEV

  if (!import.meta.env.DEV) {
    const tracker = new Tracker({
      projectKey: "rdipNrss0wptWVzsqm6V",
    })

    tracker.start({
      metadata: {
        appVersion: __APP_VERSION__,
        debug: String(debug),
        isPremium: String(launchParams.tgWebAppData?.user?.is_premium),
        language: launchParams.tgWebAppData?.user?.language_code || "unknown",
        platform,
        version: launchParams.tgWebAppVersion,
      },
      userID: launchParams.tgWebAppData?.user?.username || String(launchParams.tgWebAppData?.user?.id) || "unknown",
    })
  }

  // Configure all application dependencies.
  init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>
    )
  })
} catch (_e) {
  root.render(<EnvUnsupported />)
}
