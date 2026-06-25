import { createFileRoute } from "@tanstack/react-router"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { earnTasksQueryOptions } from "@point/shared/api/point/earn"

import { EarnLegacyScreen } from "@/components/earn/EarnLegacyScreen"
import { earnLegacyBeforeLoad } from "@/config/earnLegacy"

export const Route = createFileRoute("/_withMenu/earn")({
  beforeLoad: earnLegacyBeforeLoad,
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    queryClient.ensureQueryData(earnTasksQueryOptions)
  },
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const initDataRaw = ctx.initDataRaw
  const tgWebAppData = ctx.launchParams?.tgWebAppData

  if (!initDataRaw || !tgWebAppData) {
    throw new Error("Нет данных от телеги, перезагрузите приложение")
  }

  return (
    <EarnLegacyScreen
      initDataRaw={initDataRaw}
      onNavigate={(to) => {
        void navigate({ to })
      }}
      tgWebAppData={tgWebAppData}
    />
  )
}
