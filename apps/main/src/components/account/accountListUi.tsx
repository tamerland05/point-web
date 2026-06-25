import type { ReactNode } from "react"

import { cn } from "@point/ui/cn"

export function AccountSectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex h-8 items-center px-4 text-[#707579] text-[13px] uppercase leading-4", className)}>
      {children}
    </p>
  )
}

interface AccountListSectionProps {
  children: ReactNode
  className?: string
  title: string
}

export function AccountListSection({ children, className, title }: AccountListSectionProps) {
  return (
    <section className={cn(className)}>
      <AccountSectionHeading>{title}</AccountSectionHeading>
      <div className="overflow-hidden rounded-2xl bg-white">{children}</div>
    </section>
  )
}

export function AccountMenuList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl bg-white", className)}>{children}</div>
}

interface AccountMenuItemProps {
  label: string
  leftIcon: ReactNode
  onClick?: () => void
  rightIcon?: ReactNode
  withSeparator?: boolean
}

export function AccountMenuItem({ label, leftIcon, onClick, rightIcon, withSeparator }: AccountMenuItemProps) {
  return (
    <button
      className="flex w-full items-center gap-4 bg-white pr-0 pl-4 text-left focus:outline-none active:bg-black/[0.02]"
      onClick={onClick}
      type="button"
    >
      <div className="shrink-0">{leftIcon}</div>

      <div
        className={cn(
          "flex min-w-0 flex-1 items-center justify-between gap-4 py-3.5 pr-4",
          withSeparator && "border-black/[0.15] border-b-[0.5px]"
        )}
      >
        <span className="text-[17px] text-text leading-normal">{label}</span>
        {rightIcon}
      </div>
    </button>
  )
}

interface AccountSectionFootnoteProps {
  children: ReactNode
  className?: string
}

export function AccountSectionFootnote({ children, className }: AccountSectionFootnoteProps) {
  return (
    <p className={cn("flex min-h-10 items-center px-4 text-[#8d969d] text-[15px] leading-normal", className)}>
      {children}
    </p>
  )
}
