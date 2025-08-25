import type { VariantProps } from "class-variance-authority"

import { cva } from "class-variance-authority"
import { memo } from "react"

import { cn } from "@/utils/cn"

const skeletonVariants = cva("animate-pulse bg-black/10 dark:bg-white/10", {
  defaultVariants: {
    rounded: "full",
    size: "base",
  },
  variants: {
    rounded: {
      "2xl": "rounded-2xl",
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      none: "rounded-none",
      sm: "rounded-sm",
    },
    size: {
      base: "h-4 w-10",
      "caption-1": "h-3 w-6",
      "caption-2": "h-2.5 w-5",
      headline: "h-5 w-9",
      subhead: "h-3.5 w-8",
      "title-1": "h-7 w-24",
      "title-2": "h-6 w-32",
    },
  },
})

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>

export const Skeleton = memo(({ className, size, rounded, style, ...props }: SkeletonProps) => (
  <div className={cn(skeletonVariants({ rounded, size }), className)} style={style} {...props} />
))

Skeleton.displayName = "Skeleton"
