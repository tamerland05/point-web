import { authQueryOptions } from "@point/shared/api/point/auth"
import { earnTasksQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { isTelegramUrl } from "@tonconnect/ui-react"
import { useMemo } from "react"
import Img from "react-cool-img"

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
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!, ctx.initDataRaw!))
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
    return { value, fraction, suffix, full: `${value}.${fraction}${suffix}` }
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
          <Icon name="Info" className="size-5 rounded-full border border-text p-0.5" />
        </Link>
        <Link className="flex items-center justify-center rounded-full bg-[#E1E0E6] p-1.5" to="/earn/rating">
          <Icon name="Cup" className="size-5" />
        </Link>
      </div>

      <div className="mb-10">
        <div className="mb-1 text-center font-semibold text-base">Bonus balance</div>
        <div className="flex items-baseline justify-center font-sf-pro-rounded">
          <Icon name="BonusMoney" className="mr-1.5 size-10 translate-y-0.5 text-transparent" />
          {/* TODO: fn for tranform number to k/m/b or just number */}
          <div className="font-bold text-[46px] leading-0">{bonusValue.value}.</div>
          <div className="font-bold text-[30px] leading-0">
            {bonusValue.fraction}
            {bonusValue.suffix}
          </div>
        </div>
      </div>

      <List title="Eternal tasks" className="mb-8">
        <ListItem
          className="py-3"
          leftIcon={<Icon name="BonusCircle" className="size-10 text-transparent" />}
          leftTopText="Gratitude"
          leftBottomText="Leave a tip of $1 or more"
          rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
          onClick={() => navigate({ to: "/earn/gratitude" })}
          withSeparator
        />
        <ListItem
          className="py-3"
          leftIcon={<Icon name="ReferralsCircle" className="size-10 text-transparent" />}
          leftTopText="Referrals"
          leftBottomText="Invite friends and get bonus"
          rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
          onClick={() => navigate({ to: "/earn/referrals" })}
        />
      </List>

      {!!tasks.length && (
        <List title="Weekly tasks">
          {tasks.map((task) => (
            <ListItem
              className="py-3"
              key={task.id}
              leftIcon={<Img src={task.icon} className="size-10" />}
              onClick={() => handleTaskClick(task.link)}
              leftTopText={task.title}
              leftBottomText={task.description}
              rightTopText={
                task.done ? <div /> : <div className="-mr-3 whitespace-nowrap">+{formatTokenValue(task.profit)}</div>
              }
              rightIcon={task.done ? <div /> : <Icon name="BonusMoney" className="size-5.5 text-transparent" />}
              withSeparator
            />
          ))}
        </List>
      )}
    </div>
  )
}
