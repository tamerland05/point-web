import { ShowMainButton } from "@/components/tg-internals"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { createFileRoute } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"

export const Route = createFileRoute("/earn/info")({
  component: RouteComponent,
})

function RouteComponent() {
  const goToChannel = () => openTelegramLink("https://t.me/point")
  return (
    <ShowMainButton title="Project Channel" onClick={goToChannel}>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col p-4">
        <Icon name="BonusMoney" className="mx-auto mt-4 mb-3 size-28 text-transparent" />
        <div className="mb-1 text-center font-semibold text-title-2">Bonus Balance</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Tip at your favorite establishments and get the bonus coins you'll need when listing
        </div>

        <List title="Information">
          <ListItem
            className="py-3"
            leftIcon={<Icon name="Lamp" className="size-6 text-transparent" />}
            leftTopText="Listing"
            leftBottomText="Once listed, the bonus balance can be exchanged for tradable tokens"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftIcon={<Icon name="StarShield" className="size-6 text-transparent" />}
            leftTopText="Reliable Protection"
            leftBottomText="The project is protected from attackers who want to increase their bonus balance in an unfair way"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftIcon={<Icon name="PieChart" className="size-6 text-transparent" />}
            leftTopText="Project Economics"
            leftBottomText="The project's economy is built primarily on commissions and advertising integrations within the application"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
