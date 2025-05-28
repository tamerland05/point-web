import { MapboxMap } from "@/components/mapbox"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_withMenu/selections")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<MapboxMap />
		</div>
	)
}
