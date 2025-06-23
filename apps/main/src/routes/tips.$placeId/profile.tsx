import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { ShowMainButton } from "@/components/tg-internals"
import { UserProfile } from "@/components/user-profile"
import { employeeQueryOptions } from "@point/shared/api/point/employee"
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

    await queryClient.ensureQueryData(employeeQueryOptions(deps.id))
  },

  pendingComponent: () => <div>Loading employee data...</div>,
  errorComponent: ErrorPage,
})

function RouteComponent() {
  const { id } = Route.useSearch()
  const navigate = Route.useNavigate()

  const employeeQuery = useSuspenseQuery(employeeQueryOptions(id))
  const employee = employeeQuery.data

  const mainButtonConfig = useMemo(
    () => ({
      title: "Send a tip",
      loading: false,
      disabled: false,
      onClick: () => {
        navigate({ to: "/tips/$placeId/assets", search: { recipient: employee.account.id } })
      },
    }),
    [employee.account.id, navigate]
  )

  return (
    <ShowMainButton {...mainButtonConfig}>
      <UserProfile
        jobPlace={employee.account.jobPlace}
        purpose={employee.account.purpose}
        // TODO: забирать с предыдущего экрана (с квери предыдущего экрана если быть точнее)
        photo={""}
        name={employee.name}
        rank={employee.rank}
        username={employee.username}
      />
    </ShowMainButton>
  )
}
