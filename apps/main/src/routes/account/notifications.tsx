import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { notificationsQueryOptions } from "@point/shared/api/point/notifications"
import { cn } from "@point/ui/cn"

import { AccountNotificationRow } from "@/components/account/AccountNotificationRow"
import { AccountParityBackdrop } from "@/components/account/AccountParityBackdrop"
import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { AccountSearchField } from "@/components/account/AccountSearchField"
import { AccountListSection } from "@/components/account/accountListUi"
import { buildFigmaNotifications, resolveNotificationIcon } from "@/components/account/figmaAccountParity"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createFileRoute("/account/notifications")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const parityCapture = useParityCapture()
  const [search, setSearch] = useState("")
  const notificationsQuery = useSuspenseQuery(notificationsQueryOptions(search))

  const figmaItems = useMemo(() => buildFigmaNotifications(t), [t])
  const items = parityCapture ? figmaItems : notificationsQuery.data

  return (
    <>
      <AccountParityBackdrop enabled={parityCapture} variant="notifications" />
      <div className={cn(parityCapture && "hidden")}>
        <AccountScreenLayout>
          <AccountSearchField
            onChange={setSearch}
            parityStatic={parityCapture}
            placeholder={t("WAVE1.NOTIFICATIONS.SEARCH_INPUT")}
            value={search}
          />

          {items.length === 0 ? (
            <EmptyStateCard
              actionLabel={
                search.trim().length
                  ? t("WAVE1.NOTIFICATIONS.EMPTY_ACTION_NOT_FOUND")
                  : t("WAVE1.NOTIFICATIONS.EMPTY_ACTION_EMPTY")
              }
              description={
                search.trim().length
                  ? t("WAVE1.NOTIFICATIONS.EMPTY_DESC_NOT_FOUND")
                  : t("WAVE1.NOTIFICATIONS.EMPTY_DESC_EMPTY")
              }
              onActionClick={() =>
                void navigate({
                  to: search.trim().length ? "/account/notifications/not-found" : "/account/notifications/empty",
                })
              }
              title={
                search.trim().length
                  ? t("WAVE1.NOTIFICATIONS.EMPTY_TITLE_NOT_FOUND")
                  : t("WAVE1.NOTIFICATIONS.EMPTY_TITLE_EMPTY")
              }
            />
          ) : (
            <AccountListSection title={t("WAVE1.NOTIFICATIONS.SECTION_TITLE")}>
              {items.map((notification, index) => (
                <AccountNotificationRow
                  icon={
                    "icon" in notification && typeof notification.icon === "string"
                      ? notification.icon
                      : resolveNotificationIcon(index)
                  }
                  isLast={index === items.length - 1}
                  key={notification.id}
                  read={notification.read}
                  text={notification.text}
                  title={notification.title}
                />
              ))}
            </AccountListSection>
          )}
        </AccountScreenLayout>
      </div>
    </>
  )
}
