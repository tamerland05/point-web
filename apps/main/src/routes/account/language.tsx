import { createFileRoute, useRouter } from "@tanstack/react-router"
import toast from "react-hot-toast"

import { LANGUAGES_LIST, useTranslation } from "@point/i18n"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

export const Route = createFileRoute("/account/language")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const { i18n } = useTranslation()

  const selectLanguage = (lang: string) => {
    // TODO: change language
    toast("Work in progress")
    i18n.changeLanguage(lang)
    router.history.back()
  }

  return (
    <div className="p-4">
      <List title="Language">
        {LANGUAGES_LIST.map((lang) => (
          <ListItem
            key={lang.lang}
            leftBottomText={lang.example}
            leftTopText={lang.name}
            onClick={() => selectLanguage(lang.lang)}
            rightIcon={
              i18n.language === lang.lang ? <Icon className="h-5 w-5 text-transparent" name="TickCircle" /> : undefined
            }
            withSeparator
          />
        ))}
      </List>
    </div>
  )
}
