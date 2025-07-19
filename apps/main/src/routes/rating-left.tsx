import { createFileRoute, useRouter } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useSetAtom } from "jotai"
import Img from "react-cool-img"
import { z } from "zod"

import { showMenuAtom } from "@/atoms/ui"
import { ShowMainButton } from "@/components/tg-internals"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useEffect } from "react"

const onboardingSchema = z.object({
  placeId: z.string().optional(),
})

export const Route = createFileRoute("/rating-left")({
  component: RouteComponent,
  validateSearch: zodValidator(onboardingSchema),
})

function RouteComponent() {
  const router = useRouter()
  const navigate = Route.useNavigate()

  const showMenu = useSetAtom(showMenuAtom)

  const handleContinue = async () => {
    if (router.history.canGoBack()) {
      router.history.back()
    }
    navigate({ to: "/map" })
    showMenu(true)
  }

  useEffect(() => {
    hapticFeedback.notificationOccurred("success")
  }, [])

  return (
    <ShowMainButton title="Continue" onClick={handleContinue}>
      <div className="flex flex-col px-4 py-5">
        <Img src="/success.webp" className="mx-auto mt-4 mb-3 size-28" alt="Rated" />
        <div className="mb-1 text-center font-semibold text-title-2">Rating Left!</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Your rating for the establishment has been successfully left!
        </div>

        <List title="Information">
          <ListItem
            className="py-3"
            leftIcon={<Icon name="Stars" className="size-6 text-transparent" />}
            leftTopText="Establishment Rating"
            leftBottomText="A high rating of an establishment helps to gain the trust of customers and rise in the list of recommendations"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftIcon={<Icon name="Bonus" className="size-6 text-transparent" />}
            leftTopText="Bonuses for Rating"
            leftBottomText="For rating establishments, users can receive bonus coins or participate in distributions from the application"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftIcon={<Icon name="Pencil" className="size-6 text-transparent" />}
            leftTopText="Correct Rating"
            leftBottomText="You can correct your rating at any time by paying 25 Telegram Stars"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
