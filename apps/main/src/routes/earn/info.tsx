import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"

import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"
import { earnLegacyBeforeLoad } from "@/config/earnLegacy"

export const Route = createFileRoute("/earn/info")({
  beforeLoad: earnLegacyBeforeLoad,
  component: RouteComponent,
})

function RouteComponent() {
  const goToChannel = () => openTelegramLink("https://t.me/point_telegram")

  return (
    <ShowMainButton onClick={goToChannel} title="Канал проекта">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col p-4">
        <Icon className="mx-auto mt-4 mb-3 size-28 text-transparent" name="BonusMoney" />
        <div className="mb-1 text-center font-semibold text-title-2">Бонусный баланс</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Оценивайте заведения, оставляйте чаевые и выполняйте задания, чтобы получать бонусные монеты
        </div>

        <List title="Информация">
          <ListItem
            className="py-3"
            leftBottomText="Бонусный баланс учитывается при распределении вознаграждений между пользователями"
            leftIcon={<Icon className="size-6 text-transparent" name="Lamp" />}
            leftTopText="Награды"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="Проект защищен от попыток нечестного увеличения бонусного баланса"
            leftIcon={<Icon className="size-6 text-transparent" name="StarShield" />}
            leftTopText="Надежная защита"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="Бизнес-модель проекта предполагает постоянное пополнение пула наград для пользователей"
            leftIcon={<Icon className="size-6 text-transparent" name="PieChart" />}
            leftTopText="Экономика проекта"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
