import { Address } from "@ton/core"

import { NATIVE_TON_ADDRESS, TETHER_USDT_ADDRESS, tonAssetData, usdtAssetData } from "@/constants/tokens"
import { isValidAddress } from "@/utils/isValidAddress"

import stonFiAxiosInstance from "."

export const AssetKinds = {
  Jetton: "jetton",
  Ton: "ton",
  Wton: "wton",
} as const

export type AssetKind = keyof typeof AssetKinds

export interface StonFiAsset {
  balance?: string
  blacklisted: boolean
  community: boolean
  contract_address: string
  decimals: number
  default_symbol: boolean
  deprecated: boolean
  dex_price_usd?: string
  dex_usd_price?: string
  display_name: string
  image_url: string
  kind: AssetKind
  priority: number
  symbol: string
  tags: string[]
  taxable: boolean
  third_party_price_usd?: string
  third_party_usd_price?: string
  wallet_address?: string
}

export interface GetStonFiAssetResponse {
  asset: StonFiAsset
}

const ASSET_MOCKS: Record<string, GetStonFiAssetResponse> = {
  [NATIVE_TON_ADDRESS]: tonAssetData,

  [TETHER_USDT_ADDRESS]: usdtAssetData,
}

const fetchAssetDetails = async (assetAddress: string) => {
  const response = await stonFiAxiosInstance.get<GetStonFiAssetResponse>(`/assets/${assetAddress}`)
  return response.data
}

const getAssetDetailsWithFallback = async (assetAddress: string) => {
  try {
    return await fetchAssetDetails(assetAddress)
  } catch (error) {
    if (!isValidAddress(assetAddress)) throw error

    const formattedAssetAddress = Address.parse(assetAddress).toString({
      bounceable: true,
      testOnly: false,
      urlSafe: true,
    })

    // If we have mock data and there's an error, return mock data instead of throwing
    if (ASSET_MOCKS[formattedAssetAddress]) {
      return ASSET_MOCKS[formattedAssetAddress]
    }
    // If no mock data available, throw the original error
    throw error
  }
}

export const assetDetailsQuery = (assetAddress: string) => ({
  enabled: !!assetAddress,
  gcTime: 300000,
  placeholderData: ASSET_MOCKS[assetAddress],
  queryFn: () => getAssetDetailsWithFallback(assetAddress),
  queryKey: ["assetDetails", assetAddress],
  retry: 1,
  staleTime: 120000,
})
