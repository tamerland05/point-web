import { atomWithStorage } from "jotai/utils"

export const selectedLanguageAtom = atomWithStorage<string | undefined>(
  "@point/shared/selectedLanguage",
  undefined,
  undefined,
  {
    getOnInit: true,
  }
)
