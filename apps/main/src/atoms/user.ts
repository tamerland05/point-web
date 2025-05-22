import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

export const authTokenAtom = atom<string | null>(null)

export const onboardingCompletedAtom = atomWithStorage<boolean>("@point/main/onboardingCompleted", false, undefined, {
	getOnInit: true,
})

export const referrerAtom = atomWithStorage<string | null>("@point/main/referrer", null, undefined, {
	getOnInit: true,
})

export const isWalletMigrationFinishedAtom = atomWithStorage<boolean>(
	"@point/main/isWalletMigrationFinished",
	false,
	undefined,
	{
		getOnInit: true,
	}
)
