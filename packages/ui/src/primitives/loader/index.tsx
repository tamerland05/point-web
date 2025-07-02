import { Icon } from "@/primitives/icon"

export const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Icon name="Logo" className="h-40 w-40 animate-bounce text-transparent" />
  </div>
)

export const Loader = () => (
  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-3 border-white border-t-accent border-l-accent" />
)
