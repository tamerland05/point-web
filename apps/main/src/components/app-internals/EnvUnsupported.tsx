import { cn } from "@point/ui/cn"

export function EnvUnsupported() {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-background p-5 text-center font-sans text-text"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <img alt="Telegram sticker" className="mb-5 block h-36 w-36" src="https://xelene.me/telegram.gif" />
        <h1 className="mb-2 font-bold text-2xl">Oops</h1>
        <p className={cn("max-w-[300px] text-base text-text-secondary leading-snug")}>
          You are using too old Telegram client to run this application
        </p>
      </div>
    </div>
  )
}
