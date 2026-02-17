import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { hapticFeedback, popup } from "@telegram-apps/sdk-react"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useSetAtom } from "jotai"
import Img from "react-cool-img"

import { authQueryOptions } from "@point/shared/api/point/auth"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { trimAddress } from "@/utils/trim-address"

import { onboardingCompletedAtom } from "../../atoms/user"

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

function RouteComponent() {
  const [tc] = useTonConnectUI()
  const address = useTonAddress()
  const ctx = Route.useRouteContext()
  const navigate = Route.useNavigate()

  // const { i18n } = useTranslation()

  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom)

  // biome-ignore lint/style/noNonNullAssertion: we have check in loader
  const authQuery = useSuspenseQuery(authQueryOptions(ctx.launchParams!.tgWebAppData!, ctx.initDataRaw!))
  const user = authQuery.data?.user

  const profileType = !user.employee ? "User" : "Employee"
  // const language = LANGUAGES_LIST.find((l) => l.lang === (user.languageCode || i18n.language))?.name

  const handleGoToMyProfile = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/my-profile/view" })
  }

  const handleGoToProfileType = () => {
    hapticFeedback.impactOccurred("light")
    navigate({ to: "/account/profile-type" })
  }

  // const handleGoToLanguage = () => {
  //   hapticFeedback.impactOccurred("light")
  //   navigate({ to: "/account/language" })
  // }

  const handleGoToInformation = async () => {
    hapticFeedback.impactOccurred("light")

    setOnboardingCompleted(false)
    navigate({ replace: true, to: "/onboarding", viewTransition: { types: ["none"] } })
  }

  const handleClickWallet = async () => {
    hapticFeedback.impactOccurred("light")

    if (address || user.wallet) {
      const selected = await popup.show({
        buttons: [
          { id: "go", text: "GO", type: "destructive" },
          { id: "cancel", type: "cancel" },
        ],
        message: "You can link a new wallet to receive tips and drops",
        title: "Connect a new wallet",
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
          className="mb-2 size-24 rounded-full object-cover"
          error="/user-ph.svg"
          placeholder="/user-ph.svg"
          src={user.employee?.photo || user.photoUrl}
        />

        <h1 className="font-medium text-title-1">{user.employee?.name || user.name}</h1>
        <p className="text-caption-1 text-text-secondary">{profileType}</p>
      </header>

      <div className="flex w-full flex-col gap-7">
        <ListItem
          leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account0" />}
          leftTopText={"My Profile"}
          onClick={handleGoToMyProfile}
          rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
        />

        <List>
          <ListItem
            leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account1" />}
            leftTopText="Profile Type"
            onClick={handleGoToProfileType}
            rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
            rightTopText={<div className="-mr-4 text-text-secondary">{profileType}</div>}
            withSeparator
          />
          {/* <ListItem
            leftTopText="Language"
            leftIcon={<Icon name="Account2" className="h-7 w-7 text-transparent" />}
            rightIcon={<Icon name="ChevronRight" className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
            withSeparator
            rightTopText={<div className="-mr-4 text-text-secondary">{language}</div>}
            onClick={handleGoToLanguage}
          /> */}
          <ListItem
            leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account3" />}
            leftTopText="Information"
            onClick={handleGoToInformation}
            rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
          />
        </List>

        {/* <ListItem
          leftTopText="Location"
          leftIcon={<Icon name="Account4" className="h-7 w-7 text-transparent" />}
          rightTopText={<div className="text-text-secondary">WIP</div>}
        /> */}

        <List>
          <ListItem
            leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account5" />}
            leftTopText="Wallet"
            onClick={handleClickWallet}
            rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
            rightTopText={
              <div className="-mr-4 text-text-secondary">
                {user.wallet ? trimAddress(user.wallet, 4, 5) : "Not Connected"}
              </div>
            }
            withSeparator
          />
          <ListItem
            leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account6" />}
            leftTopText="Default Currency"
            rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
            rightTopText={<div className="-mr-4 text-text-secondary">USD</div>}
            withSeparator
          />
          <ListItem
            leftIcon={<Icon className="h-7 w-7 text-transparent" name="Account7" />}
            leftTopText="Contact Support"
            rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name="ChevronRight" />}
          />
        </List>
      </div>

      <code className="mt-auto flex flex-col items-center justify-center py-6 text-caption-3 text-text-secondary">
        <div>Point v{__APP_VERSION__} </div>
      </code>
    </div>
  )
}
