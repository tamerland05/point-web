import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getDefaultStore } from "jotai"

import { parseStartParam } from "@/utils/parse-start-param"

import { onboardingCompletedAtom } from "../atoms/user"

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const { launchParams } = context
    parseStartParam(launchParams)

    const store = getDefaultStore()
    const onboardingCompleted = store.get(onboardingCompletedAtom)

    if (!onboardingCompleted) throw redirect({ replace: true, to: "/onboarding" })
    // if (isVerifiedEmloyee) throw redirect({ to: "/account" })

    throw redirect({ replace: true, to: "/account" })
  },
  component: Index,
})

function Index() {
  return <Outlet />
}
