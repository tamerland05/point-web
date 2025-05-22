import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

const onboardingCompleted = true // skip onboarding flow
const isVerifiedEmloyee = true // can access to employee flow

export const Route = createFileRoute("/")({
	component: Index,
	loader: async () => {
		if (onboardingCompleted) return redirect({ to: "/map" })
		if (isVerifiedEmloyee) return redirect({ to: "/map" })

		return redirect({ to: "/map" })
	},
})

function Index() {
	return <Outlet />
}
