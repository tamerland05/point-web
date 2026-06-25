import { createFileRoute } from "@tanstack/react-router"

import { PaymentStatusScreen } from "@/components/table-order/PaymentStatusScreen"

export const Route = createFileRoute("/table/$linkId/payment-status/no-funds")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { linkId } = Route.useParams()

  return (
    <PaymentStatusScreen
      onBackToMenu={() => {
        void navigate({ params: { linkId }, to: "/table/$linkId" } as never)
      }}
      onPrimaryAction={() => {
        void navigate({ params: { linkId }, to: "/table/$linkId/payment" } as never)
      }}
      variant="no-funds"
    />
  )
}
