import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { userQueryOptions } from "@point/shared/api/point/user"

import { UserProfile } from "@/components/user-profile"

export const Route = createFileRoute("/profile/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    queryClient.ensureQueryData(userQueryOptions(params.id))
    // TODO: ensure user profile data if id!==userId
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const navigate = Route.useNavigate()

  const userQuery = useSuspenseQuery(userQueryOptions(params.id))
  const user = userQuery.data

  const handleFundraisingClick = () => {
    navigate({ params: { id: params.id }, to: "/profile/$id/fundraising" })
  }

  return (
    <div className="p-4">
      <UserProfile
        jobPlace={user.employee?.jobPlace}
        name={user.employee?.name || user.name}
        onFundraisingClick={handleFundraisingClick}
        photo={user.employee?.photo || user.photoUrl}
        purpose={user.employee?.purpose}
        rank={user.rank}
        tipsLeft={user.tipsLeft}
        username={user.username}
      />
    </div>
  )
}
