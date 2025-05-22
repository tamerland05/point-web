import type { GetStonFiAssetResponse } from "@/api/stonFi/useAssetDetails"

export const NATIVE_TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"

export const TETHER_USDT_ADDRESS = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"

export const usdtAssetData: GetStonFiAssetResponse = {
	asset: {
		contract_address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
		symbol: "USD₮",
		display_name: "Tether USD",
		priority: 100,
		image_url:
			"https://asset.ston.fi/img/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs/3c568dd0c7f9b8874fe1aba3d318d38437615f06b01a46618bfe3c0eee5fe37f",
		decimals: 6,
		kind: "Jetton",
		deprecated: false,
		community: false,
		blacklisted: false,
		default_symbol: true,
		taxable: false,
		tags: [
			"high_liquidity",
			"asset:popular",
			"default_symbol",
			"asset:essential",
			"asset:default_symbol",
			"asset:liquidity:very_high",
		],
		third_party_usd_price: "1.0",
		third_party_price_usd: "1.0",
		dex_usd_price: "1.000000000000000",
		dex_price_usd: "1.000000000000000",
	},
}

export const tonAssetData: GetStonFiAssetResponse = {
	asset: {
		contract_address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
		symbol: "TON",
		display_name: "TON",
		priority: 96,
		image_url:
			"https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/ee9fb21d17bc8d75c2a5f7b5f5f62d2bacec6b128f58b63cb841e98f7b74c4fc",
		decimals: 9,
		kind: "Ton",
		deprecated: false,
		community: false,
		blacklisted: false,
		default_symbol: true,
		taxable: false,
		tags: ["asset:default_symbol", "default_symbol", "asset:essential"],
	},
}
