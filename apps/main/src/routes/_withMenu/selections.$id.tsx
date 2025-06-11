import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/selections/$id")({
  component: RouteComponent,
})

function RouteComponent() {
  const id = Route.useParams().id
  return (
    <div className="m-4">
      Hello "/selections/$id" <h1>{id}</h1>!
    </div>
  )
}
