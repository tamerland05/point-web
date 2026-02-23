import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { isTelegramUrl } from "@tonconnect/ui-react"
import { useMemo } from "react"
import Img from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { earnTasksQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/_withMenu/earn")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))

    queryClient.ensureQueryData(earnTasksQueryOptions)
  },
})

function RouteComponent() {
  const { formatTokenValue } = useFormatter()
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const tasksQuery = useSuspenseQuery(earnTasksQueryOptions)
  const tasks = tasksQuery.data

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const bonusBalance = authQuery.data.user.bonusBalance

  const bonusValue = useMemo(() => {
    let suffix = ""
    let bb = bonusBalance

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
    return { fraction, full: `${value}.${fraction}${suffix}`, suffix, value }
  }, [bonusBalance])

  const handleTaskClick = (link: string) => {
    if (isTelegramUrl(link)) {
      openTelegramLink(link)
    } else {
      window.open(link, "_blank")
    }
  }

  return (
    <div className="">
      <div className="flex items-center justify-between gap-2">
        <Link className="flex items-center justify-center rounded-full bg-[#E1E0E6] p-1.5" to="/earn/info">
          <Icon className="size-5 rounded-full border border-text p-0.5" name="Info" />
        </Link>
        <Link className="flex items-center justify-center rounded-full bg-[#E1E0E6] p-1.5" to="/earn/rating">
          <Icon className="size-5" name="Cup" />
        </Link>
      </div>

      <div className="mb-10">
        <div className="mb-1 text-center font-semibold text-base">Bonus balance</div>
        <div className="flex items-baseline justify-center font-sf-pro-rounded">
          <Icon className="mr-1.5 size-10 translate-y-0.5 text-transparent" name="BonusMoney" />
          {/* TODO: fn for tranform number to k/m/b or just number */}
          <div className="font-bold text-[46px] leading-0">{bonusValue.value}.</div>
          <div className="font-bold text-[30px] leading-0">
            {bonusValue.fraction}
            {bonusValue.suffix}
          </div>
        </div>
      </div>

      <List className="mb-8" title="Eternal tasks">
        <ListItem
          className="py-3"
          leftBottomText="Leave a tip of $1 or more"
          leftIcon={<Icon className="size-10 text-transparent" name="BonusCircle" />}
          leftTopText="Gratitude"
          onClick={() => navigate({ to: "/earn/gratitude" })}
          rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
          withSeparator
        />
        <ListItem
          className="py-3"
          leftBottomText="Invite friends and get bonus"
          leftIcon={<Icon className="size-10 text-transparent" name="ReferralsCircle" />}
          leftTopText="Referrals"
          onClick={() => navigate({ to: "/earn/referrals" })}
          rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
        />
        <ListItem
          className="py-3"
          leftBottomText="Get bonuses for rating"
          leftIcon={<Icon className="size-10 text-transparent" name="RatingCircle" />}
          leftTopText="Rating"
          onClick={() => navigate({ to: "/map" })}
          rightIcon={<div />}
          rightTopText={
            <div className="-mr-3 whitespace-nowrap">
              +{formatTokenValue(1500)} <Icon className="size-5 text-transparent" name="BonusMoney" />
            </div>
          }
        />
      </List>

      {!!tasks.length && (
        <List title="Weekly tasks">
          {tasks.map((task) => (
            <ListItem
              className="py-3"
              key={task.id}
              leftBottomText={task.description}
              leftIcon={<Img className="size-10" src={task.icon} />}
              leftTopText={task.title}
              onClick={() => handleTaskClick(task.link)}
              rightIcon={task.done ? <div /> : <Icon className="size-5.5 text-transparent" name="BonusMoney" />}
              rightTopText={
                task.done ? <div /> : <div className="-mr-3 whitespace-nowrap">+{formatTokenValue(task.profit)}</div>
              }
              withSeparator
            />
          ))}
        </List>
      )}
    </div>
  )
}
