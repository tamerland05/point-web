import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"

export const Route = createFileRoute("/account/payment-system/success")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()

  return (
    <AccountScreenLayout>
      <EmptyStateCard
        actionLabel={t("WAVE1.PAYMENT.SUCCESS_ACTION")}
        description={t("WAVE1.PAYMENT.SUCCESS_DESC")}
        onActionClick={() => void navigate({ to: "/account/payment-system/details" })}
        title={t("WAVE1.PAYMENT.SUCCESS_TITLE")}
      />
    </AccountScreenLayout>
  )
}
