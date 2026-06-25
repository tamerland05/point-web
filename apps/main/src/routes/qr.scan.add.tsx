import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

import { DEMO_TABLE_LINK_ID } from "@/constants/posDemo"

export const Route = createFileRoute("/qr/scan/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  useEffect(() => {
    void navigate({
      params: { linkId: DEMO_TABLE_LINK_ID },
      replace: true,
      search: { stepper: "always" },
      to: "/table/$linkId",
    })
  }, [navigate])

  return null
}
