import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { useTranslation } from "@point/i18n"
import { accountOrderHistoryDetailQueryOptions } from "@point/shared/api/point/accountHistory"

import { AccountScreenLayout } from "@/components/account/AccountScreenLayout"
import { EmptyStateCard } from "@/components/wave1/EmptyStateCard"
import { EntityListCard } from "@/components/wave1/EntityListCard"

export const Route = createFileRoute("/account/history/$orderId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { orderId } = Route.useParams()
  const navigate = Route.useNavigate()
  const orderQuery = useSuspenseQuery(accountOrderHistoryDetailQueryOptions(orderId))

  if (!orderQuery.data) {
    return (
      <AccountScreenLayout>
        <EmptyStateCard
          actionLabel={t("WAVE1.HISTORY.DETAIL_UNAVAILABLE_ACTION")}
          description={t("WAVE1.HISTORY.DETAIL_UNAVAILABLE_DESC")}
          onActionClick={() => void navigate({ to: "/account/history" })}
          title={t("WAVE1.HISTORY.DETAIL_UNAVAILABLE_TITLE")}
        />
      </AccountScreenLayout>
    )
  }

  const order = orderQuery.data

  return (
    <AccountScreenLayout>
      <h1 className="font-medium text-[#222222] text-[17px] leading-normal">{order.establishmentName}</h1>
      <p className="text-[#8d969d] text-[15px] leading-normal">
        {t("WAVE1.HISTORY.DETAIL_ORDER_PREFIX")} {order.id} · {new Date(order.createdAt).toLocaleString("ru-RU")}
      </p>
      {order.items.map((item) => (
        <EntityListCard
          key={item.id}
          meta={`${item.price * item.quantity} ${order.currency}`}
          subtitle={`${t("WAVE1.HISTORY.DETAIL_QUANTITY_PREFIX")}: ${item.quantity}`}
          title={item.name}
        />
      ))}
      <div className="rounded-2xl bg-white p-4 text-[#222222] text-[15px] leading-normal">
        {t("WAVE1.HISTORY.DETAIL_TOTAL_PREFIX")}:{" "}
        <b>
          {order.totalAmount} {order.currency}
        </b>
      </div>
    </AccountScreenLayout>
  )
}
