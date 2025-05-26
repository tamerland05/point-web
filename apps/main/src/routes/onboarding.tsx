import { ShowMainButton } from "@/components/tg-internals"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import toast from "react-hot-toast"

export const Route = createFileRoute("/onboarding")({
	component: RouteComponent,
})

// Example data for rendering list cells
// const cellsTexts = ["Chat Settings", "Data and Storage", "Devices"]

function RouteComponent() {
	const [mainButtonText, setMainButtonText] = useState("Egor")
	const [secondaryButtonText, setSecondaryButtonText] = useState("Sidorov")

	const [mainButtonLoading, setMainButtonLoading] = useState(false)
	const [secondaryButtonLoading, setSecondaryButtonLoading] = useState(false)

	const [mainButtonDisabled, setMainButtonDisabled] = useState(false)
	const [secondaryButtonDisabled, setSecondaryButtonDisabled] = useState(false)

	const [mainButtonHidden, setMainButtonHidden] = useState(true)
	const [secondaryButtonHidden, setSecondaryButtonHidden] = useState(true)

	const secondaryButtonConfig = {
		title: secondaryButtonText,
		loading: secondaryButtonLoading,
		disabled: secondaryButtonDisabled,
		hidden: secondaryButtonHidden,
		onClick: () => toast("secondary button clicked"),
	}

	const mainButtonConfig = {
		title: mainButtonText,
		loading: mainButtonLoading,
		disabled: mainButtonDisabled,
		hidden: mainButtonHidden,
		onClick: () => toast("main button clicked"),
	}

	return (
		<ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
			Onboarding with buttons testing
			<hr />
			<div className="grid grid-cols-2 gap-4 p-4">
				{/* Main Button Controls */}
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<h2 className="font-semibold text-lg">Main Button</h2>
					<div>
						<label htmlFor="mainButtonText" className="mb-1 block font-medium text-sm">
							Text
						</label>
						<input
							id="mainButtonText"
							className="w-full rounded-md border border-gray-300 p-2"
							type="text"
							value={mainButtonText}
							onChange={(e) => setMainButtonText(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="mainButtonLoading"
							type="checkbox"
							checked={mainButtonLoading}
							onChange={(e) => setMainButtonLoading(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="mainButtonLoading" className="font-medium text-sm">
							Loading
						</label>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="mainButtonDisabled"
							type="checkbox"
							checked={mainButtonDisabled}
							onChange={(e) => setMainButtonDisabled(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="mainButtonDisabled" className="font-medium text-sm">
							Disabled
						</label>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="mainButtonHidden"
							type="checkbox"
							checked={mainButtonHidden}
							onChange={(e) => setMainButtonHidden(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="mainButtonHidden" className="font-medium text-sm">
							Hidden
						</label>
					</div>
				</div>

				{/* Secondary Button Controls */}
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<h2 className="font-semibold text-lg">Secondary Button</h2>
					<div>
						<label htmlFor="secondaryButtonText" className="mb-1 block font-medium text-sm">
							Text
						</label>
						<input
							id="secondaryButtonText"
							className="w-full rounded-md border border-gray-300 p-2"
							type="text"
							value={secondaryButtonText}
							onChange={(e) => setSecondaryButtonText(e.target.value)}
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="secondaryButtonLoading"
							type="checkbox"
							checked={secondaryButtonLoading}
							onChange={(e) => setSecondaryButtonLoading(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="secondaryButtonLoading" className="font-medium text-sm">
							Loading
						</label>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="secondaryButtonDisabled"
							type="checkbox"
							checked={secondaryButtonDisabled}
							onChange={(e) => setSecondaryButtonDisabled(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="secondaryButtonDisabled" className="font-medium text-sm">
							Disabled
						</label>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="secondaryButtonHidden"
							type="checkbox"
							checked={secondaryButtonHidden}
							onChange={(e) => setSecondaryButtonHidden(e.target.checked)}
							className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label htmlFor="secondaryButtonHidden" className="font-medium text-sm">
							Hidden
						</label>
					</div>
				</div>
			</div>
		</ShowMainButton>
	)
}
