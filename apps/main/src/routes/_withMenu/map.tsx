import { MapController } from "@/components/map/controller"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/map")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<MapController />
		</div>
	)
}
