import { authQueryOptions } from "@point/shared/api/point/auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/profile/$id")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))

    // TODO: ensure user profile data if id!==userId
  },
})

function RouteComponent() {
  // const ctx = Route.useRouteContext()

  // // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  // const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  // const user = authQuery.data?.user

  // const handleEdit = () => {
  //   toast("Edit nav")
  // }

  // const handleShare = () => {
  //   toast("Share (Link copied?)")
  // }

  // return (
  //   <div className="px-4 pt-3 pb-4">
  //     <UserProfile
  //       jobPlace={user.account.jobPlace}
  //       purpose={user.account.purpose}
  //       photo={user.photoUrl}
  //       name={user.firstName}
  //       username={user.username}
  //       rank={user.rank}
  //       tipsLeft={user.tipsLeft}
  //       onEdit={handleEdit}
  //       onShare={handleShare}
  //     />
  //   </div>
  // )

  return <div>Hello "/profile/$id"!</div>
}
