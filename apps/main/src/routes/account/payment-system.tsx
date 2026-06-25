import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/account/payment-system")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/account/payment-system") {
      throw redirect({ to: "/account/payment-system/details" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
