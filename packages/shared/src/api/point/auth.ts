import type { AxiosResponse } from "axios"
import type { JobPlace, PurposeOfFunding } from "@/types"

import { queryOptions } from "@tanstack/react-query"
import { getDefaultStore } from "jotai"

import pointAxiosInstance from "@/api/point"

import { accessTokenAtom, referrerAtom } from "../../atoms/user"

export interface AuthReq {
  hash: string
  referrerId?: number
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

interface AuthDTO {
  user: {
    id: number
    tipsLeft: number
    bonusBalance: number
    tasksBonusBalance: number
    tipsBonusBalance: number
    referralsBonusBalance: number
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

export const authQueryOptions = (auth: AuthReq, initDataRaw: string | undefined) =>
  queryOptions({
    queryFn: async () => {
      const store = getDefaultStore()
      const referrerId = store.get(referrerAtom) ? Number(store.get(referrerAtom)) : undefined
      const payload: AuthReq = {
        ...auth,
        initDataRaw,
        referrerId: Number.isNaN(referrerId) ? undefined : referrerId,
      }

      const response = await pointAxiosInstance.post<AuthDTO, AxiosResponse<AuthDTO>, AuthReq>(
        "/point/account/auth",
        payload
      )
      const data = response.data

      store.set(accessTokenAtom, data.accessToken)
      return data
    },
    queryKey: ["auth", { hash: auth.hash }],
  })
