import { placeAssets } from "./placeAssets"

interface PlaceRatingValueProps {
  rating?: number | null
  ratingCount?: number | null
}

export function PlaceRatingValue({ rating, ratingCount }: PlaceRatingValueProps) {
  const votes = ratingCount ?? 0
  const value = Number(rating ?? 0)
  const hasRating = value > 0

  if (!hasRating) {
    return <span className="text-[#8d969d] text-[17px]">—</span>
  }

  const formattedRating = value.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })

  return (
    <span className="flex items-center gap-1 text-[#8d969d] text-[17px]">
      <span>{formattedRating}</span>
      <img alt="" className="h-3.5 w-3.5 shrink-0" src={placeAssets.ratingStar} />
      {votes > 0 ? <span>({votes.toLocaleString("ru-RU")})</span> : null}
    </span>
  )
}
