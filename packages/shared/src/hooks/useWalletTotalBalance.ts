import { useMemo } from "react"

import { useAssetsList } from "@/api/deDust/useAssetsList"
import { useMultiAssetDetails } from "@/api/stonFi/useAssetDetails"
import { NATIVE_TON_ADDRESS } from "@/constants/tokens"
import { formatFromNano } from "@/utils/format"

export const useWalletTotalBalance = (walletAddress: string | undefined) => {
  const { data: assetsData } = useAssetsList(walletAddress)
  const assetsAddresses =
    assetsData?.map((asset) => (asset.asset.type === "jetton" ? asset.asset.address : NATIVE_TON_ADDRESS)) || []
  const queryResults = useMultiAssetDetails(assetsAddresses)

  const assetAmountsInDollars = useMemo(
    () =>
      queryResults.map((assetQuery, index) => {
        const isAssetCanBeShown = assetQuery.isPlaceholderData || assetQuery.isSuccess

        if (isAssetCanBeShown && assetQuery.data) {
          const assetPrice = assetQuery.data.asset.dex_price_usd || assetQuery.data.asset.third_party_price_usd || 0
          const assetBalanceInNano = assetsData?.[index]?.balance
          const balanceInUnits = formatFromNano(assetBalanceInNano, assetQuery.data.asset.decimals)
          const amountInDollars = Number(balanceInUnits) * Number(assetPrice)
          return amountInDollars
        }
        return 0
      }),
    [assetsData, queryResults]
  )

  const totalBalance = assetAmountsInDollars?.reduce((sum, amount) => sum + amount, 0)

  const isLoading = !assetsData

  return { isLoading, totalBalance }
}
