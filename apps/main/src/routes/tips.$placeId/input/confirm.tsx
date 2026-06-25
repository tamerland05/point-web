import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonConnectUI } from "@tonconnect/ui-react"
import { useCallback, useMemo } from "react"
import toast from "react-hot-toast"

import { useTranslation } from "@point/i18n"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import {
  type AssetDTO,
  type CheckoutDTO,
  tipAssetsQueryOptions,
  tipCheckoutQueryOptions,
} from "@point/shared/api/point/tips"
import { userQueryOptions } from "@point/shared/api/point/user"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/tips/$placeId/input/confirm")({
  component: RouteComponent,
  loader: async ({ context, deps }) => {
    const { queryClient } = context

    const { id } = deps as { id?: string | number }
    if (id) {
      await queryClient.ensureQueryData(userQueryOptions(id))
    }
  },
  loaderDeps: ({ search }) => ({ id: search.id }),
  pendingComponent: () => null,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { asset: selectedAssetId } = Route.useSearch()
  const { placeId } = Route.useParams()
  const [tc] = useTonConnectUI()
  const { recipient, amount, id } = Route.useSearch()
  const { formatCurrency } = useFormatter()
  const { t } = useTranslation()

  const userQuery = useQuery(userQueryOptions(id))
  const user = userQuery.data

  const establishmentQuery = useQuery(establishmentQueryOptions(placeId))
  const establishment = establishmentQuery.data

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const selectedAsset = assetsQuery.data.find((asset: AssetDTO) => asset.id === selectedAssetId)

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
      amount: Number(amount),
      assetId: selectedAsset.id,
      recipientId: id ? recipient : placeId,
      recipientType: id ? "employee" : "establishment",
    })
  )
  const tipCheckoutTxs = tipCheckoutQuery.data
  const tipCheckoutTxsIsLoading = tipCheckoutQuery.isLoading

  const handleContinueClick = useCallback(async () => {
    if (!tipCheckoutTxs || tipCheckoutTxs.length === 0) {
      toast.error(t("TIPS.CONFIRM.TRANSACTION_PENDING"))
      return
    }

    try {
      await tc.sendTransaction({
        messages: tipCheckoutTxs.map((tx: CheckoutDTO) => ({
          address: tx.to,
          amount: tx.value.toString(),
          payload: tx.body,
        })),
        validUntil: Math.floor(Date.now() / 1000) + 300,
      })
    } catch (_error) {
      navigate({ to: "/tips/$placeId/error" })
      return
    }

    toast(t("TIPS.CONFIRM.TRANSACTION_SENT"))
    navigate({ to: "/tips/$placeId/success" })
  }, [navigate, tipCheckoutTxs, tc])

  return (
    <ShowMainButton
      disabled={tipCheckoutTxsIsLoading}
      hidden={!isEnoughBalance || !amount || amount === "0"}
      loading={tipCheckoutTxsIsLoading}
      onClick={handleContinueClick}
      title={t("UI.CONTINUE")}
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

      <List title={t("TIPS.CONFIRM.CHECKOUT_DETAILS")}>
        <ListItem
          leftBottomText={
            <span className="text-base text-text">{user ? user.employee?.jobPlace?.name : establishment?.name}</span>
          }
          leftTopText={<span className="text-caption-1 text-text-secondary">{t("TIPS.CONFIRM.RESTAURANT")}</span>}
          withSeparator
        />
        {user && (
          <ListItem
            leftBottomText={<span className="text-base text-text capitalize">{user.employee?.profession}</span>}
            leftTopText={
              <span className="text-caption-1 text-text-secondary">{t("TIPS.CONFIRM.RECIPIENT_STATUS")}</span>
            }
            withSeparator
          />
        )}
        <ListItem
          leftBottomText={
            <span className="text-base text-text">
              {user ? user.employee?.jobPlace?.address : establishment?.position.address}
            </span>
          }
          leftTopText={
            <span className="text-caption-1 text-text-secondary">{t("TIPS.CONFIRM.RECIPIENT_ADDRESS")}</span>
          }
        />
      </List>
    </ShowMainButton>
  )
}
