import { authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import type { MenuItem } from "@point/shared/types/index"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import Image from "react-cool-img"

export const Route = createFileRoute("/menu/$id")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { queryClient } = context

    if (context?.launchParams?.tgWebAppData) {
      await queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
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

  const menyByCategory = useMemo(() => {
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
        <List key={category} title={category} className="mb-8">
          {menyByCategory.get(category)?.map((menuItem) => (
            <ListItem
              key={menuItem.id}
              leftIcon={
                menuItem.photo && (
                  <Image
                    placeholder="/img-ph.svg"
                    error="/img-ph.svg"
                    src={menuItem.photo}
                    alt={menuItem.title}
                    className="size-14 rounded-xl object-cover"
                  />
                )
              }
              leftTopText={<span className="line-clamp-1 text-base text-tex">{menuItem.title}</span>}
              leftBottomText={
                <span className="line-clamp-2 text-caption-1 text-text-secondary">{menuItem.description}</span>
              }
              rightTopText={
                <span className="whitespace-nowrap text-text-secondary">
                  {formatCurrency(menuItem.cost.amount)}
                  {menuItem.cost.currency}
                </span>
              }
              onClick={() => {
                navigate({
                  to: "/menu/$id/$menuItemId",
                  params: { id, menuItemId: menuItem.id },
                })
              }}
              withSeparator
            />
          ))}
        </List>
      ))}
    </div>
  )
}
