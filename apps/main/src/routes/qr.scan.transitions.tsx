import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { useTranslation } from "@point/i18n"

import { BookingFormBlock } from "@/components/wave1/BookingFormBlock"

export const Route = createFileRoute("/qr/scan/transitions")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const [linkId, setLinkId] = useState("")

  return (
    <div className="space-y-3 p-4">
      <h1 className="font-semibold text-title-2">{t("WAVE1.QR.TRANSITIONS_TITLE")}</h1>
      <BookingFormBlock
        label={t("WAVE1.QR.LINK_LABEL")}
        onChange={setLinkId}
        placeholder={t("WAVE1.QR.LINK_PLACEHOLDER")}
        value={linkId}
      />
      <button
        className="w-full rounded-xl bg-accent px-4 py-3 text-caption-1 text-white disabled:opacity-50"
        disabled={linkId.trim().length < 3}
        onClick={() => void navigate({ params: { linkId: linkId.trim() }, to: "/table/$linkId" })}
        type="button"
      >
        {t("WAVE1.QR.GO_TO_ORDER")}
      </button>
      <button
        className="w-full rounded-xl bg-background-secondary px-4 py-3 text-caption-1 text-text"
        onClick={() => void navigate({ to: "/qr/scan/no-image" })}
        type="button"
      >
        {t("WAVE1.QR.NO_IMAGE_BRANCH")}
      </button>
    </div>
  )
}
