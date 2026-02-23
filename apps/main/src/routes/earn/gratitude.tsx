import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import React from "react"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/earn/gratitude")({
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
  const navigate = useNavigate()
  const ctx = Route.useRouteContext()

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const bonusBalance = authQuery.data.user.bonusBalance

  const BONUS_TIERS = [
    { bonus: "100", range: "1-4 USDT" },
    { bonus: "500", range: "5-9 USDT" },
    { bonus: "1 500", range: "10-19 USDT" },
    { bonus: "3 000", range: "20-49 USDT" },
    { bonus: "7 500", range: "50-99 USDT" },
    { bonus: "15 000", range: "100+ USDT" },
  ]

  const goToMap = () => navigate({ to: "/map" })
  return (
    <ShowMainButton onClick={goToMap} title="Start Tipping">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col p-4">
        <Icon className="mx-auto mt-4 mb-3 size-28 text-transparent" name="Bonus" />
        <div className="mb-1 text-center font-semibold text-title-2">Gratitude</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Tip at your favorite establishments and get the bonus coins you'll need when listing
        </div>

        <div>
          <h2 className="px-4 text-caption-3 text-text-secondary uppercase">Bonus Amount</h2>
          <div className="mt-1 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-y divide-[#CBCBD0]">
              {BONUS_TIERS.map((tier, idx) => (
                <React.Fragment key={tier.range}>
                  <div className={cn("px-4 py-2.5", idx === BONUS_TIERS.length - 1 && "border-b-0")}>{tier.range}</div>
                  <div className="flex items-center gap-2 border-r-0 bg-background-secondary px-4 py-2.5">
                    +{tier.bonus} <Icon className="size-5 text-transparent" name="BonusMoney" />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-[#CBCBD0]">
            <div className="grid grid-cols-2 divide-x divide-[#CBCBD0]">
              <div className="px-4 py-2.5">Earned</div>
              <div className="flex items-center gap-2 bg-background-secondary px-4 py-2.5">
                {formatTokenValue(bonusBalance)} <Icon className="size-5 text-transparent" name="BonusMoney" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShowMainButton>
  )
}
