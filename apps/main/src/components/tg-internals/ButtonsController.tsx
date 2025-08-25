import { useAtomValue } from "jotai"
import { memo } from "react"

import { isTmaEnvironmentAtom, mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"

import { BackButtonTMA } from "./BackButton"
import { MainButtonTMA } from "./MainButton"
import { SecondaryButtonTMA } from "./SecondaryButton"
// TODO: remove from bundle if isTma
import { WebButton } from "./WebButton"

export const ButtonsController = memo(() => {
  const isTma = useAtomValue(isTmaEnvironmentAtom)
  const mainProps = useAtomValue(mainButtonAtom)
  const secondaryProps = useAtomValue(secondaryButtonAtom)

  if (isTma && window.location.hostname !== "localhost") {
    return (
      <>
        <BackButtonTMA />

        <MainButtonTMA
          disabled={mainProps.disabled}
          hidden={mainProps.hidden}
          loading={mainProps.loading}
          onClick={mainProps.onClick}
          title={mainProps.title}
        />

        <SecondaryButtonTMA
          disabled={secondaryProps.disabled}
          hidden={secondaryProps.hidden}
          loading={secondaryProps.loading}
          onClick={secondaryProps.onClick}
          position={secondaryProps.position}
          title={secondaryProps.title}
        />
      </>
    )
  }

  return (
    <>
      <WebButton
        disabled={mainProps.disabled}
        hidden={mainProps.hidden}
        loading={mainProps.loading}
        onClick={mainProps.onClick}
        title={mainProps.title}
      />

      <WebButton
        disabled={secondaryProps.disabled}
        hidden={secondaryProps.hidden}
        isSecondary
        loading={secondaryProps.loading}
        onClick={secondaryProps.onClick}
        title={secondaryProps.title}
      />
    </>
  )
})
ButtonsController.displayName = "ButtonsController"
