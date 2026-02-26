import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { shareMessage } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Img from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import {
  establishmentQueryOptions,
  menuItemQueryOptions,
  shareMenuItemQueryOptions,
} from "@point/shared/api/point/establishments"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/menu_/$id/$menuItemId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    }

    await queryClient.ensureQueryData(establishmentQueryOptions(params.id))

    await queryClient.ensureQueryData(menuItemQueryOptions(params.menuItemId))
  },
  staticData: {
    getLogicalBackTarget: (params: Record<string, string | undefined>) => {
      const id = params["id"]
      return id ? { params: { id }, to: "/menu/$id" as const } : undefined
    },
  },
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { formatCurrency } = useFormatter()

  const navigate = Route.useNavigate()

  // TODO: remove id from query params
  const { menuItemId, id } = Route.useParams()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(id))
  const establishment = establishmentQuery.data

  const menuItemQuery = useSuspenseQuery(menuItemQueryOptions(menuItemId))
  const menuItem = menuItemQuery.data

  const mainButtonConfig = useMemo(() => {
    return {
      hidden: false,
      onClick: async () => {
        const preparedMessage = await queryClient.fetchQuery(shareMenuItemQueryOptions(menuItemId))

        await shareMessage(preparedMessage.id)
      },
      title: "Share",
    }
  }, [menuItemId, queryClient.fetchQuery])

  return (
    <ShowMainButton withDelay {...mainButtonConfig}>
      <div>
        <Img
          alt={menuItemQuery.data?.title}
          className="h-3/5 w-full object-cover"
          error="/img-ph.svg"
          placeholder="/img-ph.svg"
          src={menuItemQuery.data?.photo}
        />

        <div className="-mt-3 relative rounded-t-xl bg-background px-4 py-5">
          <div className="mb-8 flex items-center justify-between">
            <div className="size-6 shrink-0" />
            <div className="flex grow flex-col gap-1">
              <div className="text-center font-semibold text-title-2">{menuItem?.title}</div>
              <div className="text-center text-caption-1 text-text-secondary">{menuItem?.category}</div>
            </div>
            <Icon
              className="size-6 shrink-0 text-transparent"
              name="Close"
              onClick={() => navigate({ params: { id }, replace: true, to: "/menu/$id" })}
            />
          </div>
          <List title="Dish Information">
            <ListItem
              leftBottomText={<span className="text-base text-text">{menuItem?.description}</span>}
              leftTopText={<span className="text-caption-1 text-text-secondary">Description</span>}
              withSeparator
            />
            <ListItem
              leftBottomText={<span className="text-accent text-base">{establishment?.name || "N/A"}</span>}
              leftTopText={<span className="text-caption-1 text-text-secondary">Establishment</span>}
              onClick={() => {
                navigate({ search: { expanded: true, selectedPlaceId: id }, to: "/map" })
              }}
              withSeparator
            />
            <ListItem
              leftBottomText={
                <span className="text-base text-text">
                  {formatCurrency(menuItem?.cost.amount)}
                  {menuItem?.cost.currency}
                </span>
              }
              leftTopText={<span className="text-caption-1 text-text-secondary">Cost</span>}
            />
          </List>
        </div>
      </div>
    </ShowMainButton>
  )
}
