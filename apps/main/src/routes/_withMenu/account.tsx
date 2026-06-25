import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useSetAtom } from "jotai"
import Img from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"

import { onboardingCompletedAtom } from "../../atoms/user"
import { accountAssets } from "../../components/account/accountAssets"
import { AccountMenuItem, AccountMenuList } from "../../components/account/accountListUi"

export const Route = createFileRoute("/_withMenu/account")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData || !context.initDataRaw) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData, context.initDataRaw))
  },
})

const menuChevron = <img alt="" className="h-[11px] w-[6px] shrink-0" src={accountAssets.chevron} />

const menuIcon = (src: string) => <img alt="" className="size-[30px] shrink-0" src={src} />

function RouteComponent() {
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom)

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const user = authQuery.data?.user

  const profileType = "Эксперт"

  const handleGoToMyProfile = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/my-profile/view" })
  }

  const handleGoToHistory = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/history" })
  }

  const handleGoToScanner = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/qr/scan" })
  }

  const handleGoToNotifications = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/notifications" })
  }

  const handleGoToLanguage = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/language" })
  }

  const handleGoToInformation = async () => {
    hapticFeedback.impactOccurred("light")

    setOnboardingCompleted(false)
    navigate({ replace: true, to: "/onboarding", viewTransition: { types: ["none"] } })
  }

  const handleGoToPaymentSystem = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/payment-system/details" })
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="rounded-2xl bg-white pl-4">
        <div className="flex items-center gap-4 py-3 pr-4">
          <Img
            className="size-12 rounded-full border border-black/[0.05] object-cover"
            error="/user-ph.svg"
            placeholder="/user-ph.svg"
            src={user.employee?.photo || user.photoUrl}
          />

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-medium text-[17px] text-text leading-normal">
              {user.employee?.name || user.name}
            </h1>
            <div className="mt-0.5 flex items-center gap-1">
              <img alt="" className="h-3 w-[15px]" src={accountAssets.expertThumb} />
              <p className="text-[15px] text-text-secondary leading-normal">{profileType}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="shrink-0" onClick={handleGoToScanner} type="button">
              <img alt="Сканер" className="size-11" src={accountAssets.actionScanner} />
            </button>
            <button className="shrink-0" onClick={handleGoToNotifications} type="button">
              <img alt="Уведомления" className="size-11" src={accountAssets.actionBell} />
            </button>
          </div>
        </div>
      </div>

      <AccountMenuList>
        <AccountMenuItem
          label="Мой профиль"
          leftIcon={menuIcon(accountAssets.menuMyProfile)}
          onClick={handleGoToMyProfile}
          rightIcon={menuChevron}
          withSeparator
        />
        <AccountMenuItem
          label="История заказов"
          leftIcon={menuIcon(accountAssets.menuHistory)}
          onClick={handleGoToHistory}
          rightIcon={menuChevron}
        />
      </AccountMenuList>

      <AccountMenuList>
        <AccountMenuItem
          label="Язык"
          leftIcon={menuIcon(accountAssets.menuLanguage)}
          onClick={handleGoToLanguage}
          rightIcon={menuChevron}
          withSeparator
        />
        <AccountMenuItem
          label="Система оплаты"
          leftIcon={menuIcon(accountAssets.menuPayment)}
          onClick={handleGoToPaymentSystem}
          rightIcon={menuChevron}
        />
      </AccountMenuList>

      <AccountMenuList>
        <AccountMenuItem
          label="Поддержка"
          leftIcon={menuIcon(accountAssets.menuSupport)}
          rightIcon={menuChevron}
          withSeparator
        />
        <AccountMenuItem
          label="Для бизнеса"
          leftIcon={menuIcon(accountAssets.menuBusiness)}
          onClick={handleGoToInformation}
          rightIcon={menuChevron}
          withSeparator
        />
        <AccountMenuItem
          label="Информация"
          leftIcon={menuIcon(accountAssets.menuInfo)}
          onClick={handleGoToInformation}
          rightIcon={menuChevron}
        />
      </AccountMenuList>
    </div>
  )
}
