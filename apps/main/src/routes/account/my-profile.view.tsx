import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { authQueryOptions } from "@point/shared/api/point/auth"

import { UserProfile } from "@/components/user-profile"

export const Route = createFileRoute("/account/my-profile/view")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const ctx = Route.useRouteContext()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!, ctx.initDataRaw!))
  const user = authQuery.data?.user

  const handleEdit = () => {
    navigate({ to: "/account/my-profile/edit" })
  }

  // const handleShare = () => {
  //   // TODO: share && start param to profile
  //   toast("Share (Link copied?)")
  // }

  const handleFundraisingClick = () => {
    if (user?.id) {
      navigate({ params: { id: user.id.toString() }, search: { preview: true }, to: "/profile/$id/fundraising" })
    }
  }

  return (
    <div className="p-4">
      <UserProfile
        jobPlace={user?.employee?.jobPlace}
        name={user.employee?.name || user.name}
        onEdit={handleEdit}
        onFundraisingClick={handleFundraisingClick}
        photo={user.employee?.photo || user.photoUrl || ""}
        purpose={user?.employee?.purpose}
        rank={user.rank}
        tipsLeft={user.tipsLeft}
        // onShare={handleShare}
        username={user.username}
      />
    </div>
  )
}
