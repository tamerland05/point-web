import { useSnapCarousel } from "react-snap-carousel";

import { cn } from "@/utils/cn";

interface HorizontalScrollerRenderItemProps<T> {
  readonly item: T;
  readonly isSnapPoint: boolean;
}

interface HorizontalScrollerProps<T> {
  className?: string;
  readonly items: T[];
  readonly showDots?: boolean;
  readonly renderItem: (props: HorizontalScrollerRenderItemProps<T>) => React.ReactElement;
}

export const HorizontalScroller = <T,>({
  items,
  renderItem,
  className,
  showDots = true,
}: HorizontalScrollerProps<T>) => {
  const { scrollRef, pages, activePageIndex, goTo, snapPointIndexes } = useSnapCarousel();

  return (
    <>
      <ul ref={scrollRef} className={cn("scrollbar-hide relative flex snap-x snap-mandatory overflow-auto", className)}>
        {items.map((item, i) =>
          renderItem({
            item,
            isSnapPoint: snapPointIndexes.has(i),
          }),
        )}
      </ul>

      {showDots && (
        <div aria-hidden className="my-1 flex flex-wrap items-center justify-center gap-y-1 px-4">
          {pages.map((_, i) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={cn(
                "flex h-3 w-3 items-center justify-center rounded-full p-1",
                activePageIndex === i && "w-6",
              )}
              type="button"
              onClick={() => goTo(i)}
            >
              <div className={cn("bg-text-secondary h-1 w-1 rounded-full", activePageIndex === i && "bg-accent w-4")} />
            </button>
          ))}
        </div>
      )}
    </>
  );
};
