import { queryOptions } from "@tanstack/react-query"

export interface LoyaltyProgramDTO {
  balanceRub: number
  id: string
  name: string
  photo: string
  subtitle: string
  usagePlacesCount: number
  verified?: boolean
}

export interface LoyaltyUsagePlaceDTO {
  distanceLabel: string
  hoursLabel: string
  id: string
  photo: string
  rating: number
  subtitle: string
  title: string
}

/** Wave 1 UI-only mock. Target real: loyalty programs + usage places API (BMA TBD). */
const MOCK_PROGRAMS: LoyaltyProgramDTO[] = [
  {
    balanceRub: 6201,
    id: "manul",
    name: "Manul",
    photo: "/parity/selections/list-logo-front.png",
    subtitle: "Кофейня",
    usagePlacesCount: 6,
    verified: true,
  },
  {
    balanceRub: 3402,
    id: "abrau",
    name: "Абрау Дюрсо",
    photo: "/parity/selections/list-logo-back.png",
    subtitle: "Ресторан",
    usagePlacesCount: 12,
    verified: true,
  },
  {
    balanceRub: 1603,
    id: "olivka",
    name: "Оливка",
    photo: "/parity/selections/place-1.png",
    subtitle: "Бар",
    usagePlacesCount: 3,
  },
]

const MOCK_USAGE_PLACES: Record<string, LoyaltyUsagePlaceDTO[]> = {
  abrau: [
    {
      distanceLabel: "254м",
      hoursLabel: "8:00 — 23:00",
      id: "abrau-1",
      photo: "/parity/selections/rec-1.png",
      rating: 5,
      subtitle: "Ресторан",
      title: "Абрау-Дюрсо",
    },
    {
      distanceLabel: "794м",
      hoursLabel: "18:00 — 23:00",
      id: "abrau-2",
      photo: "/parity/selections/rec-2.png",
      rating: 4,
      subtitle: "Винотека",
      title: "Hot Apple",
    },
  ],
  manul: [
    {
      distanceLabel: "120м",
      hoursLabel: "8:00 — 22:00",
      id: "manul-1",
      photo: "/parity/selections/place-2.png",
      rating: 5,
      subtitle: "Кофейня",
      title: "Manul",
    },
  ],
  olivka: [
    {
      distanceLabel: "410м",
      hoursLabel: "12:00 — 00:00",
      id: "olivka-1",
      photo: "/parity/selections/list-place-3.png",
      rating: 4,
      subtitle: "Бар",
      title: "Оливка",
    },
  ],
}

export function formatLoyaltyRub(amount: number): string {
  return `${amount.toLocaleString("ru-RU").replace(/\u00A0/g, " ")}₽`
}

export const loyaltyProgramsQueryOptions = queryOptions({
  queryFn: async () => MOCK_PROGRAMS,
  queryKey: ["loyalty", "programs"],
  staleTime: Number.POSITIVE_INFINITY,
})

export const loyaltyUsagePlacesQueryOptions = (programId?: string | null) =>
  queryOptions({
    queryFn: async () => {
      if (!programId) {
        return []
      }

      return MOCK_USAGE_PLACES[programId] ?? []
    },
    queryKey: ["loyalty", "usage-places", programId ?? null],
    staleTime: Number.POSITIVE_INFINITY,
  })

export function findLoyaltyProgram(programId: string | undefined, programs: LoyaltyProgramDTO[]) {
  return programs.find((program) => program.id === programId)
}
