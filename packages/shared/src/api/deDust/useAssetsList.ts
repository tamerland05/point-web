import { useQuery } from "@tanstack/react-query"

import dedustAxiosInstance from "@/api/deDust"

export interface DeDustAsset {
  address: string // jetton wallet address
  asset: {
    type: "jetton" | "native"
    address: string // jetton master address
  }
  balance: string // in nano
  mintless?: object
}

// TODO: invalidate on stakes, swaps, sends, receives
export const useAssetsList = (walletAddress: string | undefined) =>
  useQuery<DeDustAsset[]>({
    enabled: !!walletAddress,
    gcTime: 300000,
    queryFn: async () => {
      const response = await dedustAxiosInstance.get<DeDustAsset[]>(`/accounts/${walletAddress}/assets`)

      return response.data
    },
    queryKey: ["assetsList", walletAddress],
    refetchInterval: 10000,
    select: (data) => data.filter((asset) => !asset.mintless),
    staleTime: 60000,
  })
