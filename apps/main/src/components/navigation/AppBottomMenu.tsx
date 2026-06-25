import type { MenuItem } from "@point/ui/menu"

import { cn } from "@point/ui/cn"

interface AppBottomMenuProps {
  items: MenuItem[]
}

export function AppBottomMenu({ items }: AppBottomMenuProps) {
  const visibleItems = items.filter((item) => !item.hidden)

  return (
    <nav
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 [view-transition-name:bottom-menu]",
        "bottom-[max(38px,calc(env(safe-area-inset-bottom)+4px))]"
      )}
    >
      <div className="pointer-events-auto flex items-center gap-8 rounded-[32px] border border-black/15 bg-white px-4 pt-2.5 pb-3 shadow-[0_0_3px_rgba(0,0,0,0.15)]">
        {visibleItems.map((item) => (
          <button
            className={cn("flex w-[54px] flex-col items-center gap-0.5", {
              "text-[#8d969d]": !item.active,
              "text-accent": item.active,
            })}
            disabled={item.disabled}
            key={item.label}
            onClick={item.onClick}
            type="button"
          >
            <div className="flex h-11 w-11 items-center justify-center">{item.icon}</div>
            <span className="text-center font-medium text-[12px] leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
