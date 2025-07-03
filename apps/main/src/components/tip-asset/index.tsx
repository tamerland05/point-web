import type { AssetDTO } from "@point/shared/api/point/tips"
import { assetDetailsQuery } from "@point/shared/api/stonFi/asset"
import { useAssetBalance } from "@point/shared/hooks/useAssetBalance"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import Img from "react-cool-img"

export const TipAsset = ({ asset, onClick }: { asset: AssetDTO; onClick: () => void }) => {
  const address = useTonAddress()
  const { formatFromNano } = useFormatter()

  const assetQuery = useSuspenseQuery(assetDetailsQuery(asset.address))
  const assetDetails = assetQuery.data

  const balanceInNano = useAssetBalance({
    walletAddress: address,
    assetAddress: asset.address,
  })

  return (
    <ListItem
      key={asset.id}
      leftIcon={
        <Img placeholder="/img-ph.svg" error="/img-ph.svg" src={asset.imageUrl} className="h-10 w-10 rounded-full" />
      }
      leftTopText={asset.name}
      leftBottomText={
        <div className="font-normal capitalize">{`${formatFromNano(balanceInNano, assetDetails.asset.decimals)} ${asset.symbol}`}</div>
      }
      withSeparator
      onClick={onClick}
    />
  )
}
