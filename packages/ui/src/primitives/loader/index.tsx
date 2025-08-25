import { Icon } from "@/primitives/icon"
import { cn } from "@/utils/cn"

export const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Icon className="h-40 w-40 animate-bounce text-transparent" name="Logo" />
  </div>
)

export const Loader = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "mx-auto size-7 animate-spin rounded-full border-3 border-white border-t-accent border-l-accent",
      className
    )}
  />
)
