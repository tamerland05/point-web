import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"

export const Route = createFileRoute("/account/notifications/not-found")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()

  return (
    <AccountScreenLayout>
      <EmptyStateCard
        actionLabel={t("WAVE1.NOTIFICATIONS.NOT_FOUND_PAGE_ACTION")}
        description={t("WAVE1.NOTIFICATIONS.NOT_FOUND_PAGE_DESC")}
        onActionClick={() => void navigate({ to: "/account/notifications" })}
        title={t("WAVE1.NOTIFICATIONS.NOT_FOUND_PAGE_TITLE")}
      />
    </AccountScreenLayout>
  )
}
