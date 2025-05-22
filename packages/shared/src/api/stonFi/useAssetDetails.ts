import { useQueries, useQuery } from "@tanstack/react-query"
import { Address } from "@ton/core"

import stonFiAxiosInstance from "@/api/stonFi"
import { NATIVE_TON_ADDRESS, TETHER_USDT_ADDRESS, tonAssetData, usdtAssetData } from "@/constants/tokens"
import { isValidAddress } from "@/utils/isValidAddress"

export const AssetKinds = {
	Ton: "ton",
	Wton: "wton",
	Jetton: "jetton",
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

const fetchAssetDetails = async (assetAddress: string) => {
	const response = await stonFiAxiosInstance.get<GetStonFiAssetResponse>(`/assets/${assetAddress}`)
	return response.data
}

const ASSET_MOCKS: Record<string, GetStonFiAssetResponse> = {
	[NATIVE_TON_ADDRESS]: tonAssetData,

	[TETHER_USDT_ADDRESS]: usdtAssetData,
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

export const useAssetDetails = (assetAddress: string) =>
	useQuery({
		queryKey: ["assetDetails", assetAddress],
		queryFn: () => getAssetDetailsWithFallback(assetAddress),
		enabled: !!assetAddress,
		staleTime: 120000,
		gcTime: 300000,
		retry: 1,
		placeholderData: ASSET_MOCKS[assetAddress],
	})

// try error, try suspensequeries
export const useMultiAssetDetails = (assetsAddresses: string[]) =>
	useQueries({
		queries: assetsAddresses.map((address) => ({
			queryKey: ["assetDetails", address],
			queryFn: () => getAssetDetailsWithFallback(address),
			staleTime: Number.POSITIVE_INFINITY,
			placeholderData: ASSET_MOCKS[address],
		})),
	})

export const useCombinedMultiAssetDetails = (assetsAddresses: string[]) =>
	useQueries({
		queries: assetsAddresses.map((address) => ({
			queryKey: ["assetDetails", address],
			queryFn: () => getAssetDetailsWithFallback(address),
			staleTime: Number.POSITIVE_INFINITY,
			placeholderData: ASSET_MOCKS[address],
		})),
		combine: (results) => ({
			data: results.map((result) => result.data),
			isLoading: results.some((result) => result.isLoading),
		}),
	})
