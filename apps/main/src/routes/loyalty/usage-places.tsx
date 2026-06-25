import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"

import {
  findLoyaltyProgram,
  loyaltyProgramsQueryOptions,
  loyaltyUsagePlacesQueryOptions,
} from "@point/shared/api/point/loyalty"

import { LoyaltyUsagePlacesScreen } from "@/components/loyalty/LoyaltyScreen"

export const Route = createFileRoute("/loyalty/usage-places")({
  beforeLoad: ({ search }) => {
    if (!search.programId) {
      throw redirect({ replace: true, to: "/loyalty" })
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(loyaltyProgramsQueryOptions)
  },
  validateSearch: (search: Record<string, unknown>) => ({
    programId: typeof search["programId"] === "string" ? search["programId"] : undefined,
  }),
})

function RouteComponent() {
  const { programId } = Route.useSearch()
  const [search, setSearch] = useState("")

  const programsQuery = useSuspenseQuery(loyaltyProgramsQueryOptions)
  const placesQuery = useSuspenseQuery(loyaltyUsagePlacesQueryOptions(programId))
  const program = findLoyaltyProgram(programId, programsQuery.data)

  if (!program) {
    return null
  }

  return (
    <div className="min-h-full bg-[#efeff4] px-4 pt-1 pb-8">
      <LoyaltyUsagePlacesScreen
        onSearchChange={setSearch}
        places={placesQuery.data}
        program={program}
        search={search}
      />
    </div>
  )
}
