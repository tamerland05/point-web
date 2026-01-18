import * as React from "react"

import { cn } from "@/utils/cn"

interface ButtonProps {
  icon: React.ElementType
  label?: string
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export const Button = React.memo(({ icon: Icon, label, disabled, onClick, className }: ButtonProps) => (
  <button
    className={cn(
      "flex flex-1 flex-col items-center justify-center gap-1 px-1 pt-3 pb-2 disabled:opacity-50",
      className
    )}
    disabled={disabled || !onClick}
    onClick={onClick}
    type="button"
  >
    <div className="flex w-min items-center justify-center rounded-full bg-accent p-3">
      <Icon className="h-6 w-6 fill-none stroke-white" />
    </div>
    {label && <div className="whitespace-nowrap font-medium text-accent text-caption-2">{label}</div>}
  </button>
))

Button.displayName = "IconButton"
