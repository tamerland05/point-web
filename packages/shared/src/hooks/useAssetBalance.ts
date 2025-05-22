import { useMemo } from "react";

import { useAssetsList } from "@/api/deDust/useAssetsList";
import { NATIVE_TON_ADDRESS } from "@/constants/tokens";

export const useAssetBalance = ({
  walletAddress,
  assetAddress,
}: {
  walletAddress: string | undefined;
  assetAddress: string | undefined;
}) => {
  const { data: assetsData } = useAssetsList(walletAddress);

  const assetBalancesMap = useMemo(
    () =>
      assetsData?.reduce(
        (acc, asset) => {
          if (asset.asset.type === "native") {
            acc[NATIVE_TON_ADDRESS] = asset.balance;
            return acc;
          }
          acc[asset.asset.address] = asset.balance;
          return acc;
        },
        {} as Record<string, string>,
      ) || {},
    [assetsData],
  );

  return assetBalancesMap[assetAddress || NATIVE_TON_ADDRESS];
};
