import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { shareMessage } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Image from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import {
  establishmentQueryOptions,
  menuItemQueryOptions,
  shareMenuItemQueryOptions,
} from "@point/shared/api/point/establishments"
import { useFormatter } from "@point/shared/hooks/useFormatter"
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
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { formatCurrency } = useFormatter()

  const navigate = Route.useNavigate()

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
        shareMessage(preparedMessage.id)
      },
      title: "Поделиться",
    }
  }, [menuItemId, queryClient])

  return (
    <ShowMainButton withDelay {...mainButtonConfig}>
      <div className="m-4 [view-transition-name:main-content]">
        {menuItem?.photo ? (
          <Image
            alt={menuItem.title}
            className="mb-4 h-56 w-full rounded-2xl object-cover"
            error="/img-ph.svg"
            placeholder="/img-ph.svg"
            src={menuItem.photo}
          />
        ) : null}

        <List title="Информация о блюде">
          <ListItem
            leftBottomText={<span className="text-base text-text">{menuItem?.description ?? "—"}</span>}
            leftTopText={<span className="text-caption-1 text-text-secondary">Описание</span>}
            withSeparator
          />
          <ListItem
            leftBottomText={<span className="text-accent">{establishment?.name || "—"}</span>}
            leftTopText={<span className="text-caption-1 text-text-secondary">Заведение</span>}
            onClick={() => {
              navigate({ search: { expanded: true, selectedPlaceId: id }, to: "/map" })
            }}
            withSeparator
          />
          <ListItem
            leftBottomText={
              <span>
                {formatCurrency(menuItem?.cost.amount)}
                {menuItem?.cost.currency}
              </span>
            }
            leftTopText={<span className="text-caption-1 text-text-secondary">Стоимость</span>}
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
