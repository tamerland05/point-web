import { onboardingCompletedAtom } from "@/atoms/user"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { getDefaultStore } from "jotai"

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    const store = getDefaultStore()
    const onboardingCompleted = store.get(onboardingCompletedAtom)

    if (!onboardingCompleted) throw redirect({ to: "/onboarding", replace: true })
    // if (isVerifiedEmloyee) throw redirect({ to: "/account" })

    throw redirect({ to: "/account", replace: true })
  },
})

function Index() {
  return <Outlet />
}
