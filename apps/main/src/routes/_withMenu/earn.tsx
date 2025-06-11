import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/earn")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="">Hello "/earn"!</div>
}
