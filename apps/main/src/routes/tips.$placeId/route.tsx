import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { tipReceiversQueryOptions } from "@point/shared/api/point/tips"
import { cn } from "@point/ui/cn"

export const Route = createFileRoute("/tips/$placeId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    }

    await queryClient.ensureQueryData(tipReceiversQueryOptions(params.placeId))
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ErrorPage,
})

function RouteComponent() {
  const location = useLocation()

  const isInputRoute = location.pathname.includes("/input/")

  return (
    <div className={cn("h-full px-4 py-5", { "[view-transition-name:main-content]": !isInputRoute })}>
      <Outlet />
    </div>
  )
}
