import { createFileRoute } from "@tanstack/react-router"
import { AppRoot, Cell, List, Section, Select } from "@telegram-apps/telegram-ui"

export const Route = createFileRoute("/onboarding")({
	component: RouteComponent,
})

// Example data for rendering list cells
const cellsTexts = ["Chat Settings", "Data and Storage", "Devices"]

function RouteComponent() {
	return (
		<AppRoot>
			{/* List component to display a collection of items */}
			<List>
				{/* Section component to group items within the list */}
				<Section header="Header for the section" footer="Footer for the section">
					{/* Mapping through the cells data to render Cell components */}
					{cellsTexts.map((cellText, index) => (
						<Cell key={index}>{cellText}</Cell>
					))}
				</Section>
			</List>

			<Select header="Select" placeholder="I am usual input, just leave me alone">
				<option>Hello</option>
				<option>Okay</option>
			</Select>
		</AppRoot>
	)
}
