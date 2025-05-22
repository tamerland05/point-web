import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

export const authTokenAtom = atom<string | null>(null)

export const onboardingCompletedAtom = atomWithStorage<boolean>("@point/shared/onboardingCompleted", false, undefined, {
	getOnInit: true,
})

export const referrerAtom = atomWithStorage<string | null>("@point/shared/referrer", null, undefined, {
	getOnInit: true,
})
