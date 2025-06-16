import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tips/$placeId/input/amount')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tips/$placeId/input/amount"!</div>
}
