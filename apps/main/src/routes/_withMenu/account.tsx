import { onboardingCompletedAtom } from "@/atoms/user"
import { trimAddress } from "@/utils/trim-address"
import { LANGUAGES_LIST, useTranslation } from "@point/i18n"
import { authQueryOptions } from "@point/shared/api/point/auth"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { hapticFeedback, popup } from "@telegram-apps/sdk-react"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useSetAtom } from "jotai"
import Img from "react-cool-img"

export const Route = createFileRoute("/_withMenu/account")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context

    if (!context.launchParams?.tgWebAppData) {
      throw new Error("Нет данных от телеги, перезагрузите приложение")
    }

    queryClient.ensureQueryData(authQueryOptions(context.launchParams.tgWebAppData))
  },
})

function RouteComponent() {
  const [tc] = useTonConnectUI()
  const address = useTonAddress()
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const { i18n } = useTranslation()

  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom)

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams?.tgWebAppData!))
  const user = authQuery.data?.user

  const profileType = !user.employee ? "User" : "Employee"
  const language = LANGUAGES_LIST.find((l) => l.lang === (user.languageCode || i18n.language))?.name

  const handleGoToMyProfile = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/my-profile/view" })
  }

  const handleGoToProfileType = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/profile-type" })
  }

  const handleGoToLanguage = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/language" })
  }

  const handleGoToInformation = async () => {
    hapticFeedback.impactOccurred("light")

    setOnboardingCompleted(false)
    navigate({ to: "/onboarding", replace: true, viewTransition: { types: ["none"] } })
  }

  const handleClickWallet = async () => {
    hapticFeedback.impactOccurred("light")

    if (address || user.wallet) {
      const selected = await popup.show({
        title: "Connect a new wallet",
        message: "You can link a new wallet to receive tips and drops",
        buttons: [
          { type: "destructive", text: "GO", id: "go" },
          { type: "cancel", id: "cancel" },
        ],
      })

      if (selected === "cancel") return

      if (selected === "go") {
        if (address) await tc.disconnect()
        tc.modal.open()
      }

      return
    }

    tc.modal.open()
  }

  return (
    <div className="flex h-full flex-col justify-between pb-4">
      <header className="mb-7 flex flex-col items-center gap-2">
        <Img
          placeholder="/user-ph.svg"
          error="/user-ph.svg"
          src={user.employee?.photo || user.photoUrl}
          className="mb-2 size-24 rounded-full object-cover"
        />

        <h1 className="font-medium text-title-1">{user.employee?.name || user.name}</h1>
        <p className="text-caption-1 text-text-secondary">{profileType}</p>
      </header>

      <div className="flex w-full flex-col gap-7">
        <ListItem
          leftTopText={"My Profile"}
          leftIcon={<Icon name="Account0" className="h-7 w-7 text-transparent" />}
          rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
          onClick={handleGoToMyProfile}
        />

        <List>
          <ListItem
            leftTopText="Profile Type"
            leftIcon={<Icon name="Account1" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            withSeparator
            rightTopText={<div className="-mr-4 text-text-secondary">{profileType}</div>}
            onClick={handleGoToProfileType}
          />
          <ListItem
            leftTopText="Language"
            leftIcon={<Icon name="Account2" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            withSeparator
            rightTopText={<div className="-mr-4 text-text-secondary">{language}</div>}
            onClick={handleGoToLanguage}
          />
          <ListItem
            leftTopText="Information"
            leftIcon={<Icon name="Account3" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            onClick={handleGoToInformation}
          />
        </List>

        <ListItem
          leftTopText="Location"
          leftIcon={<Icon name="Account4" className="h-7 w-7 text-transparent" />}
          rightTopText={<div className="text-text-secondary">WIP</div>}
        />

        <List>
          <ListItem
            leftTopText="Wallet"
            leftIcon={<Icon name="Account5" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            withSeparator
            rightTopText={
              <div className="-mr-4 text-text-secondary">
                {user.wallet ? trimAddress(user.wallet, 4, 5) : "Not Connected"}
              </div>
            }
            onClick={handleClickWallet}
          />
          <ListItem
            leftTopText="Default Currency"
            leftIcon={<Icon name="Account6" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            withSeparator
            rightTopText={<div className="-mr-4 text-text-secondary">USD</div>}
          />
          <ListItem
            leftTopText="Contact Support"
            leftIcon={<Icon name="Account7" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
          />
        </List>
      </div>

      <code className="mt-auto flex flex-col items-center justify-center py-6 text-caption-3 text-text-secondary">
        <div>Point v{__APP_VERSION__} </div>
      </code>
    </div>
  )
}
