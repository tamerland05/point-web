import type { VariantProps } from "class-variance-authority"
import type React from "react"

import { cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

const listItemVariants = cva("flex items-center justify-between rounded-2xl bg-background-secondary px-4 py-2", {
  defaultVariants: {
    fullWidth: true,
    gap: true,
  },
  variants: {
    fullWidth: {
      false: "w-auto",
      true: "w-full",
    },
    gap: {
      false: "gap-2",
      true: "gap-4",
    },
  },
})

interface ListItemProps extends VariantProps<typeof listItemVariants> {
  leftIcon?: React.ReactNode
  leftIconClassName?: string

  leftTopText?: React.ReactNode
  leftBottomText?: React.ReactNode

  rightIcon?: React.ReactNode
  rightIconClassName?: string

  rightTopText?: React.ReactNode
  rightBottomText?: React.ReactNode

  withSeparator?: boolean
  separatorInset?: boolean

  className?: string

  children?: React.ReactNode
  onClick?: () => void
}

export const ListItem: React.FC<ListItemProps> = ({
  leftIcon,
  leftIconClassName,
  leftTopText,
  leftBottomText,
  rightIcon,
  rightIconClassName,
  rightTopText,
  rightBottomText,
  withSeparator,
  separatorInset,
  fullWidth,
  gap,
  className,
  onClick,
}) => {
  const leftContent = (
    <div className="flex flex-col text-left">
      {!!leftTopText && <span className="text-base text-text">{leftTopText}</span>}

      {!!leftBottomText && <span className="text-caption-1 text-text-secondary">{leftBottomText}</span>}
    </div>
  )

  const rightContent = (
    <div className="flex items-center gap-4">
      {(!!rightTopText || !!rightBottomText) && (
        <div className="flex flex-col text-right">
          {!!rightTopText && <span className="text-base text-text">{rightTopText}</span>}

          {!!rightBottomText && <span className="text-caption-1 text-text-secondary">{rightBottomText}</span>}
        </div>
      )}

      {rightIcon && <div className={cn("flex-shrink-0", rightIconClassName)}>{rightIcon}</div>}
    </div>
  )

  if (separatorInset) {
    return (
      <button
        className={cn(
          "flex w-full items-center gap-4 rounded-2xl bg-background-secondary pr-0 pl-4 focus:bg-background-secondary/70 focus:outline-none",
          className
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClick?.()
          }
        }}
        tabIndex={0}
        type="button"
      >
        {!!leftIcon && <div className={cn("flex-shrink-0", leftIconClassName)}>{leftIcon}</div>}

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between gap-4 py-3.5 pr-4",
            withSeparator && "border-black/[0.15] border-b-[0.5px]"
          )}
        >
          {leftContent}
          {rightContent}
        </div>
      </button>
    )
  }

  return (
    <button
      className={cn(
        listItemVariants({ fullWidth, gap }),
        withSeparator &&
          "rounded-b-none border-black/5 border-b last:rounded-b-2xl last:border-b-0 focus:bg-background-secondary/70 focus:outline-none",
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onClick?.()
        }
      }}
      tabIndex={0}
      type="button"
    >
      <div className="flex items-center gap-4">
        {!!leftIcon && <div className={cn("flex-shrink-0", leftIconClassName)}>{leftIcon}</div>}

        {leftContent}
      </div>
      {rightContent}
    </button>
  )
}
