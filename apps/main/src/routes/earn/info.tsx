import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"

import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { ShowMainButton } from "@/components/tg-internals"

export const Route = createFileRoute("/earn/info")({
  component: RouteComponent,
})

function RouteComponent() {
  const goToChannel = () => openTelegramLink("https://t.me/point_telegram")

  return (
    <ShowMainButton onClick={goToChannel} title="Project Channel">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col p-4">
        <Icon className="mx-auto mt-4 mb-3 size-28 text-transparent" name="BonusMoney" />
        <div className="mb-1 text-center font-semibold text-title-2">Bonus Balance</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Rate Establishments, Leave Tips, and actively Complete Tasks to earn bonus coins
        </div>

        <List title="Information">
          <ListItem
            className="py-3"
            leftBottomText="The bonus balance is taken into account when distributing rewards among users"
            leftIcon={<Icon className="size-6 text-transparent" name="Lamp" />}
            leftTopText="Awards"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="The project is protected from attackers who want to increase their bonus balance in an unfair way"
            leftIcon={<Icon className="size-6 text-transparent" name="StarShield" />}
            leftTopText="Reliable Protection"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="The project's business model involves a constant replenishment of the reward pool for users"
            leftIcon={<Icon className="size-6 text-transparent" name="PieChart" />}
            leftTopText="Project Economics"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
