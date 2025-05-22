import { useCallback, useState } from "react"
import toast from "react-hot-toast"

import { useTranslation } from "@point/i18n"
import { decodePrivateKeyByPin, useTonWallet, useTonWallets } from "@point/sdk"

import { PincodeModal } from "./PincodeModal"

export type ModalMode = "set" | "get" | "decode" | "change"

export const usePincodeModal = (initialMode: ModalMode = "get") => {
	const { t } = useTranslation("wallet")
	const [isOpen, setIsOpen] = useState(false)
	const [mode, setMode] = useState<ModalMode>(initialMode)
	const [resolvePromise, setResolvePromise] = useState<((value: string | string[] | null) => void) | null>(null)
	const [error, setError] = useState(false)

	const activeWallet = useTonWallet()
	const { list } = useTonWallets()

	const promptPincode = useCallback(<T extends ModalMode>(modeOverride?: T) => {
		if (modeOverride) setMode(modeOverride)
		setIsOpen(true)

		return new Promise<T extends "decode" ? string[] | null : string | null>((resolve) => {
			setResolvePromise(() => resolve)
		})
	}, [])

	const handlePinComplete = useCallback(
		async (pin: string | null) => {
			if (!pin) {
				setIsOpen(false)
				if (resolvePromise) {
					resolvePromise(null)
					setResolvePromise(null)
				}
				return
			}

			if (mode === "decode") {
				if (!activeWallet) {
					return // TODO THROW ERROR
				}

				let mnemonic: string[]

				try {
					mnemonic = await decodePrivateKeyByPin(activeWallet.encodedMnemonics, pin)

					if (resolvePromise) {
						resolvePromise(mnemonic)
						setResolvePromise(null)
					}
					setIsOpen(false)
				} catch (err) {
					console.error("Error unhashing or sending:", err)
					setError(true)
				}
			} else if (mode === "get" || mode === "change") {
				// NOTE: берем первый, так как по дефолту общий пароль для всех
				// также пока не будет "set" хоть раз (list[0]), "get" не будет работать
				if (!list?.[0]) {
					return
				}

				try {
					// NOTE: вызов исключительно для проверки, если пинкод неверный, то будет ошибка
					await decodePrivateKeyByPin(list[0].encodedMnemonics, pin)

					if (resolvePromise) {
						resolvePromise(pin)
						setResolvePromise(null)
					}

					setIsOpen(false)
				} catch (err) {
					console.error("Error unhashing or sending:", err)
					setError(true)
				}
			} else {
				if (resolvePromise) {
					resolvePromise(pin)
					setResolvePromise(null)
				}
				setIsOpen(false)
			}
		},
		[mode, resolvePromise, activeWallet, list]
	)

	const handleClose = useCallback(() => {
		if (mode === "set") {
			toast.error(t("PINCODE.REQUIRED"), { id: "pincode-required" })
			return
		}
		handlePinComplete(null)
	}, [handlePinComplete, mode, t])

	const PincodeModalComponent = (
		<PincodeModal
			isOpen={isOpen}
			mode={mode}
			setTopLevelError={setError}
			topLevelError={error}
			onClose={handleClose}
			onPinComplete={handlePinComplete}
		/>
	)

	return { promptPincode, PincodeModalComponent, setMode }
}
