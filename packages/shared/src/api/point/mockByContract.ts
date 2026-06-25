import { isAxiosError } from "axios"

export interface PointApiErrorShape {
  code: "HTTP_ERROR" | "NETWORK" | "UNKNOWN"
  message: string
  retriable: boolean
  status: number | null
}

export function normalizePointApiError(error: unknown): PointApiErrorShape {
  if (isAxiosError(error)) {
    if (typeof error.response?.status === "number") {
      return {
        code: "HTTP_ERROR",
        message: error.message || "Point API returned an HTTP error.",
        retriable: error.response.status >= 500,
        status: error.response.status,
      }
    }

    return {
      code: "NETWORK",
      message: error.message || "Point API network error.",
      retriable: true,
      status: null,
    }
  }

  return {
    code: "UNKNOWN",
    message: "Unknown Point API error.",
    retriable: false,
    status: null,
  }
}
