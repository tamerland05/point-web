import { atomWithStorage } from "jotai/utils"

export const onboardingCompletedAtom = atomWithStorage<boolean>("@point/main/onboardingCompleted", false, undefined, {
  getOnInit: true,
})
