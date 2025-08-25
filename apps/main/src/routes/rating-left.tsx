import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import Img from "react-cool-img"
import { z } from "zod"

import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { showMenuAtom } from "@/atoms/ui"
import { ShowMainButton } from "@/components/tg-internals"

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
  const { placeId } = Route.useSearch()

  const establishmentQuery = useQuery(establishmentQueryOptions(placeId))

  const showMenu = useSetAtom(showMenuAtom)

  const handleContinue = async () => {
    if (placeId) {
      establishmentQuery.refetch()
      router.history.back()
    }
    establishmentQuery.refetch()
    navigate({ to: "/map" })
    showMenu(true)
  }

  useEffect(() => {
    hapticFeedback.notificationOccurred("success")
  }, [])

  return (
    <ShowMainButton onClick={handleContinue} title="Continue">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col px-4 py-5">
        <Img alt="Rated" className="mx-auto mt-4 mb-3 size-28" src="/success.webp" />
        <div className="mb-1 text-center font-semibold text-title-2">Rating Left!</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">
          Your rating for the establishment has been successfully left!
        </div>

        <List title="Information">
          <ListItem
            className="py-3"
            leftBottomText="A high rating of an establishment helps to gain the trust of customers and rise in the list of recommendations"
            leftIcon={<Icon className="size-6 text-transparent" name="Stars" />}
            leftTopText="Establishment Rating"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="For rating establishments, users can receive bonus coins or participate in distributions from the application"
            leftIcon={<Icon className="size-6 text-transparent" name="Bonus" />}
            leftTopText="Bonuses for Rating"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="You can correct your rating at any time by paying 25 Telegram Stars"
            leftIcon={<Icon className="size-6 text-transparent" name="Pencil" />}
            leftTopText="Correct Rating"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
