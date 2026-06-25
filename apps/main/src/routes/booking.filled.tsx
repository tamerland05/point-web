import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { cn } from "@point/ui/cn"

import { BookingFormScreen, BookingPrimaryButton } from "@/components/booking/BookingFormScreen"
import { BookingParityBackdrop } from "@/components/booking/BookingParityBackdrop"
import { useBookingScreenData } from "@/hooks/useBookingScreenData"
import { createInitialBookingDateTime, shiftBookingDateTime } from "@/utils/bookingDateTime"

export const Route = createFileRoute("/booking/filled")({
  component: RouteComponent,
  loader: async ({ context, deps }) => {
    if (context.launchParams?.tgWebAppData && context.initDataRaw) {
      await context.queryClient.ensureQueryData(
        authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw)
      )
    }

    if (deps.establishmentId) {
      await context.queryClient.ensureQueryData(establishmentQueryOptions(deps.establishmentId))
    }
  },
  loaderDeps: ({ search }) => ({
    contactName: search.contactName,
    establishmentId: search.establishmentId,
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    contactName: typeof search["contactName"] === "string" ? search["contactName"] : undefined,
    establishmentId: typeof search["establishmentId"] === "string" ? search["establishmentId"] : undefined,
  }),
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const ctx = Route.useRouteContext()
  const { contactName, establishmentId } = Route.useSearch()
  const tgWebAppData = ctx.launchParams?.tgWebAppData

  if (!tgWebAppData) {
    throw new Error("Booking screen requires Telegram init data")
  }

  const { accountName, establishmentAddress, establishmentName, establishmentPhoto, parityCapture } =
    useBookingScreenData(establishmentId, {
      initDataRaw: ctx.initDataRaw,
      tgWebAppData,
    })

  const [dateTime, setDateTime] = useState(() =>
    parityCapture ? new Date("2026-06-21T19:00:00") : createInitialBookingDateTime()
  )
  const [name, setName] = useState(contactName ?? "")

  return (
    <>
      <BookingParityBackdrop enabled={parityCapture} variant="filled" />
      <div className={cn(parityCapture && "hidden")}>
        <BookingFormScreen
          accountName={accountName}
          dateTime={dateTime}
          establishmentAddress={establishmentAddress}
          establishmentName={establishmentName}
          establishmentPhoto={establishmentPhoto}
          footer={
            <div className="fixed inset-x-0 bottom-0 bg-[#efeff4] px-4 pt-3 pb-8">
              <BookingPrimaryButton
                onClick={() => {
                  void navigate({ to: "/booking/success" })
                }}
                variant="filled"
              >
                {t("WAVE1.BOOKING.BOOK_BUTTON")}
              </BookingPrimaryButton>
            </div>
          }
          name={name}
          onDateToggle={() => {
            setDateTime((current) =>
              parityCapture
                ? new Date(current.getDate() === 21 ? "2026-06-10T16:00:00" : "2026-06-21T19:00:00")
                : shiftBookingDateTime(current, 1)
            )
          }}
          onNameChange={setName}
          variant="filled"
        />
      </div>
    </>
  )
}
