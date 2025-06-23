import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$id/fundraising')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/$id/fundraising"!</div>
}
