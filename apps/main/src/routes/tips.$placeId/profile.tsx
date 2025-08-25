import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useMemo } from "react"
import z from "zod"

import { userQueryOptions } from "@point/shared/api/point/user"

import { ShowMainButton } from "@/components/tg-internals"
import { UserProfile } from "@/components/user-profile"

export const Route = createFileRoute("/tips/$placeId/profile")({
  component: RouteComponent,
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(userQueryOptions(deps.id))
  },
  loaderDeps: ({ search: { id } }) => ({ id }),
  validateSearch: zodValidator(
    z.object({
      id: z.string().or(z.number()).optional(),
    })
  ),
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const navigate = Route.useNavigate()

  const userQuery = useSuspenseQuery(userQueryOptions(id))
  const user = userQuery.data

  const mainButtonConfig = useMemo(
    () => ({
      disabled: false,
      loading: false,
      onClick: () => {
        user.employee?.id
          ? navigate({ search: { id, recipient: user.employee?.id }, to: "/tips/$placeId/assets" })
          : undefined
      },
      title: "Send a tip",
    }),
    [user.employee?.id, navigate, id]
  )

  const handleFundraisingClick = () => {
    if (user.employee?.id) {
      navigate({
        params: { id: user.employee?.id.toString() },
        search: { preview: true },
        to: "/profile/$id/fundraising",
      })
    }
  }

  return (
    <ShowMainButton {...mainButtonConfig}>
      <UserProfile
        jobPlace={user.employee?.jobPlace}
        name={user.employee?.name || null}
        // TODO: забирать с предыдущего экрана (с квери предыдущего экрана если быть точнее)
        onFundraisingClick={handleFundraisingClick}
        photo={user.employee?.photo || null}
        purpose={user.employee?.purpose}
        rank={user.rank}
        username={user.username}
      />
    </ShowMainButton>
  )
}
