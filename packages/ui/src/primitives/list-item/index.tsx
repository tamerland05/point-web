import type { VariantProps } from "class-variance-authority";

import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/utils/cn";

const listItemVariants = cva("bg-background-secondary flex items-center justify-between rounded-2xl px-4 py-3", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
    gap: {
      true: "gap-4",
      false: "gap-2",
    },
  },
  defaultVariants: {
    fullWidth: true,
    gap: true,
  },
});

interface ListItemProps extends VariantProps<typeof listItemVariants> {
  leftIcon?: React.ReactNode;
  leftIconClassName?: string;

  leftTopText?: React.ReactNode;
  leftBottomText?: React.ReactNode;

  rightIcon?: React.ReactNode;
  rightIconClassName?: string;

  rightTopText?: React.ReactNode;
  rightBottomText?: React.ReactNode;

  withSeparator?: boolean;

  className?: string;

  children?: React.ReactNode;
  onClick?: () => void;
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
  fullWidth,
  gap,
  className,
  onClick,
}) => (
  <div
    className={cn(
      listItemVariants({ fullWidth, gap }),
      withSeparator &&
        "focus:bg-background-secondary/70 rounded-b-none border-b border-black/5 last:rounded-b-2xl last:border-b-0 focus:outline-none dark:border-white/5",
      className,
    )}
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onClick?.();
      }
    }}
  >
    <div className="flex items-center gap-3">
      {!!leftIcon && <div className={cn("flex-shrink-0", leftIconClassName)}>{leftIcon}</div>}

      <div className="flex flex-col gap-0.5 text-left">
        {!!leftTopText && <span className="text-text text-headline">{leftTopText}</span>}

        {!!leftBottomText && <span className="text-text-secondary text-subhead">{leftBottomText}</span>}
      </div>
    </div>
    <div className="flex items-center gap-3">
      {(!!rightTopText || !!rightBottomText) && (
        <div className="flex flex-col gap-0.5 text-right">
          {!!rightTopText && <span className="text-text text-headline">{rightTopText}</span>}

          {!!rightBottomText && <span className="text-text-secondary text-subhead">{rightBottomText}</span>}
        </div>
      )}

      {rightIcon && <div className={cn("flex-shrink-0", rightIconClassName)}>{rightIcon}</div>}
    </div>
  </div>
);
