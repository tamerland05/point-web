import type { ErrorComponentProps } from "@tanstack/react-router"
import { ErrorPage } from "./ErrorPage"

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  console.error(error)

  return <ErrorPage error={error} />
}
