import { memo, useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

import { hapticFeedback } from "@telegram-apps/sdk-react"

import { useTranslation } from "@point/i18n"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { FingerScanIcon } from "@point/ui/icons/finger-scan"
import { KeyboardDelIcon } from "@point/ui/icons/keyboard-del"

interface PincodeModalProps {
	mode: "set" | "get" | "decode" | "change"
	topLevelError: boolean
	isOpen: boolean
	setTopLevelError: (error: boolean) => void
	onPinComplete: (pin: string | null) => void
	onClose: () => void
}

export const PincodeModal = memo(
	({ mode, topLevelError, isOpen, setTopLevelError, onPinComplete, onClose }: PincodeModalProps) => {
		const { t } = useTranslation("wallet")

		const [pin, setPin] = useState("")
		const [firstPin, setFirstPin] = useState<string | null>(null)
		const [isConfirming, setIsConfirming] = useState(false)
		const [error, setError] = useState(false)

		const getTitle = () => {
			if (error || topLevelError) return t("PINCODE.WRONG")
			if (mode === "change") return t("PINCODE.CURRENT")
			if (isConfirming) return t("PINCODE.CONFIRM")

			return t("PINCODE.ENTER")
		}

		useEffect(() => {
			if (!error && !topLevelError) return

			hapticFeedback.notificationOccurred("error")

			const timer = setTimeout(() => {
				setError(false)
				setTopLevelError(false)
				setPin("")
			}, 700)

			return () => clearTimeout(timer)
		}, [error, topLevelError, setTopLevelError])

		useEffect(() => {
			if (pin.length !== 4) return

			const resetState = () => {
				setFirstPin(null)
				setIsConfirming(false)
				setPin("")
			}

			const handleSetMode = () => {
				if (!isConfirming) {
					setFirstPin(pin)
					setIsConfirming(true)
					setPin("")
				} else if (pin === firstPin) {
					onPinComplete(pin)
					resetState()
				} else {
					setError(true)
					resetState()
				}
			}

			const handleOtherModes = () => {
				onPinComplete(pin)
				setPin("")
			}

			if (mode === "set") {
				handleSetMode()
			} else {
				handleOtherModes()
			}
		}, [pin, mode, isConfirming, firstPin, onPinComplete])

		useEffect(() => {
			if (!isOpen) {
				// Reset state when modal is closed
				setPin("")
				setFirstPin(null)
				setIsConfirming(false)
				setError(false)
				setTopLevelError(false)
			}
		}, [isOpen, setTopLevelError])

		const handleNumberClick = useCallback(
			(number: number) => {
				hapticFeedback.impactOccurred("medium")
				if (pin.length < 4) {
					setPin((prevPin) => prevPin + number)
				}
			},
			[pin.length]
		)

		const handleDelete = useCallback(() => {
			hapticFeedback.impactOccurred("medium")
			setPin((prevPin) => prevPin.slice(0, -1))
		}, [])

		// Add keyboard event handler
		useEffect(() => {
			if (!isOpen) return

			const handleKeyPress = (event: KeyboardEvent) => {
				if (event.key >= "0" && event.key <= "9") {
					handleNumberClick(Number.parseInt(event.key, 10))
				} else if (event.key === "Backspace") {
					handleDelete()
				}
			}

			window.addEventListener("keydown", handleKeyPress)
			return () => {
				window.removeEventListener("keydown", handleKeyPress)
			}
		}, [isOpen, handleNumberClick, handleDelete])

		const handleFingerprint = () => {
			// TODO: Implement fingerprint logic here
			hapticFeedback.impactOccurred("medium")
			toast.error(t("ERRORS.COMING_SOON"))
		}

		return (
			<Drawer height="full" isOpen={isOpen} onClose={onClose}>
				<div className="flex h-full flex-col items-center justify-center bg-background p-4">
					<h1 className="mb-8 font-medium text-text text-title-1">{getTitle()}</h1>

					<div
						className={cn(
							"mb-8 flex w-48 justify-center rounded-xl bg-background-secondary px-16 py-3",
							error && "animate-shake",
							topLevelError && "animate-shake"
						)}
					>
						{[0, 1, 2, 3].map((key) => (
							<div key={key} className={cn(`p-2`)}>
								<div
									className={cn(
										`h-3 w-3 rounded-full bg-separator`,
										pin.length > key && "bg-accent",
										error && "bg-negative",
										topLevelError && "bg-negative"
									)}
								/>
							</div>
						))}
					</div>

					<div className="mt-12 grid grid-cols-3 gap-8">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
							<button
								key={number}
								className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-separator font-semibold text-2xl text-[36px] text-text"
								type="button"
								onClick={() => handleNumberClick(number)}
							>
								{number}
							</button>
						))}
						<button
							className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-separator disabled:opacity-50"
							disabled
							type="button"
							onClick={handleFingerprint}
						>
							<FingerScanIcon className="h-6 w-6 fill-none stroke-accent" />
						</button>
						<button
							className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-separator font-semibold text-2xl text-[36px] text-text"
							type="button"
							onClick={() => handleNumberClick(0)}
						>
							0
						</button>
						<button
							className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-separator"
							type="button"
							onClick={handleDelete}
						>
							<KeyboardDelIcon className="h-7 w-7 fill-accent" />
						</button>
					</div>
				</div>
			</Drawer>
		)
	}
)

PincodeModal.displayName = "PincodeModal"
