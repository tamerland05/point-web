import { EnvUnsupported } from "@/components/app-internals/EnvUnsupported"
import { init } from "@/init"
import { routeTree } from "@/routeTree.gen"
import { menuItems as menuItemsRaw } from "@/routes/_withMenu/route"
import * as Sentry from "@sentry/browser"
import { QueryClient, QueryClientProvider, keepPreviousData } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { retrieveLaunchParams } from "@telegram-apps/sdk-react"
import { StrictMode, memo } from "react"
import ReactDOM from "react-dom/client"

import "@/utils/mockEnv"
import "@point/i18n"
import "@/index.css"
import { PageLoader } from "@point/ui/loader"
import { DefaultCatchBoundary } from "./components/app-internals/ErrorBoundary"
import { ErrorPage } from "./components/app-internals/ErrorPage"

if (!import.meta.env.DEV && import.meta.env.VITE_GLITCHTIP_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_GLITCHTIP_DSN,
    environment: "production",
  })
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 sec
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      placeholderData: keepPreviousData,
    },
  },
})

const menuItems = menuItemsRaw.map((item) => item.path) as string[]

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: memo(() => <ErrorPage />),
  defaultPendingComponent: PageLoader,
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      let direction = "none"

      if (fromLocation) {
        const fromIndex = fromLocation.state.__TSR_index
        const toIndex = toLocation.state.__TSR_index
        const isStayingOnTheSamePage = fromLocation?.pathname === toLocation?.pathname
        const isNavigatingInMenu =
          menuItems.includes(fromLocation?.pathname) && menuItems.includes(toLocation?.pathname)

        if (isStayingOnTheSamePage) {
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
