import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { getDefaultStore, useSetAtom } from "jotai"
import z from "zod"

import { onboardingCompletedAtom } from "@/atoms/user"
import { ShowMainButton } from "@/components/tg-internals"
import { invitationQueryOptions } from "@point/shared/api/point/employee"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"
import { useQuery } from "@tanstack/react-query"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { useMemo } from "react"

const steps = {
  1: {
    title: "Telegram Tip",
    description: "Leave and receive crypto tip using Telegram",
    icon: "TON",
  },
  2: {
    title: "Food Near You",
    description: "Find the best establishments with the best staff near you",
    icon: "World",
  },
  3: {
    title: "Star Rating",
    description: "Transparent rating of establishments for Telegram Stars",
    icon: "Stars",
  },
  4: {
    title: "Tip Rewards",
    description: "Game mechanics and bonuses for tips left behind",
    icon: "Caesar",
  },
} as const

const onboardingSchema = z.object({
  step: z.enum(["1", "2", "3", "4"]).default("1"),
})

export const Route = createFileRoute("/onboarding")({
  component: RouteComponent,
  validateSearch: zodValidator(onboardingSchema),
  beforeLoad: () => {
    const store = getDefaultStore()
    const onboardingCompleted = store.get(onboardingCompletedAtom)

    if (onboardingCompleted) {
      throw redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const { step } = Route.useSearch()
  const setOnboardingCompleted = useSetAtom(onboardingCompletedAtom)

  const invitationQuery = useQuery(invitationQueryOptions)
  const { isError, isSuccess } = invitationQuery

  const mainButtonConfig = useMemo(() => {
    const onClick = () => {
      hapticFeedback.impactOccurred("light")
      const totalSteps = Object.keys(steps).length
      const totalStepsString = String(totalSteps)

      const nextStep = String(Number(step) + 1) as "1" | "2" | "3" | "4"

      if (step === totalStepsString) {
        setOnboardingCompleted(true)
        navigate({ to: "/", replace: true })
      } else {
        navigate({ to: "/onboarding", search: { step: nextStep } })
      }
    }

    return {
      title: "Confirm",
      loading: false,
      disabled: false,
      hidden: false,
      onClick,
    }
  }, [navigate, setOnboardingCompleted, step])

  const secondaryButtonConfig = useMemo(
    () => ({
      title: "Employee Account",
      position: "bottom" as const,
      // TODO: if user.employee -  hide
      hidden: isError || !isSuccess,
      onClick: () => {
        setOnboardingCompleted(true)
        navigate({ to: "/account/my-profile/edit", search: { step: "account", fromOnboarding: true } })
      },
    }),
    [setOnboardingCompleted, navigate, isError, isSuccess]
  )

  return (
    <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
      <div
        className={cn("-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full bg-background px-12 py-6", {
          "[view-transition-name:main-content]": step !== "4",
        })}
      >
        <div className="flex flex-col items-center bg-background">
          <Icon name={steps[step].icon} className="mb-10 size-24 text-transparent" />
          <h1 className="mb-1 text-center font-semibold text-title-2">{steps[step].title}</h1>
          <p className="line-clamp-2 text-center text-base text-text-secondary">{steps[step].description}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 [view-transition-name:warp]">
          {Object.keys(steps).map((key) => (
            <div
              key={key}
              className={cn("h-2 w-2 rounded-full bg-text-secondary", {
                "bg-accent": key === step,
              })}
            />
          ))}
        </div>
      </div>
    </ShowMainButton>
  )
}
