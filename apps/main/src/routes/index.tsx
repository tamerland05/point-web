import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

const onboardingCompleted = true // skip onboarding flow
const isVerifiedEmloyee = true // can access to employee flow

export const Route = createFileRoute("/")({
	component: Index,
	beforeLoad: async () => {
		if (onboardingCompleted) throw redirect({ to: "/account" })
		if (isVerifiedEmloyee) throw redirect({ to: "/account" })

		throw redirect({ to: "/account" })
	},
})

function Index() {
	return <Outlet />
}
