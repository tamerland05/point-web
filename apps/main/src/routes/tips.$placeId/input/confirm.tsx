import { ShowMainButton } from "@/components/tg-internals"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { tipAssetsQueryOptions, tipCheckoutQueryOptions } from "@point/shared/api/point/tips"
import { userQueryOptions } from "@point/shared/api/point/user"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonConnectUI } from "@tonconnect/ui-react"
import { useCallback, useMemo } from "react"
import toast from "react-hot-toast"

export const Route = createFileRoute("/tips/$placeId/input/confirm")({
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    if (deps.id) {
      await queryClient.ensureQueryData(userQueryOptions(deps.id))
    }
  },
  pendingComponent: () => null,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { asset: selectedAssetId } = Route.useSearch()
  const { placeId } = Route.useParams()
  const [tc] = useTonConnectUI()
  const { recipient, amount, id } = Route.useSearch()
  const { formatCurrency } = useFormatter()

  const userQuery = useQuery(userQueryOptions(id))
  const user = userQuery.data

  const establishmentQuery = useQuery(establishmentQueryOptions(placeId))
  const establishment = establishmentQuery.data

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const selectedAsset = assetsQuery.data.find((asset) => asset.id === selectedAssetId)

  if (!selectedAsset) {
    throw new Error("LogicError: Asset not found")
  }

  const assetQuery = useSuspenseQuery(assetDetailsQuery(selectedAsset.address))
  const asset = assetQuery.data?.asset

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

  const tipCheckoutQuery = useQuery(
    tipCheckoutQueryOptions({
      recipientId: id ? recipient : placeId,
      recipientType: id ? "employee" : "establishment",
      assetId: selectedAsset.id,
      amount: Number(amount),
    })
  )
  const tipCheckoutTxs = tipCheckoutQuery.data
  const tipCheckoutTxsIsLoading = tipCheckoutQuery.isLoading

  const handleContinueClick = useCallback(async () => {
    if (!tipCheckoutTxs || tipCheckoutTxs.length === 0) {
      toast.error("Transaction isnt ready")
      return
    }

    try {
      await tc.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: tipCheckoutTxs.map((tx) => ({
          address: tx.to,
          amount: tx.value.toString(),
          payload: tx.body,
        })),
      })
    } catch (_error) {
      navigate({ to: "/tips/$placeId/error" })
      return
    }

    toast.success("Transaction sent")
    navigate({ to: "/tips/$placeId/success" })
  }, [navigate, tipCheckoutTxs, tc])

  return (
    <ShowMainButton
      hidden={!isEnoughBalance || !amount || amount === "0"}
      title={"Continue"}
      loading={tipCheckoutTxsIsLoading}
      disabled={tipCheckoutTxsIsLoading}
      onClick={handleContinueClick}
    >
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
          leftBottomText={
            <span className="text-base text-text">{user ? user.employee?.jobPlace?.name : establishment?.name}</span>
          }
          withSeparator
        />
        {user && (
          <ListItem
            leftTopText={<span className="text-caption-1 text-text-secondary">Recipient status</span>}
            leftBottomText={<span className="text-base text-text capitalize">{user.employee?.profession}</span>}
            withSeparator
          />
        )}
        <ListItem
          leftTopText={<span className="text-caption-1 text-text-secondary">Recipient Address</span>}
          leftBottomText={
            <span className="text-base text-text">
              {user ? user.employee?.jobPlace?.address : establishment?.position.address}
            </span>
          }
        />
      </List>
    </ShowMainButton>
  )
}
