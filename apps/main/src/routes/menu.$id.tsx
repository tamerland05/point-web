import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import Image from "react-cool-img"

import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/menu/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
    }

    await queryClient.ensureQueryData(establishmentQueryOptions(params.id))
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ErrorPage,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(id))
  const menu = establishmentQuery.data?.menu

  return (
    <div className="m-4 [view-transition-name:main-content]">
      <List title="menu">
        {menu?.map((menuItem, idx) => (
          <ListItem
            // biome-ignore lint/suspicious/noArrayIndexKey: this map will never change
            key={idx}
            leftIcon={
              menuItem.photo && (
                <Image src={menuItem.photo} alt={menuItem.title} className="h-14 w-14 rounded-xl object-cover" />
              )
            }
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
