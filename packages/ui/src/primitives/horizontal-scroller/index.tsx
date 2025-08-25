import { useEffect } from "react"
import { useSnapCarousel } from "react-snap-carousel"

import { cn } from "@/utils/cn"

interface HorizontalScrollerRenderItemProps<T> {
  readonly item: T
  readonly isSnapPoint: boolean
}

interface HorizontalScrollerProps<T> {
  className?: string
  scrollRestoration?: boolean
  readonly items: T[]
  readonly showDots?: boolean
  readonly renderItem: (props: HorizontalScrollerRenderItemProps<T>) => React.ReactElement
}

export const HorizontalScroller = <T,>({
  items,
  renderItem,
  className,
  showDots = true,
  scrollRestoration = true,
}: HorizontalScrollerProps<T>) => {
  const { scrollRef, pages, activePageIndex, goTo, snapPointIndexes } = useSnapCarousel()

  // biome-ignore lint/correctness/useExhaustiveDependencies: goTo is not a dependency
  useEffect(() => {
    if (!scrollRestoration) {
      goTo(1, { behavior: "instant" })
    }
  }, [scrollRestoration])

  return (
    <>
      <ul className={cn("scrollbar-hide relative flex snap-x snap-mandatory overflow-auto", className)} ref={scrollRef}>
        {items.map((item, i) =>
          renderItem({
            isSnapPoint: snapPointIndexes.has(i),
            item,
          })
        )}
      </ul>

      {showDots && (
        <div aria-hidden className="my-1 flex flex-wrap items-center justify-center gap-y-1 px-4">
          {pages.map((_, i) => (
            <button
              className={cn(
                "flex h-3 w-3 items-center justify-center rounded-full p-1",
                activePageIndex === i && "w-6"
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: no way to use other key
              key={i}
              onClick={() => goTo(i)}
              type="button"
            >
              <div className={cn("h-1 w-1 rounded-full bg-text-secondary", activePageIndex === i && "w-4 bg-accent")} />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
