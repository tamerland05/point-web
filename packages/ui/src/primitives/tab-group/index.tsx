import { cva } from "class-variance-authority"
import { memo } from "react"

import { cn } from "@/utils/cn"

interface TabGroupProps<T extends string> {
  items: { label: string; value: T }[]
  value: T
  size?: "sm" | "md" | "xs"
  onSelect: (value: T) => void
  className?: string
}

const tabGroupVariants = cva("flex gap-2 rounded-2xl bg-background-secondary p-2", {
  defaultVariants: {
    size: "sm",
  },
  variants: {
    size: {
      md: "text-headline",
      sm: "text-caption-1",
      xs: "text-headline",
    },
  },
})

export const TabGroup = memo(
  <T extends string>({ items, value, size = "sm", className, onSelect }: TabGroupProps<T>) => (
    <div className={cn(tabGroupVariants({ size }), className)}>
      {items.map((item) => (
        <button
          className={cn({
            "bg-background text-accent": value === item.value,
            "flex flex-1 items-center justify-center rounded-xl px-2 py-1 text-text-secondary": true,
            "px-5 py-2.5 font-medium": size === "md",
            "rounded-lg px-4 py-1 font-medium": size === "xs",
          })}
          key={item.value}
          onClick={() => onSelect(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
)

TabGroup.displayName = "TabGroup"
