import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { ShowMainButton } from "@/components/tg-internals"
import { employeeQueryOptions } from "@point/shared/api/point/employee"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Img from "react-cool-img"
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
      <div className="mb-4 flex flex-col items-center justify-center">
        <Img
          className="mb-4 h-24 w-24 rounded-full"
          src={employee.account?.purpose?.icon}
          alt={employee.account?.jobPlace?.name}
        />

        <div className="mb-2 text-center font-medium text-title-1">{employee.name}</div>
        <div className="text-center font-normal text-caption-1 text-text-secondary">Employee</div>
      </div>

      <List className="mb-7" title="Fundraising">
        <ListItem
          leftIcon={
            <Img
              className="h-12 w-12 rounded-full"
              src={employee.account?.purpose?.icon}
              alt={employee.account?.jobPlace?.name}
            />
          }
          leftTopText={<span className="font-medium">{employee.account?.purpose?.title}</span>}
          leftBottomText={<span className="">{employee.account?.purpose?.description}</span>}
        />
      </List>

      <List>
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Telegram</span>}
          leftBottomText={
            <button
              type="button"
              onClick={() => {
                openTelegramLink(`t.me/${employee.username}`)
              }}
              className="text-accent text-base"
            >
              @{employee.username}
            </button>
          }
          withSeparator
        />
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">User Rank</span>}
          leftBottomText={<span className="text-base text-text">{employee.rank}</span>}
          withSeparator
        />
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Place of Work</span>}
          leftBottomText={<span className="text-base text-text">{employee.account?.jobPlace?.name}</span>}
          withSeparator
        />
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Address</span>}
          leftBottomText={<span className="text-base text-text">{employee.account?.jobPlace?.address || "N/A"}</span>}
        />
      </List>
    </ShowMainButton>
  )
}
