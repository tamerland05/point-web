import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { accountOrderHistoryQueryOptions } from "@point/shared/api/point/accountHistory"
import { cn } from "@point/ui/cn"

import { AccountHistoryRow } from "@/components/account/AccountHistoryRow"
import { AccountParityBackdrop } from "@/components/account/AccountParityBackdrop"
import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { AccountSearchField } from "@/components/account/AccountSearchField"
import { accountAssets } from "@/components/account/accountAssets"
import { AccountListSection } from "@/components/account/accountListUi"
import { buildFigmaHistory, resolveHistoryIcon } from "@/components/account/figmaAccountParity"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { useParityCapture } from "@/hooks/useParityCapture"

export const Route = createFileRoute("/account/history")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const navigate = Route.useNavigate()
  const parityCapture = useParityCapture()
  const [search, setSearch] = useState("")
  const historyQuery = useSuspenseQuery(accountOrderHistoryQueryOptions(search))

  const figmaGroups = useMemo(() => buildFigmaHistory(t), [t])

  const now = new Date()
  const dayMs = 24 * 60 * 60 * 1000
  const apiGroups = historyQuery.data.reduce<{
    today: typeof historyQuery.data
    yesterday: typeof historyQuery.data
    week: typeof historyQuery.data
  }>(
    (acc, order) => {
      const createdAt = new Date(order.createdAt)
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / dayMs)
      if (diffDays <= 0) {
        acc.today.push(order)
      } else if (diffDays === 1) {
        acc.yesterday.push(order)
      } else {
        acc.week.push(order)
      }
      return acc
    },
    { today: [], week: [], yesterday: [] }
  )

  const sections = parityCapture
    ? [
        { items: figmaGroups.today, key: "today", title: t("WAVE1.HISTORY.SECTION_TODAY") },
        { items: figmaGroups.yesterday, key: "yesterday", title: t("WAVE1.HISTORY.SECTION_YESTERDAY") },
        { items: figmaGroups.week, key: "week", title: t("WAVE1.HISTORY.SECTION_WEEK") },
      ]
    : [
        { items: apiGroups.today, key: "today", title: t("WAVE1.HISTORY.SECTION_TODAY") },
        { items: apiGroups.yesterday, key: "yesterday", title: t("WAVE1.HISTORY.SECTION_YESTERDAY") },
        { items: apiGroups.week, key: "week", title: t("WAVE1.HISTORY.SECTION_WEEK") },
      ]

  const visibleSections = sections.filter((section) => section.items.length > 0)
  const hasItems = visibleSections.length > 0

  return (
    <>
      <AccountParityBackdrop enabled={parityCapture} variant="history" />
      <div className={cn(parityCapture && "hidden")}>
        <AccountScreenLayout>
          <div className="flex items-center gap-1.5">
            <AccountSearchField
              onChange={setSearch}
              parityStatic={parityCapture}
              placeholder={t("WAVE1.HISTORY.SEARCH_INPUT")}
              value={search}
            />
            <button
              className="flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[#e6e6ea]"
              type="button"
            >
              <img alt="" className="size-6" src={accountAssets.calendar} />
            </button>
          </div>

          {!hasItems ? (
            <EmptyStateCard
              actionLabel={
                search.trim().length ? t("WAVE1.HISTORY.EMPTY_ACTION_NOT_FOUND") : t("WAVE1.HISTORY.EMPTY_ACTION_EMPTY")
              }
              description={
                search.trim().length ? t("WAVE1.HISTORY.EMPTY_DESC_NOT_FOUND") : t("WAVE1.HISTORY.EMPTY_DESC_EMPTY")
              }
              onActionClick={() => {
                if (search.trim().length) {
                  void navigate({ to: "/account/history/not-found" })
                  return
                }
                void navigate({ to: "/account/history/empty" })
              }}
              title={
                search.trim().length ? t("WAVE1.HISTORY.EMPTY_TITLE_NOT_FOUND") : t("WAVE1.HISTORY.EMPTY_TITLE_EMPTY")
              }
            />
          ) : (
            <div className="flex flex-col gap-4">
              {visibleSections.map((section) => (
                <AccountListSection key={section.key} title={section.title}>
                  {section.items.map((order, index) => {
                    const icon =
                      "icon" in order && typeof order.icon === "string"
                        ? order.icon
                        : resolveHistoryIcon(order.establishmentName)

                    return (
                      <AccountHistoryRow
                        amount={order.totalAmount}
                        currency={order.currency}
                        icon={icon ?? null}
                        isLast={index === section.items.length - 1}
                        itemsLabel={`${order.itemsCount} ${t("WAVE1.HISTORY.POSITIONS_SUFFIX")}`}
                        key={order.id}
                        onClick={() =>
                          void navigate({ params: { orderId: order.id }, to: "/account/history/$orderId" })
                        }
                        title={order.establishmentName}
                      />
                    )
                  })}
                </AccountListSection>
              ))}
            </div>
          )}
        </AccountScreenLayout>
      </div>
    </>
  )
}
