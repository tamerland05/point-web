import { UserProfile } from "@/components/user-profile"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import toast from "react-hot-toast"

export const Route = createFileRoute("/account/my-profile/view")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const ctx = Route.useRouteContext()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  const user = authQuery.data?.user

  const handleEdit = () => {
    navigate({ to: "/account/my-profile/edit" })
  }

  const handleShare = () => {
    // TODO: share && start param to profile
    toast("Share (Link copied?)")
  }

  return (
    <div className="px-4 pt-3 pb-4">
      <UserProfile
        jobPlace={user?.employee?.jobPlace}
        purpose={user?.employee?.purpose}
        photo={user.photoUrl}
        name={user.firstName}
        username={user.username}
        rank={user.rank}
        tipsLeft={user.tipsLeft}
        onEdit={handleEdit}
        onShare={handleShare}
      />
    </div>
  )
}
