import type { ReactNode } from "react"

import { cn } from "@point/ui/cn"

interface AccountScreenLayoutProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  footer?: ReactNode
}

export function AccountScreenLayout({ children, className, contentClassName, footer }: AccountScreenLayoutProps) {
  return (
    <div className={cn("flex min-h-full flex-col bg-[#efeff4]", className)}>
      <div className={cn("flex flex-1 flex-col gap-4 px-4 pt-3 pb-6", contentClassName)}>{children}</div>
      {footer}
    </div>
  )
}
