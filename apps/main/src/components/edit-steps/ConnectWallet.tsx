import { Icon } from "@point/ui/icon"
import { useNavigate } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"
import { useCallback, useEffect, useMemo } from "react"
import { ShowMainButton } from "../tg-internals"

export const ConnectWalletStep = () => {
  const [tc] = useTonConnectUI()
  const address = useTonAddress()
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (address) {
      navigate({ to: "/account/profile-created" })
    }
  }, [address])

  const handleConnectWallet = useCallback(async () => {
    await tc.modal.open()
  }, [tc.modal.open])

  const mainButtonConfig = useMemo(() => {
    return {
      title: "Connect Wallet",
      loading: false,
      disabled: false,
      hidden: false,
      onClick: handleConnectWallet,
    }
  }, [handleConnectWallet])

  const secondaryButtonConfig = useMemo(
    () => ({
      title: "Detailed Manual",
      position: "bottom" as const,
      // TODO: if user.employee -  hide
      hidden: false,
      onClick: () => openTelegramLink("https://t.me/samvuoto?text=`ICANTUSEWALLET2025`"),
    }),
    []
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div className={"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-18 py-6"}>
        <div className="justify-cente flex flex-col items-center bg-background">
          <Icon name={"User"} className="mb-10 size-24 text-transparent" />
          <h1 className="mb-1 text-center font-semibold text-title-2">Connect Wallet</h1>
          <p className="text-center text-base text-text-secondary">
            Connect your TON wallet, which will receive your clients' tips
          </p>
        </div>
      </div>
    </ShowMainButton>
  )
}
