import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_withMenu/selections/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/selections/$id"!</div>
}
