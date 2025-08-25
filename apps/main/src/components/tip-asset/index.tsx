import type { AssetDTO } from "@point/shared/api/point/tips"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import Img from "react-cool-img"

import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useAssetBalance } from "@point/shared/hooks/useAssetBalance"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { ListItem } from "@point/ui/list-item"

export const TipAsset = ({ asset, onClick }: { asset: AssetDTO; onClick: () => void }) => {
  const address = useTonAddress()
  const { formatFromNano } = useFormatter()

  const assetQuery = useSuspenseQuery(assetDetailsQuery(asset.address))
  const assetDetails = assetQuery.data

  const balanceInNano = useAssetBalance({
    assetAddress: asset.address,
    walletAddress: address,
  })

  return (
    <ListItem
      key={asset.id}
      leftBottomText={
        <div className="font-normal capitalize">{`${formatFromNano(balanceInNano, assetDetails.asset.decimals)} ${asset.symbol}`}</div>
      }
      leftIcon={
        <Img className="h-10 w-10 rounded-full" error="/img-ph.svg" placeholder="/img-ph.svg" src={asset.imageUrl} />
      }
      leftTopText={asset.name}
      onClick={onClick}
      withSeparator
    />
  )
}
