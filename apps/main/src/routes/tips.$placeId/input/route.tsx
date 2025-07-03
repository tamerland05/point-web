import { tipAssetsQueryOptions } from "@point/shared/api/point/tips"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useAssetBalance } from "@point/shared/hooks/useAssetBalance"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useTonAddress } from "@tonconnect/ui-react"
import Img from "react-cool-img"
import { z } from "zod"

const inputSchema = z.object({
  recipient: z.string(),
  asset: z.string(),
  amount: z.string().optional(),
  id: z.string().or(z.number()).optional(),
})

export const Route = createFileRoute("/tips/$placeId/input")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(tipAssetsQueryOptions)
  },

  validateSearch: zodValidator(inputSchema),
})

function RouteComponent() {
  const { formatFromNano } = useFormatter()

  const address = useTonAddress()
  const { asset: selectedAssetId } = Route.useSearch()

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const selectedAsset = assetsQuery.data.find((asset) => asset.id === selectedAssetId)

  if (!selectedAsset) {
    throw new Error("LogicError: Asset not found")
  }

  const assetQuery = useSuspenseQuery(assetDetailsQuery(selectedAsset.address))
  const asset = assetQuery.data?.asset

  const balance = useAssetBalance({
    walletAddress: address,
    assetAddress: selectedAsset?.address,
  })

  return (
    <div className="flex h-full flex-col justify-between">
      <header className="flex items-center gap-4">
        <div>
          <Icon name="Check" className="h-10 w-10 text-transparent" />
        </div>
        <div className="flex flex-col">
          <div className="font-medium">Recipient</div>
          <div className="font-normal text-caption-1 text-text-secondary">Send</div>
        </div>
      </header>

      <div className="w-full flex-1 [view-transition-name:post]">
        <Outlet />
      </div>

      <div className="mt-auto flex w-full items-center gap-4">
        <div>
          <Img className="h-10 w-10 rounded-full" src={asset.image_url} alt={asset.display_name} />
        </div>
        <div className="flex flex-col">
          <div className="font-medium">From Balance</div>
          <div className="font-normal text-caption-1 text-text-secondary">
            {formatFromNano(balance, asset.decimals)} {asset.symbol}
          </div>
        </div>
        {/* TODO: set amount as atom */}
        {/* <div className="ml-auto">
            <button type="button" className="rounded-full bg-[#D6E7FF] px-3 py-2 text-accent text-caption-1">
              Max
            </button>
          </div> */}
      </div>
    </div>
  )
}
