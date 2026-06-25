import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useCallback } from "react"
import z from "zod"

import { useTranslation } from "@point/i18n"
import { type AssetDTO, tipAssetsQueryOptions } from "@point/shared/api/point/tips"
import { List } from "@point/ui/list"

import { TipAsset } from "@/components/tip-asset"

export const Route = createFileRoute("/tips/$placeId/assets")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(tipAssetsQueryOptions)
  },
  validateSearch: zodValidator(
    z.object({
      id: z.string().or(z.number()).optional(),
      recipient: z.string(),
    })
  ),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { recipient, id } = Route.useSearch()
  const { t } = useTranslation()

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const assets = assetsQuery.data

  const handleAssetClick = useCallback(
    (asset: string) => {
      navigate({ search: { asset, id, recipient }, to: "/tips/$placeId/input/amount" })
    },
    [navigate, recipient, id]
  )

  return (
    <List className="" title={t("TIPS.ASSETS.TITLE")}>
      {assets.map((asset: AssetDTO) => (
        <TipAsset asset={asset} key={asset.id} onClick={() => handleAssetClick(asset.id)} />
      ))}
    </List>
  )
}
