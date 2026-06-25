import { cn } from "@point/ui/cn"

interface NavMenuIconProps {
  active: boolean
  activeSrc: string
  className?: string
  iconClassName?: string
  src: string
}

export function NavMenuIcon({ active, activeSrc, className, iconClassName, src }: NavMenuIconProps) {
  return (
    <img
      alt=""
      className={cn("h-10 w-10 object-contain [color-scheme:light]", iconClassName, className)}
      decoding="sync"
      src={active ? activeSrc : src}
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    />
  )
}
