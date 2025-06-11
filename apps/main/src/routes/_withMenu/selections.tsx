import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/selections")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="m-4">
      Hello "/selections"!
      <Link to="/selections/$id" params={{ id: "1" }}>
        Test
      </Link>
    </div>
  )
}
