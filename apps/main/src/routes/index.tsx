import { onboardingCompletedAtom } from "@/atoms/user"
import { parseStartParam } from "@/utils/parse-start-param"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { getDefaultStore } from "jotai"

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async ({ context }) => {
    const { launchParams } = context
    parseStartParam(launchParams)

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
