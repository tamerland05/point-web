import { memo } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn";

interface TabGroupProps<T extends string> {
  items: { label: string; value: T }[];
  value: T;
  size?: "sm" | "md" | "xs";
  onSelect: (value: T) => void;
  className?: string;
}

const tabGroupVariants = cva("bg-background-secondary flex gap-2 rounded-2xl p-2", {
  variants: {
    size: {
      sm: "text-caption-1",
      md: "text-headline",
      xs: "text-headline",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export const TabGroup = memo(
  <T extends string>({ items, value, size = "sm", className, onSelect }: TabGroupProps<T>) => (
    <div className={cn(tabGroupVariants({ size }), className)}>
      {items.map((item) => (
        <button
          key={item.value}
          className={cn({
            "text-text-secondary flex flex-1 items-center justify-center rounded-xl px-2 py-1": true,
            "bg-background text-accent": value === item.value,
            "px-5 py-2.5 font-medium": size === "md",
            "rounded-lg px-4 py-1 font-medium": size === "xs",
          })}
          type="button"
          onClick={() => onSelect(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
);

TabGroup.displayName = "TabGroup";
