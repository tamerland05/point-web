import { UserProfile } from "@/components/user-profile"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { userQueryOptions } from "@point/shared/api/point/user"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

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

  const userQuery = useSuspenseQuery(userQueryOptions(params.id))
  const user = userQuery.data

  return (
    <div className="p-4">
      <UserProfile
        jobPlace={user.employee?.jobPlace}
        purpose={user.employee?.purpose}
        photo={user.photoUrl}
        name={user.name}
        username={user.username}
        rank={user.rank}
        tipsLeft={user.tipsLeft}
      />
    </div>
  )
}
