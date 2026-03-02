import type { AxiosError } from "axios"

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof Error && "isAxiosError" in error
}
