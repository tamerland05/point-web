import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { ShowMainButton } from "@/components/tg-internals"
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
      <pre className="w-full">{JSON.stringify(employee, null, 2)}</pre>
    </ShowMainButton>
  )
}
