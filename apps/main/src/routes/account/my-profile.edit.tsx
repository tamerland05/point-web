import { createFileRoute } from "@tanstack/react-router"

// TODO: steps: data-fundraising-jobPalce
// not employee has only one step
export const Route = createFileRoute("/account/my-profile/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/my-profile/edit"!</div>
}
