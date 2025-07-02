import { ShowMainButton } from "@/components/tg-internals"
import { userQueryOptions } from "@point/shared/api/point/user"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { NATIVE_TON_ADDRESS } from "@point/shared/constants/tokens"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"

export const Route = createFileRoute("/tips/$placeId/input/confirm")({
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ recipient: search.recipient }),
  loader: async ({ context, deps }) => {
    const { queryClient } = context
    await queryClient.ensureQueryData(userQueryOptions(deps.recipient))
  },
})

function RouteComponent() {
  const { recipient, amount } = Route.useSearch()
  const { formatCurrency } = useFormatter()

  const userQuery = useSuspenseQuery(userQueryOptions(recipient))
  const user = userQuery.data

  // TODO: real asset
  const assetsQuery = useSuspenseQuery(assetDetailsQuery(NATIVE_TON_ADDRESS))
  const asset = assetsQuery.data?.asset

  const amountInUsd = useMemo(() => {
    const assetPrice = asset.dex_price_usd || asset.third_party_price_usd

    if (!assetPrice) return null
    if (Number.isNaN(Number(amount))) return null
    if (Number.isNaN(Number(assetPrice))) return null

    return formatCurrency(Number(amount) * Number(assetPrice))
  }, [amount, asset.dex_price_usd, asset.third_party_price_usd, formatCurrency])

  const style = {
    fontSize: 46,
    fontWeight: 700,
    width: `${amount?.length}ch`,
  }

  const isEnoughBalance = true

  return (
    <ShowMainButton hidden={!isEnoughBalance || !amount || amount === "0"} title={"Continue"} onClick={() => {}}>
      <div className="mt-5 flex max-w-full items-end gap-1">
        <span className={cn("relative min-w-[1ch] font-sf-pro-rounded leading-[55px] outline-none")} style={style}>
          {amount}
        </span>
        <div
          className={cn("font-bold font-sf-pro-rounded text-[30px] text-text-secondary [letter-spacing:0.4px]", {
            "text-negative": !isEnoughBalance,
          })}
        >
          {asset.symbol}
        </div>
      </div>

      {amountInUsd && (
        <div className="mb-8 overflow-hidden text-ellipsis whitespace-nowrap text-caption-1 text-text-secondary">
          ≈ $ {amountInUsd}
        </div>
      )}

      <List title="payment details">
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Establishment</span>}
          leftBottomText={<span className="text-accent text-base">{user.employee?.jobPlace?.name}</span>}
          withSeparator
        />
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Recipient status</span>}
          leftBottomText={<span className="text-accent text-base">{user.rank}</span>}
          withSeparator
        />
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Recipient Address</span>}
          leftBottomText={<span className="text-base text-text">{user.employee?.jobPlace?.address || "N/A"}</span>}
        />
      </List>
    </ShowMainButton>
  )
}
