import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"

export const Route = createFileRoute("/account/payment-system/empty")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()

  return (
    <AccountScreenLayout>
      <EmptyStateCard
        actionLabel={t("WAVE1.PAYMENT.NO_METHODS_ACTION")}
        description={t("WAVE1.PAYMENT.NO_METHODS_DESC")}
        onActionClick={() => void navigate({ to: "/account/payment-system/add" })}
        title={t("WAVE1.PAYMENT.NO_METHODS_TITLE")}
      />
    </AccountScreenLayout>
  )
}
