import { Address } from "@ton/core"
import { useMemo } from "react"

import { type DeDustAsset, useAssetsList } from "@/api/deDust/useAssetsList"
import { NATIVE_TON_ADDRESS } from "@/constants/tokens"

export const useAssetBalance = ({
  walletAddress,
  assetAddress,
}: {
  walletAddress: string | undefined
  assetAddress: string | undefined
}) => {
  const { data: assetsData } = useAssetsList(walletAddress)

  const assetBalancesMap = useMemo(
    () =>
      assetsData?.reduce(
        (acc: Record<string, string>, asset: DeDustAsset) => {
          if (asset.asset.type === "native") {
            acc[NATIVE_TON_ADDRESS] = asset.balance
            return acc
          }
          acc[asset.asset.address] = asset.balance
          return acc
        },
        {} as Record<string, string>
      ) || {},
    [assetsData]
  )

  const formattedAssetAddress = Address.parse(assetAddress || NATIVE_TON_ADDRESS).toString({
    bounceable: true,
    testOnly: false,
    urlSafe: true,
  })

  return assetBalancesMap[formattedAssetAddress] || 0
}
