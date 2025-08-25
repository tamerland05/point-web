import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useMemo } from "react"
import Img from "react-cool-img"
import z from "zod"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { userQueryOptions } from "@point/shared/api/point/user"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals/ShowMainButton"

const fundraisingSchema = z.object({
  preview: z.boolean().optional().default(false),
})

export const Route = createFileRoute("/profile_/$id/fundraising")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    const user = await queryClient.ensureQueryData(userQueryOptions(params.id))

    if (!user.employee?.purpose) {
      throw new Error("Purpose is empty")
    }
  },
  validateSearch: zodValidator(fundraisingSchema),
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const params = Route.useParams()
  const search = Route.useSearch()

  const userQuery = useSuspenseQuery(userQueryOptions(params.id))
  const user = userQuery.data

  const mainButtonConfig = useMemo(() => {
    const placeId = user.employee?.jobPlace?.id
    const recipientId = user.employee?.id

    if (!placeId || !recipientId || search.preview) {
      return {
        hidden: true,
        onClick: undefined,
        title: "",
      }
    }

    return {
      onClick: () => navigate({ params: { placeId }, search: { recipient: recipientId }, to: "/tips/$placeId/assets" }),
      title: "Send a Tip",
    }
  }, [user.employee?.jobPlace?.id, user.employee?.id, navigate, search.preview])

  if (!user.employee?.purpose) {
    return null
  }

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col p-4">
        <Img className="mx-auto mt-4 mb-7 size-25 text-transparent" src={user.employee?.purpose.icon} />
        <div className="mb-1 text-center font-semibold text-title-2">{user.employee?.purpose.title}</div>
        <div className="mb-7 text-center text-text-secondary">{user.employee?.purpose.description}</div>

        <List title="Information">
          <ListItem
            className="py-3"
            leftBottomText="The purpose of the fundraiser and its description are specified by the employees themselves"
            leftIcon={<Icon className="size-6 text-transparent" name="Speaker" />}
            leftTopText="Purpose of Fundraising"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="Tips sent are guaranteed to reach the wallet of the employee and the owner of the establishment"
            leftIcon={<Icon className="size-6 text-transparent" name="Smile" />}
            leftTopText="Allocation"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="Our app charges a 10% transaction fee associated with sending a tip"
            leftIcon={<Icon className="size-6 text-transparent" name="Pin" />}
            leftTopText="Application Fee"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
