import { useEffect } from "react"

import { useLaunchParams } from "@telegram-apps/sdk-react"
import { useAtom } from "jotai"

import { useTranslation } from "@point/i18n"
import { selectedLanguageAtom } from "@point/shared/atoms/ui"

export const GetLanguageData = () => {
	const { t: _t, i18n } = useTranslation()
	const lp = useLaunchParams(true)

	const [language, setLanguage] = useAtom(selectedLanguageAtom)

	// biome-ignore lint/correctness/useExhaustiveDependencies: мне нужно чтобы юзэффект отрабатывал только на маунте
	useEffect(() => {
		const userLanguage = language || lp.tgWebAppData?.user?.languageCode

		if (userLanguage) {
			for (const lang of i18n.languages) {
				if (userLanguage === lang) {
					i18n.reloadResources([lang]).then(() => i18n.changeLanguage(lang))
				}
			}
		}
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: мне нужно чтобы юзэффект отрабатывал только на маунте при инициализации i18n
	useEffect(() => {
		if (!i18n.isInitialized) return

		i18n.on("languageChanged", (lang) => {
			document.documentElement.setAttribute("lang", lang)
			setLanguage(i18n.language)
		})

		return () => {
			i18n.off("languageChanged")
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [i18n.isInitialized])

	return null
}
