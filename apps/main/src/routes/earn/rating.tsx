import { authQueryOptions } from "@point/shared/api/point/auth"
import { earnTopQueryOptions, referralsQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { Loader } from "@point/ui/loader"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useCallback } from "react"
import Img from "react-cool-img"

export const Route = createFileRoute("/earn/rating")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    queryClient.ensureQueryData(earnTopQueryOptions)
  },
})

function RouteComponent() {
  const { formatTokenValue } = useFormatter()
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const router = useRouter()

  const topQuery = useSuspenseQuery(earnTopQueryOptions)
  const topUsers = topQuery.data

  const referralsQuery = useQuery(referralsQueryOptions(1, 100))
  const referrals = referralsQuery.data?.items ?? []
  const referralsIsLoading = referralsQuery.isPending

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!, ctx.initDataRaw!))
  const bonusBalance = authQuery.data.user.bonusBalance
  const rank = authQuery.data.user.rank

  const formatBonusBalance = useCallback((bonusBal: number | undefined | null) => {
    if (!bonusBal) return "0"

    let bb = bonusBal
    let suffix = ""

    if (bb >= 1_000_000_000) {
      bb = bb / 1_000_000_000
      suffix = "b"
    } else if (bb >= 1_000_000) {
      bb = bb / 1_000_000
      suffix = "m"
    } else if (bb >= 1_000) {
      bb = bb / 1_000
      suffix = "k"
    }

    const [value, fraction] = bb.toFixed(2).split(".")

    return `${value}.${fraction}${suffix}`
  }, [])

  const handleTasksClick = useCallback(() => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: "/earn" })
  }, [router, navigate])

  const handleGoToProfile = useCallback(
    (userId: number) => {
      navigate({ to: "/profile/$id", params: { id: userId.toString() } })
    },
    [navigate]
  )

  return (
    <div className="flex w-full flex-col overflow-hidden p-4">
      {/* Топ-3 */}
      <div className="mb-7 flex w-full items-end justify-between gap-6">
        {topUsers.slice(0, 3).map((u, i) => (
          <button
            type="button"
            onClick={() => handleGoToProfile(u.id)}
            key={u.name}
            className={cn("group flex flex-col items-center", {
              "order-0 flex-1": i === 1,
              "order-1 flex-2": i === 0,
              "order-2 flex-1": i === 2,
            })}
          >
            <div className={cn("relative mb-2.5 size-19 rounded-full bg-background", { "mb-3 size-24": i === 0 })}>
              <Img
                placeholder="/user-ph.svg"
                error="/user-ph.svg"
                src={u.photoUrl}
                alt={u.username}
                className="h-full w-full rounded-full"
              />

              <div className="-bottom-2 absolute right-0 flex size-5 w-full items-center justify-center rounded-full bg-transparent">
                <div
                  className={cn(
                    "flex size-5.5 items-center justify-center rounded-full bg-background text-caption-1 text-white",
                    {
                      "bg-[#FDB605]": i === 0,
                      "bg-[#8BA1B2]": i === 1,
                      "bg-[#F27B0A]": i === 2,
                    }
                  )}
                >
                  {i + 1}
                </div>
              </div>
            </div>
            <span className="max-w-[25vw] truncate text-ellipsis font-medium text-base">{u.username || u.name}</span>
            <div className="flex items-center gap-1 text-caption-1 text-text-secondary uppercase">
              <Icon name="BonusMoney" className="size-5 text-transparent" />
              {formatBonusBalance(u.bonusBalance)}
            </div>
          </button>
        ))}
      </div>

      {/* 4-7 места */}
      <div className="mb-4 flex w-full justify-between gap-2">
        {topUsers.slice(3, 7).map((u, i) => (
          <button
            type="button"
            onClick={() => handleGoToProfile(u.id)}
            key={u.name}
            className="flex flex-1 flex-col items-center"
          >
            <div className="relative mb-3 size-15 rounded-full bg-background">
              <Img
                placeholder="/user-ph.svg"
                error="/user-ph.svg"
                src={u.photoUrl}
                alt={u.username}
                className="h-full w-full rounded-full"
              />
              <div className="-bottom-2 absolute right-0 flex size-5 w-full items-center justify-center rounded-full bg-transparent">
                <div className={cn("flex size-4.5 items-center justify-center rounded-full bg-white text-caption-3")}>
                  {i + 1 + 3}
                </div>
              </div>
            </div>
            <span className="max-w-[20vw] truncate font-medium text-base">{u.username || u.name}</span>
            <div className="flex items-center gap-1 text-caption-1 text-text-secondary uppercase">
              <Icon name="BonusMoney" className="size-5 text-transparent" />
              {formatBonusBalance(u.bonusBalance)}
            </div>
          </button>
        ))}
      </div>

      {/* Твои показатели */}
      <div className="mb-4 flex w-full justify-center gap-1">
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-white p-3">
          <div className="flex items-center gap-1 truncate">
            <Icon name="BonusMoney" className="mb-1 size-5 text-transparent" />
            <span className="font-bold">{formatBonusBalance(bonusBalance)}</span>
          </div>
          <span className="truncate text-caption-1 text-text-secondary">Your Balance</span>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-2xl bg-white p-3">
          <span className="truncate font-bold">#{rank}</span>
          <span className="truncate text-caption-1 text-text-secondary">Your Rank</span>
        </div>

        <div className="flex flex-1 flex-col items-center rounded-2xl bg-white p-3">
          {referralsIsLoading ? (
            <Loader className="size-6" />
          ) : (
            <div className="flex items-center gap-1 truncate">
              <Icon name="Referrals" className="mb-1 size-5 text-transparent" />
              <span className="font-bold">{formatTokenValue(referrals.length)}</span>
            </div>
          )}
          <span className="truncate text-caption-1 text-text-secondary">Your Referrals</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleTasksClick}
        className="mb-8 w-full rounded-xl bg-[#4378FF1A] py-3 font-semibold text-accent"
      >
        Tasks
      </button>

      <List title="Top users">
        {topUsers.slice(7).map((u, i) => (
          <ListItem
            onClick={() => handleGoToProfile(u.id)}
            key={u.username}
            leftIcon={<Img src={u.photoUrl} alt={u.username} className="size-12 rounded-full" />}
            leftTopText={u.username || u.name}
            leftBottomText={
              <div className="flex items-center gap-1">
                <Icon name="BonusMoney" className="size-5 text-transparent" />
                <div className="text-text-secondary">{formatBonusBalance(u.bonusBalance)}</div>
              </div>
            }
            rightTopText={i + 1 + 7}
            withSeparator
          />
        ))}
      </List>
    </div>
  )
}
