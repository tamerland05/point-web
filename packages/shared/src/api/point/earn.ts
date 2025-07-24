import pointAxiosInstance from "@/api/point"
import type { JobPlace, PurposeOfFunding } from "@/types"
import { ensureAccessTokenIsAvailable } from "@/utils/ensureAccessTokenIsAvailable"
import { queryOptions } from "@tanstack/react-query"

export interface ReferralDTO {
  name: string
  bonusBalance: number
  photoUrl: string
}

export interface PageReferralDTO {
  items: ReferralDTO[]
  total?: number | null
  page: number | null
  size: number | null
  pages?: number | null
}

export const referralsQueryOptions = (page = 1, size = 10) =>
  queryOptions({
    queryKey: ["earn", "referrals", page, size],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.get<PageReferralDTO>("/point/earn/referrals", {
        params: { page, size },
      })
      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

export interface EmployeePublicDTO {
  id: string
  profession: string
  photo: string
  name: string
  jobPlace?: JobPlace | null
  purpose?: PurposeOfFunding | null
}

export interface UserPublicDTO {
  photoUrl?: string | null
  name: string
  username: string
  rank: number
  tipsLeft?: string | null
  employee?: EmployeePublicDTO | null
}

export const earnTopQueryOptions = () =>
  queryOptions({
    queryKey: ["earn", "top"],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.get<UserPublicDTO[]>("/point/earn/top")
      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })

export interface TaskDTO {
  id: string
  title: string
  description: string
  profit: number
  done: boolean
}

export const earnTasksQueryOptions = () =>
  queryOptions({
    queryKey: ["earn", "tasks"],
    queryFn: async () => {
      await ensureAccessTokenIsAvailable()
      const response = await pointAxiosInstance.get<TaskDTO[]>("/point/earn/tasks")
      return response.data
    },
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
  })
