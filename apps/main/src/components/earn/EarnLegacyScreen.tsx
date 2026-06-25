import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { openLink, openTelegramLink } from "@telegram-apps/sdk-react"
import { isTelegramUrl } from "@tonconnect/ui-react"
import { useMemo } from "react"
import Img from "react-cool-img"
import toast from "react-hot-toast"

import { useTranslation } from "@point/i18n"
import { type AuthReq, authQueryOptions } from "@point/shared/api/point/auth"
import { earnTasksQueryOptions } from "@point/shared/api/point/earn"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { useTaskExecuteMutation } from "@/api/point/earn"

interface EarnLegacyScreenProps {
  initDataRaw: string
  tgWebAppData: AuthReq
  onNavigate: (to: string) => void
}

/** @deprecated Wave-1 Figma replaces this with Loyalty tab. Kept for EARN_LEGACY_ENABLED. */
export function EarnLegacyScreen({ initDataRaw, onNavigate, tgWebAppData }: EarnLegacyScreenProps) {
  const queryClient = useQueryClient()
  const executeTaskMutation = useTaskExecuteMutation()
  const { formatTokenValue } = useFormatter()
  const { t } = useTranslation()

  const tasksQuery = useSuspenseQuery(earnTasksQueryOptions)
  const tasks = tasksQuery.data

  const authQuery = useSuspenseQuery(authQueryOptions(tgWebAppData, initDataRaw))
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

  const handleTaskClick = async (id: string, link: string) => {
    try {
      await executeTaskMutation.mutateAsync({ id })
    } catch {
      toast.error("Ошибка. Выполните задание позже")
      return
    }

    await queryClient.invalidateQueries(earnTasksQueryOptions)
    if (isTelegramUrl(link)) {
      openTelegramLink(link)
    } else {
      openLink(link)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link className="flex items-center justify-center rounded-full bg-[#E1E0E6] p-1" to="/earn/info">
          <Icon className="size-9" fill={""} name="Info" stroke={""} />
        </Link>
        <Link className="flex items-center justify-center rounded-full bg-[#E1E0E6] p-1" to="/earn/rating">
          <Icon className="size-9" fill={""} name="Cup" stroke={""} />
        </Link>
      </div>

      <div className="mb-10">
        <div className="mb-1 text-center font-semibold text-base">{t("EARN.COMMON.BONUS_BALANCE")}</div>
        <div className="flex items-baseline justify-center font-sf-pro-rounded">
          <Icon className="mr-1.5 size-10 translate-y-0.5 text-transparent" name="BonusMoney" />
          <div className="font-bold text-[46px] leading-0">{bonusValue.value}.</div>
          <div className="font-bold text-[30px] leading-0">
            {bonusValue.fraction}
            {bonusValue.suffix}
          </div>
        </div>
      </div>

      <List className="mb-8" title={t("EARN.TASKS.ETERNAL_TITLE")}>
        <ListItem
          className="py-3"
          leftBottomText={t("EARN.TASKS.GRATITUDE_DESC")}
          leftIcon={<Icon className="size-10 text-transparent" name="BonusCircle" />}
          leftTopText={t("EARN.TASKS.GRATITUDE_TITLE")}
          onClick={() => onNavigate("/earn/gratitude")}
          rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
          withSeparator
        />
        <ListItem
          className="py-3"
          leftBottomText={t("EARN.TASKS.REFERRALS_DESC")}
          leftIcon={<Icon className="size-10 text-transparent" name="ReferralsCircle" />}
          leftTopText={t("EARN.TASKS.REFERRALS_TITLE")}
          onClick={() => onNavigate("/earn/referrals")}
          rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
          withSeparator
        />
        <ListItem
          className="py-3"
          leftBottomText={t("EARN.TASKS.RATING_DESC")}
          leftIcon={<Icon className="size-10 text-transparent" name="RatingCircle" />}
          leftTopText={t("EARN.TASKS.RATING_TITLE")}
          onClick={() => onNavigate("/map")}
          rightIcon={<div />}
          rightTopText={
            <div className="-mr-3 whitespace-nowrap">
              +{formatTokenValue(1500)} <Icon className="size-5 text-transparent" name="BonusMoney" />
            </div>
          }
        />
      </List>

      {!!tasks.length && (
        <List title={t("EARN.TASKS.WEEKLY_TITLE")}>
          {tasks.map((task) => (
            <ListItem
              className="py-3"
              key={task.id}
              leftBottomText={task.description}
              leftIcon={<Img className="size-10" src={task.icon} />}
              leftTopText={task.title}
              onClick={() => void handleTaskClick(task.id, task.link)}
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
