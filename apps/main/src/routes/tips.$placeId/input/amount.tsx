import { ShowMainButton } from "@/components/tg-internals/ShowMainButton"
import { tipAssetsQueryOptions } from "@point/shared/api/point/tips"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useAssetBalance } from "@point/shared/hooks/useAssetBalance"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonAddress } from "@tonconnect/ui-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"

export const Route = createFileRoute("/tips/$placeId/input/amount")({
  component: RouteComponent,
})

function RouteComponent() {
  const address = useTonAddress()
  const { formatCurrency, formatFromNano } = useFormatter()

  const navigate = Route.useNavigate()
  const { placeId } = Route.useParams()
  const { recipient, asset: assetId, amount, id } = Route.useSearch()

  const { asset: selectedAssetId } = Route.useSearch()

  const assetsQuery = useSuspenseQuery(tipAssetsQueryOptions)
  const selectedAsset = assetsQuery.data.find((asset) => asset.id === selectedAssetId)

  if (!selectedAsset) {
    throw new Error("LogicError: Asset not found")
  }

  const assetQuery = useSuspenseQuery(assetDetailsQuery(selectedAsset.address))
  const asset = assetQuery.data?.asset

  const balanceInNano = useAssetBalance({
    walletAddress: address,
    assetAddress: selectedAsset?.address,
  })

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
    // TODO:
    toast("Coming soon")
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

  const balance = useMemo(
    () => Number(formatFromNano(balanceInNano, asset.decimals)),
    [balanceInNano, asset.decimals, formatFromNano]
  )

  const isEnoughBalance = useMemo(() => balance >= Number(value), [balance, value])

  const handleContinue = async () => {
    await navigate({
      to: "/tips/$placeId/input/amount",
      params: { placeId },
      search: { recipient, asset: assetId, amount: value, id },
      replace: true,
    })

    navigate({
      to: "/tips/$placeId/input/confirm",
      params: { placeId },
      search: { recipient, asset: assetId, amount: value, id },
    })
  }

  if (readOnly) {
    return <span className={cn("min-w-[1ch]")}>{value || "0"}</span>
  }

  return (
    <ShowMainButton hidden={!isEnoughBalance || !value || value === "0"} title={"Continue"} onClick={handleContinue}>
      <div className="mt-5 flex max-w-full items-end justify-between gap-1">
        <input
          autoComplete="off"
          autoCorrect="off"
          className={cn("relative min-w-[1ch] font-sf-pro-rounded leading-none outline-none", {
            "text-red-400 placeholder:text-red-400": !isEnoughBalance,
          })}
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
              "text-red-400": !isEnoughBalance,
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

      {!isEnoughBalance && <div className="text-caption-1 text-red-400">Not enough balance</div>}
    </ShowMainButton>
  )
}
