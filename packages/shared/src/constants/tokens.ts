import type { GetStonFiAssetResponse } from "@/api/stonFi/useAssetDetails"

export const NATIVE_TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"

export const TETHER_USDT_ADDRESS = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"

export const usdtAssetData: GetStonFiAssetResponse = {
  asset: {
    blacklisted: false,
    community: false,
    contract_address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
    decimals: 6,
    default_symbol: true,
    deprecated: false,
    dex_price_usd: "1.000000000000000",
    dex_usd_price: "1.000000000000000",
    display_name: "Tether USD",
    image_url:
      "https://asset.ston.fi/img/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs/3c568dd0c7f9b8874fe1aba3d318d38437615f06b01a46618bfe3c0eee5fe37f",
    kind: "Jetton",
    priority: 100,
    symbol: "USD₮",
    tags: [
      "high_liquidity",
      "asset:popular",
      "default_symbol",
      "asset:essential",
      "asset:default_symbol",
      "asset:liquidity:very_high",
    ],
    taxable: false,
    third_party_price_usd: "1.0",
    third_party_usd_price: "1.0",
  },
}

export const tonAssetData: GetStonFiAssetResponse = {
  asset: {
    blacklisted: false,
    community: false,
    contract_address: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
    decimals: 9,
    default_symbol: true,
    deprecated: false,
    display_name: "TON",
    image_url:
      "https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/ee9fb21d17bc8d75c2a5f7b5f5f62d2bacec6b128f58b63cb841e98f7b74c4fc",
    kind: "Ton",
    priority: 96,
    symbol: "TON",
    tags: ["asset:default_symbol", "default_symbol", "asset:essential"],
    taxable: false,
  },
}
