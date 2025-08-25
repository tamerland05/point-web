import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/selections")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="m-4">
      Hello "/selections"!
      <Link params={{ id: "1" }} to="/selections/$id">
        Test
      </Link>
    </div>
  )
}
