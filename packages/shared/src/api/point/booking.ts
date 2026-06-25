import { queryOptions, useMutation } from "@tanstack/react-query"

export interface BookingDraftDTO {
  guests: number
  date: string
  time: string
  note: string
  establishmentId?: string | null
}

export interface BookingResultDTO {
  id: string
  status: "processing" | "confirmed"
}

/** Wave 1 UI-only mock defaults. Target real: GET /point/booking/draft (BMA-904). */
function createMockBookingDraft(establishmentId?: string | null): BookingDraftDTO {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  return {
    date,
    establishmentId: establishmentId ?? null,
    guests: 2,
    note: "",
    time,
  }
}

export const bookingDraftQueryOptions = (establishmentId?: string | null) =>
  queryOptions({
    queryFn: async () => createMockBookingDraft(establishmentId),
    queryKey: ["booking", "draft", establishmentId ?? null],
    staleTime: Number.POSITIVE_INFINITY,
  })

/** Wave 1 UI-only mock. Target real: POST /point/booking/create (BMA-904). */
export const useBookingSubmitMutation = () =>
  useMutation({
    mutationFn: async (_payload: BookingDraftDTO) =>
      ({
        id: "wave1-mock-booking",
        status: "confirmed",
      }) satisfies BookingResultDTO,
  })
