import { createFileRoute } from "@tanstack/react-router"

import { cn } from "@point/ui/cn"

import { BookingParityBackdrop } from "@/components/booking/BookingParityBackdrop"
import { BookingSuccessScreen } from "@/components/booking/BookingSuccessScreen"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createFileRoute("/booking/success")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const parityCapture = useParityCapture()

  return (
    <>
      <BookingParityBackdrop enabled={parityCapture} variant="success" />
      <div className={cn(parityCapture && "hidden")}>
        <BookingSuccessScreen
          onPrimaryAction={() => void navigate({ to: "/selections" })}
          onSecondaryAction={() => void navigate({ to: "/map" })}
        />
      </div>
    </>
  )
}
