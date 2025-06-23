import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/profile-type-updated')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/profile-type-updated"!</div>
}
