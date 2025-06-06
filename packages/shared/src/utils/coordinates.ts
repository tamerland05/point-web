import type { Coordinates } from "@/types"

export const createCoordinates = (longitude: number, latitude: number, address?: string): Coordinates => ({
	longitude,
	latitude,
	address,
})
