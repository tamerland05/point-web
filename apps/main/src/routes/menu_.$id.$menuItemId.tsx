import { ShowMainButton } from "@/components/tg-internals"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions, menuItemQueryOptions } from "@point/shared/api/point/establishments"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { shareURL } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Img from "react-cool-img"

export const Route = createFileRoute("/menu_/$id/$menuItemId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    }

    await queryClient.ensureQueryData(establishmentQueryOptions(params.id))

    await queryClient.ensureQueryData(menuItemQueryOptions(params.menuItemId))
  },
})

function RouteComponent() {
  const router = useRouter()
  const { formatCurrency } = useFormatter()

  const navigate = Route.useNavigate()
  const { menuItemId, id } = Route.useParams()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(id))
  const establishment = establishmentQuery.data

  const menuItemQuery = useSuspenseQuery(menuItemQueryOptions(menuItemId))
  const menuItem = menuItemQuery.data

  const mainButtonConfig = useMemo(() => {
    return {
      title: "Share",
      hidden: false,
      onClick: () =>
        shareURL(
          `${import.meta.env.VITE_TMA_URL}?startapp=menu--${id}--${menuItemId}`,
          `Hey! Check ${menuItem?.title} from ${establishment?.name} 😋`
        ),
    }
  }, [id, menuItemId, menuItem?.title, establishment?.name])

  return (
    <ShowMainButton withDelay {...mainButtonConfig}>
      <div>
        <Img
          placeholder="/img-ph.svg"
          error="/img-ph.svg"
          src={menuItemQuery.data?.photo}
          alt={menuItemQuery.data?.title}
          className="h-3/5 w-full object-cover"
        />

        <div className="-mt-3 relative rounded-t-xl bg-background px-4 py-5">
          <div className="mb-8 flex items-center justify-between">
            <div className="size-6 shrink-0" />
            <div className="flex grow flex-col gap-1">
              <div className=" text-center font-semibold text-title-2">{menuItem?.title}</div>
              <div className=" text-center text-caption-1 text-text-secondary">{menuItem?.category}</div>
            </div>
            <Icon
              name="Close"
              className="size-6 shrink-0 text-transparent"
              onClick={() =>
                router.history.canGoBack() ? router.history.back() : navigate({ to: "/menu/$id", replace: true })
              }
            />
          </div>
          <List title="Dish Information">
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Description</span>}
              leftBottomText={<span className="text-base text-text">{menuItem?.description}</span>}
              withSeparator
            />
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Establishment</span>}
              leftBottomText={<span className="text-accent text-base ">{establishment?.name || "N/A"}</span>}
              onClick={() => {
                navigate({ to: "/map", search: { selectedPlaceId: id, expanded: true } })
              }}
              withSeparator
            />
            <ListItem
              leftTopText={<span className="text-caption-1 text-text-secondary">Cost</span>}
              leftBottomText={
                <span className="text-base text-text">
                  {formatCurrency(menuItem?.cost.amount)} {menuItem?.cost.currency}
                </span>
              }
            />
          </List>
        </div>
      </div>
    </ShowMainButton>
  )
}
