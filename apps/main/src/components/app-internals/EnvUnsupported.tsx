import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"

export function EnvUnsupported() {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background p-5 text-center font-sans text-text"
      )}
    >
      <div className="flex max-w-[340px] flex-col items-center justify-center">
        <img alt={t("SYSTEM.STICKER_ALT")} className="mb-5 block h-36 w-36" src="https://xelene.me/telegram.gif" />
        <h1 className="mb-2 font-bold text-2xl">{t("ENV_UNSUPPORTED.TITLE")}</h1>
        <p className={cn("max-w-[300px] text-base text-text-secondary leading-snug")}>
          {t("ENV_UNSUPPORTED.DESCRIPTION")}
        </p>
      </div>
    </div>
  )
}
