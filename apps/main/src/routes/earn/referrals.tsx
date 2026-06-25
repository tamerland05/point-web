import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { shareURL } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Img from "react-cool-img"

import { useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { referralsQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"
import { earnLegacyBeforeLoad } from "@/config/earnLegacy"

export const Route = createFileRoute("/earn/referrals")({
  beforeLoad: earnLegacyBeforeLoad,
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
  },
})

function RouteComponent() {
  const { formatTokenValue } = useFormatter()
  const { t } = useTranslation()
  const ctx = Route.useRouteContext()

  const referralsQuery = useQuery(referralsQueryOptions(1, 100))
  const referrals = referralsQuery.data?.items ?? []

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const user = authQuery.data.user

  const mainButtonConfig = useMemo(() => {
    return {
      hidden: !ctx.launchParams?.tgWebAppData?.user?.id,
      onClick: () =>
        shareURL(`${import.meta.env.VITE_TMA_URL}?startapp=ref=${ctx.launchParams?.tgWebAppData?.user?.id}`),
      title: t("EARN.REFERRALS.INVITE_FRIEND"),
    }
  }, [ctx.launchParams?.tgWebAppData?.user?.id])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="flex w-full flex-col p-4">
        <Icon className="mx-auto mt-4 mb-3 size-28 text-transparent" name="Referrals" />
        <div className="mb-1 text-center font-semibold text-title-2">{t("EARN.REFERRALS.TITLE")}</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">{t("EARN.REFERRALS.SUBTITLE")}</div>

        <div className="mb-8">
          <h2 className="px-4 text-caption-3 text-text-secondary uppercase">{t("EARN.REFERRALS.BONUS_AMOUNT")}</h2>
          <div className="mt-1 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-y divide-[#CBCBD0]">
              <div className="px-4 py-2.5">{t("EARN.REFERRALS.NO_PREMIUM")}</div>
              <div className="flex items-center gap-2 border-r-0 bg-background-secondary px-4 py-2.5">
                +{formatTokenValue(1000)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>

              <div className="border-b-0 px-4 py-2.5">{t("EARN.REFERRALS.PREMIUM")}</div>
              <div className="flex items-center gap-2 border-r-0 bg-background-secondary px-4 py-2.5">
                +{formatTokenValue(4000)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-[#CBCBD0]">
              <div className="px-4 py-2.5">{t("EARN.REFERRALS.EARNED")}</div>
              <div className="flex items-center gap-2 bg-background-secondary px-4 py-2.5">
                {formatTokenValue(user.referralsBonusBalance)}{" "}
                <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>
            </div>
          </div>
        </div>

        {!!referrals.length && (
          <List title={t("EARN.REFERRALS.YOUR_FRIENDS")}>
            {referrals.map((referral) => (
              <ListItem
                key={referral.name}
                leftBottomText={
                  <div className="flex items-center gap-1">
                    <Icon className="size-5 text-transparent" name="BonusMoney" />
                    <div className="text-text-secondary">{formatTokenValue(referral.referralsBonusBalance)}</div>
                  </div>
                }
                leftIcon={<Img alt={referral.name} className="size-12 rounded-full" src={referral.photoUrl} />}
                leftTopText={referral.name}
                withSeparator
              />
            ))}
          </List>
        )}
      </div>
    </ShowMainButton>
  )
}
