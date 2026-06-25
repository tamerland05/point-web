import type { MenuItem } from "@point/shared/types/index"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import Image from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/menu/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
    }

    await queryClient.ensureQueryData(establishmentQueryOptions(params.id))
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { id } = Route.useParams()
  const { formatCurrency } = useFormatter()

  const establishmentQuery = useSuspenseQuery(establishmentQueryOptions(id))
  const menu = establishmentQuery.data?.menu

  const categoriesArray = useMemo(() => {
    const categories = new Set<string>()

    for (const menuItem of menu ?? []) {
      categories.add(menuItem.category)
    }

    return Array.from(categories)
  }, [menu])

  const menuByCategory = useMemo(() => {
    const categoriesMap = new Map<string, MenuItem[]>()

    for (const menuItem of menu ?? []) {
      const category = menuItem.category
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, [])
      }

      categoriesMap.get(category)?.push(menuItem)
    }

    return categoriesMap
  }, [menu])

  return (
    <div className="m-4 [view-transition-name:main-content]">
      {categoriesArray.map((category) => (
        <List className="mb-8" key={category} title={category}>
          {menuByCategory.get(category)?.map((menuItem) => (
            <ListItem
              className="py-4"
              key={menuItem.id}
              leftBottomText={
                <span className="line-clamp-2 text-caption-1 text-text-secondary">{menuItem.description}</span>
              }
              leftIcon={
                menuItem.photo && (
                  <Image
                    alt={menuItem.title}
                    className="size-14 rounded-xl object-cover"
                    error="/img-ph.svg"
                    placeholder="/img-ph.svg"
                    src={menuItem.photo}
                  />
                )
              }
              leftTopText={<span className="line-clamp-1 text-base text-text">{menuItem.title}</span>}
              onClick={() => {
                navigate({
                  params: { id, menuItemId: menuItem.id },
                  to: "/menu/$id/$menuItemId",
                })
              }}
              rightTopText={
                <span className="whitespace-nowrap text-text-secondary">
                  {formatCurrency(menuItem.cost.amount)}
                  {menuItem.cost.currency}
                </span>
              }
              withSeparator
            />
          ))}
        </List>
      ))}
    </div>
  )
}
