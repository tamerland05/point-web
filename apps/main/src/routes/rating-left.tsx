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
    <ShowMainButton onClick={handleContinue} title="Продолжить">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full flex-col px-4 py-5">
        <Img alt="Rated" className="mx-auto mt-4 mb-3 size-28" src="/success.webp" />
        <div className="mb-1 text-center font-semibold text-title-2">Оценка отправлена!</div>
        <div className="mx-10 mb-7 text-center text-text-secondary">Ваша оценка для заведения успешно сохранена.</div>

        <List title="Информация">
          <ListItem
            className="py-3"
            leftBottomText="Высокий рейтинг помогает заведению укреплять доверие гостей и подниматься в рекомендациях"
            leftIcon={<Icon className="size-6 text-transparent" name="Stars" />}
            leftTopText="Рейтинг заведения"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="За оценку заведений пользователи получают бонусные монеты и участвуют в распределениях приложения"
            leftIcon={<Icon className="size-6 text-transparent" name="Bonus" />}
            leftTopText="Бонусы за оценки"
            withSeparator
          />
          <ListItem
            className="py-3"
            leftBottomText="Оценку можно изменить в любой момент за 25 Telegram Stars"
            leftIcon={<Icon className="size-6 text-transparent" name="Pencil" />}
            leftTopText="Изменение оценки"
          />
        </List>
      </div>
    </ShowMainButton>
  )
}
