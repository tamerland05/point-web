import { ShowMainButton } from "@/components/tg-internals/ShowMainButton"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { NATIVE_TON_ADDRESS } from "@point/shared/constants/tokens"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"

export const Route = createFileRoute("/tips/$placeId/input/amount")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.ensureQueryData(assetDetailsQuery(NATIVE_TON_ADDRESS))
  },

  pendingComponent: () => <div>Loading...</div>,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { placeId } = Route.useParams()
  const { recipient, asset: assetId, amount } = Route.useSearch()
  const { formatCurrency } = useFormatter()

  // TODO: real asset
  const assetsQuery = useSuspenseQuery(assetDetailsQuery(NATIVE_TON_ADDRESS))
  const asset = assetsQuery.data?.asset

  const [value, setValue] = useState(amount || "")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value

    newValue = newValue.replace(",", ".")

    newValue = newValue.replace(/^0+(?=\d)/, "")

    if (newValue === "") {
      newValue = "0"
    }

    const regex = new RegExp(`^(\\d*\\.?\\d{0,${asset.decimals}})$`)

    if (regex.test(newValue) || newValue === "") {
      setValue(newValue)
    }
  }

  const handleReverseMode = () => {
    toast("TODO: reverse mode")
  }

  const amountInUsd = useMemo(() => {
    const assetPrice = asset.dex_price_usd || asset.third_party_price_usd

    if (!assetPrice) return null
    if (Number.isNaN(Number(value))) return null
    if (Number.isNaN(Number(assetPrice))) return null

    return formatCurrency(Number(value) * Number(assetPrice))
  }, [value, asset.dex_price_usd, asset.third_party_price_usd, formatCurrency])

  const style = {
    fontSize: 46,
    fontWeight: 700,
    width: `${value.length}ch`,
  }

  const readOnly = false
  const isEnoughBalance = true

  if (readOnly) {
    return <span className={cn("min-w-[1ch]")}>{value || "0"}</span>
  }

  return (
    <ShowMainButton
      hidden={!isEnoughBalance || !value || value === "0"}
      title={"Continue"}
      onClick={async () => {
        await navigate({
          to: "/tips/$placeId/input/amount",
          params: { placeId },
          search: { recipient, asset: assetId, amount: value },
          replace: true,
        })

        navigate({
          to: "/tips/$placeId/input/confirm",
          params: { placeId },
          search: { recipient, asset: assetId, amount: value },
        })
      }}
    >
      <div className="mt-5 flex max-w-full items-end justify-between gap-1">
        <input
          autoComplete="off"
          autoCorrect="off"
          className={cn("relative min-w-[1ch] font-sf-pro-rounded leading-none outline-none")}
          inputMode="decimal"
          placeholder={"0"}
          spellCheck="false"
          type="text"
          value={value}
          onChange={handleInputChange}
          style={style}
        />
        <div
          className={cn(
            "mr-8 flex-shrink-0 font-bold font-sf-pro-rounded text-[30px] text-text-secondary [letter-spacing:0.4px]",
            {
              "text-negative": !isEnoughBalance,
            }
          )}
        >
          {asset.symbol}
        </div>

        <button
          className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D6E7FF]"
          type="button"
          onClick={handleReverseMode}
        >
          <Icon name="Arrowz" className="h-8 w-8 text-transparent" />
        </button>
      </div>

      {amountInUsd && isEnoughBalance && (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-caption-1 text-text-secondary">
          ≈ $ {amountInUsd}
        </div>
      )}

      {!isEnoughBalance && <div className="text-caption-1 text-negative">Not enough balance</div>}
    </ShowMainButton>
  )
}
