import { ErrorPage } from "@/components/app-internals/ErrorPage"
import { tipAssetsQueryOptions } from "@point/shared/api/point/tips"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useCallback } from "react"
import Img from "react-cool-img"
import z from "zod"

export const Route = createFileRoute("/tips/$placeId/assets")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      recipient: z.string(),
    })
  ),
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(tipAssetsQueryOptions)
  },
  pendingComponent: () => <div>Loading assets...</div>,
  errorComponent: ErrorPage,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { recipient } = Route.useSearch()

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const assets = assetsQuery.data

  const handleAssetClick = useCallback(
    (asset: string) => {
      navigate({ to: "/tips/$placeId/input/amount", search: { recipient, asset } })
    },
    [navigate, recipient]
  )

  return (
    <List className="" title="select asset">
      {assets.map((asset) => (
        <ListItem
          key={asset.id}
          leftIcon={<Img src={asset.icon} className="h-10 w-10 rounded-full" />}
          leftTopText={asset.name}
          leftBottomText={<div className="font-normal capitalize">{`322 ${asset.ticker}`}</div>}
          withSeparator
          onClick={() => handleAssetClick(asset.id)}
        />
      ))}
    </List>
  )
}
