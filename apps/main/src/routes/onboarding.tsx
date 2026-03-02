import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { hapticFeedback } from "@telegram-apps/sdk-react"
import { getDefaultStore, useSetAtom } from "jotai"
import { useMemo } from "react"
import z from "zod"

import { invitationQueryOptions } from "@point/shared/api/point/employee"
import { cn } from "@point/ui/cn"
import { Icon } from "@point/ui/icon"

import { ShowMainButton } from "@/components/tg-internals"

import { onboardingCompletedAtom } from "../atoms/user"

const steps = {
  1: {
    description: "Leave and receive crypto tip using Telegram",
    icon: "TON",
    title: "Telegram Tip",
  },
  2: {
    description: "Find the best establishments with the best staff near you",
    icon: "World",
    title: "Food Near You",
  },
  3: {
    description: "Transparent rating of establishments for Telegram Stars",
    icon: "Stars",
    title: "Star Rating",
  },
  4: {
    description: "Game mechanics and bonuses for tips left behind",
    icon: "Caesar",
    title: "Tip Rewards",
  },
} as const

const onboardingSchema = z.object({
  step: z.enum(["1", "2", "3", "4"]).default("1"),
})

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    const store = getDefaultStore()
    const onboardingCompleted = store.get(onboardingCompletedAtom)

    if (onboardingCompleted) {
      throw redirect({ to: "/" })
    }
  },
  component: RouteComponent,
  validateSearch: zodValidator(onboardingSchema),
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
        navigate({ replace: true, to: "/" })
      } else {
        navigate({ search: { step: nextStep }, to: "/onboarding" })
      }
    }

    return {
      disabled: false,
      hidden: false,
      loading: false,
      onClick,
      title: "Confirm",
    }
  }, [navigate, setOnboardingCompleted, step])

  const secondaryButtonConfig = useMemo(
    () => ({
      // TODO: if user.employee -  hide
      hidden: isError || !isSuccess,
      onClick: () => {
        setOnboardingCompleted(true)
        navigate({ search: { fromOnboarding: true, step: "account" }, to: "/account/my-profile/edit" })
      },
      position: "bottom" as const,
      title: "Employee Account",
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
          <Icon className="mb-10 size-24 text-transparent" name={steps[step].icon} />
          <h1 className="mb-1 text-center font-semibold text-title-2">{steps[step].title}</h1>
          <p className="line-clamp-2 text-center text-base text-text-secondary">{steps[step].description}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 [view-transition-name:warp]">
          {Object.keys(steps).map((key) => (
            <div
              className={cn("h-2 w-2 rounded-full bg-text-secondary", {
                "bg-accent": key === step,
              })}
              key={key}
            />
          ))}
        </div>
      </div>
    </ShowMainButton>
  )
}
