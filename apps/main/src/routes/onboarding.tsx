import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="[view-transition-name:main-content]">Hello "/onboarding"!</div>
}
