import { cn } from "@point/ui/cn"

import { selectionsAssets } from "./selectionsAssets"

interface SelectionsStarRatingProps {
  className?: string
  stars: "4" | "5"
}

export function SelectionsStarRating({ className, stars }: SelectionsStarRatingProps) {
  const isFive = stars === "5"

  return (
    <img
      alt=""
      className={cn(isFive ? "h-3 w-[68px] shrink-0" : "h-3 w-[54px] shrink-0", className)}
      src={isFive ? selectionsAssets.stars5 : selectionsAssets.stars4}
    />
  )
}
