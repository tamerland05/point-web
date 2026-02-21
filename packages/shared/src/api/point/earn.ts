import type { JobPlace, PurposeOfFunding } from "@/types"

import { queryOptions } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"

export interface ReferralDTO {
  name: string
  referralsBonusBalance: number
  photoUrl: string
}

interface PageReferralDTO {
  items: ReferralDTO[]
  total?: number | null
  page: number | null
  size: number | null
  pages?: number | null
}

export const referralsQueryOptions = (page = 1, size = 10) =>
  queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.get<PageReferralDTO>("/point/earn/referrals", {
        params: { page, size },
      })
      return response.data
    },
    queryKey: ["earn", "referrals", page, size],
    staleTime: Number.POSITIVE_INFINITY,
  })

interface EmployeePublicDTO {
  id: string
  profession: string
  photo: string
  name: string
  jobPlace?: JobPlace | null
  purpose?: PurposeOfFunding | null
}

export interface UserPublicDTO {
  id: number
  photoUrl?: string | null
  name: string
  username: string
  rank: number
  bonusBalance: number
  tipsLeft?: string | null
  employee?: EmployeePublicDTO | null
}

export const earnTopQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()
    const response = await pointAxiosInstance.get<UserPublicDTO[]>("/point/earn/top")
    return response.data
  },
  queryKey: ["earn", "top"],
  staleTime: Number.POSITIVE_INFINITY,
})

export interface TaskDTO {
  id: string
  title: string
  icon: string
  link: string
  description: string
  profit: number
  done: boolean
}

export const earnTasksQueryOptions = queryOptions({
  gcTime: Number.POSITIVE_INFINITY,
  queryFn: async () => {
    await ensureAccessTokenIsAvailable()
    const response = await pointAxiosInstance.get<TaskDTO[]>("/point/earn/tasks")
    return response.data
  },
  queryKey: ["earn", "tasks"],
  refetchInterval: 1000 * 30,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  staleTime: Number.POSITIVE_INFINITY,
})
