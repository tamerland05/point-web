import { useQuery } from "@tanstack/react-query";

import dedustAxiosInstance from "@/api/deDust";

export interface DeDustAsset {
  address: string; // jetton wallet address
  asset: {
    type: "jetton" | "native";
    address: string; // jetton master address
  };
  balance: string; // in nano
  mintless?: object;
}

// TODO: invalidate on stakes, swaps, sends, receives
export const useAssetsList = (walletAddress: string | undefined) =>
  useQuery<DeDustAsset[]>({
    queryKey: ["assetsList", walletAddress],
    queryFn: async () => {
      const response = await dedustAxiosInstance.get<DeDustAsset[]>(`/accounts/${walletAddress}/assets`);

      return response.data;
    },
    enabled: !!walletAddress,
    staleTime: 60000,
    gcTime: 300000,
    select: (data) => data.filter((asset) => !asset.mintless),
    refetchInterval: 10000,
  });
