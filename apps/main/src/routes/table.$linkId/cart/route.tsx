import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/table/$linkId/cart")({
  component: () => <Outlet />,
})
