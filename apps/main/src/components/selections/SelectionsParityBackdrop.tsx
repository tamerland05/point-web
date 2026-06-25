import { selectionsAssets } from "./selectionsAssets"

export type SelectionsParityVariant = "feed" | "top"

interface SelectionsParityBackdropProps {
  variant: SelectionsParityVariant | null
}

export function SelectionsParityBackdrop({ variant }: SelectionsParityBackdropProps) {
  if (!variant) {
    return null
  }

  const isFeed = variant === "feed"

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-[#efeff4]">
      <img
        alt=""
        className={
          isFeed
            ? "block h-[368px] w-full max-w-none object-cover object-top"
            : "block h-[798px] w-full max-w-none object-cover object-top"
        }
        src={isFeed ? selectionsAssets.feedBackdrop : selectionsAssets.topBackdrop}
      />
    </div>
  )
}
