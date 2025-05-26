import { ShowMainButton } from "@/components/TelegramStuff"
import { createFileRoute } from "@tanstack/react-router"
import toast from "react-hot-toast"

export const Route = createFileRoute("/_withMenu/map")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<ShowMainButton
			secondary={{ title: "Open toast yee", onClick: () => toast("test secondary") }}
			title="Open toast"
			onClick={() => toast("test")}
		>
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
			Hello "/map"! <br />
		</ShowMainButton>
	)
}
