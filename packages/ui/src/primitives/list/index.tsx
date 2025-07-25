import type { HTMLAttributes, ReactNode } from "react"

import { forwardRef } from "react"

import { cn } from "@/utils/cn"

interface ListProps {
  children: ReactNode
  title?: string
  withGap?: boolean
  onExpand?: () => void
  expandText?: string
  className?: string
  isExpandDisabled?: boolean
}

type Ref = HTMLDivElement

export const List = forwardRef<Ref, ListProps & HTMLAttributes<HTMLDivElement>>(
  (
    { children, title, withGap = false, onExpand, expandText = "See All", className, isExpandDisabled, ...otherProps },
    ref
  ) => (
    <>
      {(!!title || !!onExpand) && (
        <div className="mx-4 mb-1 flex items-center justify-between">
          {title && <div className="text-caption-3 text-text-secondary uppercase ">{title}</div>}
          {onExpand && (
            <button type="button" onClick={onExpand} className="text-accent text-caption-3 uppercase">
              {expandText}
            </button>
          )}
        </div>
      )}
      <div
        ref={ref}
        className={cn("flex flex-col", withGap ? "gap-3" : "rounded-2xl bg-background-secondary", className)}
        {...otherProps}
      >
        {children}
      </div>
    </>
  )
)

List.displayName = "List"
