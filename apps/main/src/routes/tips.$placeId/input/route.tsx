import { ShowMainButton } from "@/components/tg-internals"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { NATIVE_TON_ADDRESS } from "@point/shared/constants/tokens"
import { Icon } from "@point/ui/icon"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Outlet, createFileRoute } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import Img from "react-cool-img"
import { z } from "zod"

const inputSchema = z.object({
  recipient: z.string(),
  asset: z.string(),
  amount: z.string().optional(),
})

export const Route = createFileRoute("/tips/$placeId/input")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(assetDetailsQuery(NATIVE_TON_ADDRESS))
  },
  pendingComponent: () => <div>Loading...</div>,
  validateSearch: zodValidator(inputSchema),
})

function RouteComponent() {
  const assetQuery = useSuspenseQuery(assetDetailsQuery(NATIVE_TON_ADDRESS))
  const asset = assetQuery.data?.asset

  return (
    <ShowMainButton>
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
            <div className="font-normal text-caption-1 text-text-secondary">41.12 {asset.symbol}</div>
          </div>
          <div className="ml-auto">
            <button type="button" className="rounded-full bg-[#D6E7FF] px-3 py-2 text-accent text-caption-1">
              Max
            </button>
          </div>
        </div>
      </div>
    </ShowMainButton>
  )
}
