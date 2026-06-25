import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { type AuthReq, authQueryOptions } from "@point/shared/api/point/auth"
import { loyaltyProgramsQueryOptions } from "@point/shared/api/point/loyalty"

import { LoyaltyScreen } from "@/components/loyalty/LoyaltyScreen"

export const Route = createFileRoute("/_withMenu/loyalty")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    queryClient.ensureQueryData(loyaltyProgramsQueryOptions)
  },
})

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const initDataRaw = ctx.initDataRaw
  const tgWebAppData = ctx.launchParams?.tgWebAppData

  if (!initDataRaw || !tgWebAppData) {
    throw new Error("Нет данных от телеги, перезагрузите приложение")
  }

  return <LoyaltyRouteContent initDataRaw={initDataRaw} tgWebAppData={tgWebAppData} />
}

function LoyaltyRouteContent({ initDataRaw, tgWebAppData }: { initDataRaw: string; tgWebAppData: AuthReq }) {
  const navigate = Route.useNavigate()
  const programsQuery = useSuspenseQuery(loyaltyProgramsQueryOptions)
  const authQuery = useSuspenseQuery(authQueryOptions(tgWebAppData, initDataRaw))
  const user = authQuery.data.user

  return (
    <LoyaltyScreen
      onUsagePlacesClick={(programId) => {
        void navigate({
          search: { programId },
          to: "/loyalty/usage-places",
        })
      }}
      programs={programsQuery.data}
      userName={user.employee?.name || user.name || ""}
      userPhoto={user.employee?.photo || user.photoUrl}
    />
  )
}
