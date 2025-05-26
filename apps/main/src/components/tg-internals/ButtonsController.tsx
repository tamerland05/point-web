import { mainButtonAtom, secondaryButtonAtom } from "@/atoms/ui"
import { isTmaEnvironmentAtom } from "@/atoms/ui"
import { useAtomValue } from "jotai"
import { memo } from "react"
import { MainButtonTMA } from "./MainButton"
import { SecondaryButtonTMA } from "./SecondaryButton"

import { BackButtonTMA } from "./BackButton"
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
					title={mainProps.title}
					onClick={mainProps.onClick}
				/>

				<SecondaryButtonTMA
					disabled={secondaryProps.disabled}
					hidden={secondaryProps.hidden}
					loading={secondaryProps.loading}
					title={secondaryProps.title}
					onClick={secondaryProps.onClick}
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
				title={mainProps.title}
				onClick={mainProps.onClick}
			/>

			<WebButton
				disabled={secondaryProps.disabled}
				hidden={secondaryProps.hidden}
				isSecondary
				loading={secondaryProps.loading}
				title={secondaryProps.title}
				onClick={secondaryProps.onClick}
			/>
		</>
	)
})
ButtonsController.displayName = "ButtonsController"
