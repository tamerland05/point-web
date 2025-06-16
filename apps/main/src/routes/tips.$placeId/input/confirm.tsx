import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tips/$placeId/input/confirm')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tips/$placeId/input/confirm"!</div>
}
