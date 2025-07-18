import { authQueryOptions } from "@point/shared/api/point/auth"
import { tipReceiversQueryOptions } from "@point/shared/api/point/tips"
import { cn } from "@point/ui/cn"
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router"

export const Route = createFileRoute("/tips/$placeId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от Telegram, перезагрузите приложение")
    }

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    }

    await queryClient.ensureQueryData(tipReceiversQueryOptions(params.placeId))
  },
})

function RouteComponent() {
  const location = useLocation()

  const isInputRoute = location.pathname.includes("/input/")

  return (
    <div className={cn("h-full bg-background px-4 py-5", { "[view-transition-name:main-content]": !isInputRoute })}>
      <Outlet />
    </div>
  )
}
