import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { accessTokenAtom } from "@/atoms/user"
import type { JobPlace, PurposeOfFunding } from "@/types"
import type { AxiosResponse } from "axios"
import { getDefaultStore } from "jotai"

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
}

export interface AuthDTO {
  user: {
    id: number
    firstName: string
    lastName: string
    username: string
    languageCode: string
    photoUrl: string
    isBot: boolean
    isPremium: boolean
    allowsWriteToPm: boolean
    rank: number
    bonusBalance: number
    userType: "employee" | "consumer"
    typsLeft: number
    account: {
      id: string
      jobPlace: JobPlace | null
      purpose: PurposeOfFunding | null
      meta: {
        showJob: boolean
        showPurpose: boolean
      }
    }
  }
  accessToken: string
}

export const authQueryOptions = (auth: AuthReq) =>
  queryOptions({
    queryKey: ["auth", { hash: auth.hash }],
    queryFn: async () => {
      const response = await pointAxiosInstance.post<AuthDTO, AxiosResponse<AuthDTO>, AuthReq>("/point/user/auth", auth)

      const store = getDefaultStore()
      store.set(accessTokenAtom, response.data.accessToken)

      return response.data
    },
  })
