import { queryOptions } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { getDefaultStore } from "jotai"

import pointAxiosInstance from "@/api/point"
import { accessTokenAtom } from "@/atoms/user"
import type { JobPlace, PurposeOfFunding } from "@/types"

export interface AuthReq {
  hash: string
  referrerData?: string
  user?: {
    id: number
    firstName: string
    lastName?: string
    username?: string
    languageCode?: string
    photoUrl?: string
    isBot?: boolean
    isPremium?: boolean
    allowsWriteToPm?: boolean
  }
  initDataRaw?: string
}

export interface AuthDTO {
  user: {
    id: number
    tipsLeft: number
    bonusBalance: number
    name: string | null
    username: string | null
    languageCode: string | null
    photoUrl: string | null
    rank: number | null
    wallet: string | null

    employee: {
      id: string
      profession: string
      photo: string
      name: string
      firstName: string
      lastName: string
      jobPlace: JobPlace
      purpose: PurposeOfFunding | null
      meta: {
        showJob: boolean
        showPurpose: boolean
      }
    } | null

    meta: {
      showTipsLeft: boolean
    }
  }
  accessToken: string
}

// const MOCK_EMPLOYEE_DATA = {
//   user: {
//     id: "1",
//     firstName: "John",
//     lastName: "Doe",
//     username: "john.doe",
//     languageCode: "en",
//     photoUrl: "https://placehold.co/150",
//     rank: 1,
//     wallet: "1000",
//     employee: {
//       id: "1",
//       profession: "Software Engineer",
//       jobPlace: {
//         name: "Google",
//         address: "123 Main St, Anytown, USA",
//         id: "1",
//       },
//       purpose: {
//         title: "LeetCode",
//         description: "LeetCode is a platform for coding interviews.",
//         icon: "https://placehold.co/150",
//       },
//       meta: {
//         showJob: true,
//         showPurpose: true,
//       },
//     },
//     meta: {
//       showTipsLeft: true,
//     },
//   },
// }

export const authQueryOptions = (auth: AuthReq, initDataRaw: string | undefined) =>
  queryOptions({
    queryKey: ["auth", { hash: auth.hash }],
    queryFn: async () => {
      const response = await pointAxiosInstance.post<AuthDTO, AxiosResponse<AuthDTO>, AuthReq>("/point/account/auth", {
        ...auth,
        initDataRaw,
      })

      const store = getDefaultStore()

      store.set(accessTokenAtom, response.data.accessToken)

      return response.data
    },
  })
