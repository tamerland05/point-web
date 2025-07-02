import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { ShowMainButton } from "@/components/tg-internals"
import { UserProfile } from "@/components/user-profile"
import { userQueryOptions } from "@point/shared/api/point/user"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useMemo } from "react"
import z from "zod"

export const Route = createFileRoute("/tips/$placeId/profile")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      id: z.string(),
    })
  ),
  loaderDeps: ({ search: { id } }) => ({ id }),
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(userQueryOptions(deps.id))
  },

  pendingComponent: () => <div>Loading employee data...</div>,
  errorComponent: ErrorPage,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const navigate = Route.useNavigate()

  const userQuery = useSuspenseQuery(userQueryOptions(id))
  const user = userQuery.data

  const mainButtonConfig = useMemo(
    () => ({
      title: "Send a tip",
      loading: false,
      disabled: false,
      onClick: () => {
        user.employee?.id
          ? navigate({ to: "/tips/$placeId/assets", search: { recipient: user.employee?.id } })
          : undefined
      },
    }),
    [user.employee?.id, navigate]
  )

  return (
    <ShowMainButton {...mainButtonConfig}>
      <UserProfile
        jobPlace={user.employee?.jobPlace}
        purpose={user.employee?.purpose}
        // TODO: забирать с предыдущего экрана (с квери предыдущего экрана если быть точнее)
        photo={""}
        name={user.name}
        rank={user.rank}
        username={user.username}
      />
    </ShowMainButton>
  )
}
