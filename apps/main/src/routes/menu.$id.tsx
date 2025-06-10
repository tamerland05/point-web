import { authQueryOptions } from "@point/shared/api/point/auth"
import { placeQueryOptions } from "@point/shared/api/point/places"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/menu/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    }

    await queryClient.ensureQueryData(placeQueryOptions(params.id))
  },
  pendingComponent: () => <div>Loading...</div>,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const placeQuery = useSuspenseQuery(placeQueryOptions(id))
  const menu = placeQuery.data?.menu

  return (
    <div className="m-4">
      <List title="menu">
        {menu?.map((menuItem, idx) => (
          <ListItem
            // biome-ignore lint/suspicious/noArrayIndexKey: this map will never change
            key={idx}
            leftIcon={<img src={menuItem.photo} alt={menuItem.title} className="h-14 w-14 rounded-xl" />}
            leftTopText={<span className="text-base text-text">{menuItem.title}</span>}
            leftBottomText={<span className="text-caption-1 text-text-secondary">{menuItem.description}</span>}
            rightTopText={
              <span className="whitespace-nowrap text-text-secondary">
                {menuItem.cost.value} {menuItem.cost.currency}
              </span>
            }
            withSeparator
          />
        ))}
      </List>
    </div>
  )
}
