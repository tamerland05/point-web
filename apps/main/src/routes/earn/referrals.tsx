import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { shareURL } from "@telegram-apps/sdk-react"
import { useMemo } from "react"
import Img from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { referralsQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/earn/referrals")({
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
      title: "Invite a friend",
    }
  }, [ctx.launchParams?.tgWebAppData?.user?.id])

  return (
    <ShowMainButton {...mainButtonConfig}>
      <div className="flex w-full flex-col p-4">
        <Icon className="mx-auto mt-4 mb-3 size-28 text-transparent" name="Referrals" />
        <div className="mb-1 text-center font-semibold text-title-2">Referrals</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Invite your friends to our TMA and get the bonus coins you'll need for your listings
        </div>

        <div className="mb-8">
          <h2 className="px-4 text-caption-3 text-text-secondary uppercase">Bonus Amount</h2>
          <div className="mt-1 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-y divide-[#CBCBD0]">
              <div className="px-4 py-2.5">No Premium</div>
              <div className="flex items-center gap-2 border-r-0 bg-background-secondary px-4 py-2.5">
                +{formatTokenValue(1000)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>

              <div className="border-b-0 px-4 py-2.5">Premium</div>
              <div className="flex items-center gap-2 border-r-0 bg-background-secondary px-4 py-2.5">
                +{formatTokenValue(2500)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-[#CBCBD0]">
              <div className="px-4 py-2.5">Earned</div>
              <div className="flex items-center gap-2 bg-background-secondary px-4 py-2.5">
                {formatTokenValue(user.bonusBalance)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>
            </div>
          </div>
        </div>

        {!!referrals.length && (
          <List title="Your friends">
            {referrals.map((referral) => (
              <ListItem
                key={referral.name}
                leftBottomText={
                  <div className="flex items-center gap-1">
                    <Icon className="size-5 text-transparent" name="BonusMoney" />
                    <div className="text-text-secondary">{formatTokenValue(referral.bonusBalance)}</div>
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
