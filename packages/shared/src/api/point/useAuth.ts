import { useQuery } from "@tanstack/react-query"

import pointAxiosInstance from "@/api/point"

export interface AuthReq {
	hash: string
	referrerData: string
	user: {
		id: 0
		firstName: string
		lastName: string
		username: string
		languageCode: string
		photoUrl: string
		isBot: boolean
		isPremium: boolean
		allowsWriteToPm: boolean
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
		account: {
			id: string
			wallet: string
			jobPlaceId: string
			purposeId: string
			meta: {
				showJob: boolean
				showPurpose: boolean
			}
		}
	}
	accessToken: string
}

export const useAuth = (auth: AuthReq) =>
	useQuery<AuthDTO>({
		queryKey: ["auth", auth.hash],
		queryFn: async () => {
			const response = await pointAxiosInstance.post<AuthDTO>("/point/user/auth", auth)

			return response.data
		},
		enabled: !!auth.hash,
		staleTime: 60000,
		gcTime: 300000,
		// refetchInterval: 10000,
	})
