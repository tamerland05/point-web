import { TipAsset } from "@/components/tip-asset"
import { tipAssetsQueryOptions } from "@point/shared/api/point/tips"
import { List } from "@point/ui/list"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useCallback } from "react"
import z from "zod"

export const Route = createFileRoute("/tips/$placeId/assets")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      recipient: z.string(),
      id: z.string().or(z.number()).optional(),
    })
  ),
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(tipAssetsQueryOptions)
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { recipient, id } = Route.useSearch()

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const assets = assetsQuery.data

  const handleAssetClick = useCallback(
    (asset: string) => {
      navigate({ to: "/tips/$placeId/input/amount", search: { id, recipient, asset } })
    },
    [navigate, recipient, id]
  )

  return (
    <List className="" title="select asset">
      {assets.map((asset) => (
        <TipAsset key={asset.id} asset={asset} onClick={() => handleAssetClick(asset.id)} />
      ))}
    </List>
  )
}
