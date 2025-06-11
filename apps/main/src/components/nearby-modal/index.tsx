import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { memo, useMemo, useState } from "react"

import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { establishmentsQueryOptions } from "@point/shared/api/point/establishments"
import { placesNearQueryOptions } from "@point/shared/api/point/places"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { Input } from "@point/ui/input"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import Img from "react-cool-img"

export const NearbyModalStates = {
  EXPANDED: "expanded",
  DEFAULT: "default",
  PIMP_ONLY: "pimp-only",
  HIDDEN: "hidden",
} as const

export type NearbyModalState = (typeof NearbyModalStates)[keyof typeof NearbyModalStates]

interface NearbyModalProps {
  state: NearbyModalState

  onExpand: () => void
  onShow: () => void
  onHide: () => void
  onSelectPlace: (placeId: string, longitude: number, latitude: number) => void
}

export const NearbyModal = memo(
  ({ state = NearbyModalStates.DEFAULT, onExpand, onShow, onHide, onSelectPlace }: NearbyModalProps) => {
    const navigate = useNavigate({ from: "/map" })

    const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
    const userLocation = userLocationQuery.data

    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    const establishmentsQuery = useQuery(establishmentsQueryOptions)
    const establishments = establishmentsQuery.data

    const placesQuery = useQuery(placesNearQueryOptions(debouncedSearch, userLocation))
    const places = placesQuery.data

    const height = useMemo(() => {
      if (state === NearbyModalStates.EXPANDED) return "full"
      if (state === NearbyModalStates.DEFAULT) return "md"
      if (state === NearbyModalStates.PIMP_ONLY) return "pimp-only"

      return "md"
    }, [state])

    return (
      <Drawer
        isOpen={state !== NearbyModalStates.HIDDEN}
        height={height}
        backgroundImage={undefined}
        disableScroll
        onExpand={state === NearbyModalStates.PIMP_ONLY ? onShow : onExpand}
        onClose={state === NearbyModalStates.EXPANDED ? onShow : onHide}
      >
        <div className={cn("px-4", {})}>
          <Input placeholder="Search" value={search} onChange={setSearch} containerClassName="mb-4" />
          <div
            className={cn("h-[calc(100vh-100px)] rounded-b-xl", {
              "overflow-y-auto": state === NearbyModalStates.EXPANDED,
              "overflow-y-hidden": state !== NearbyModalStates.EXPANDED,
            })}
          >
            <List title="Nearby establishments">
              {places?.map((place) => (
                <ListItem
                  key={place.id}
                  leftIcon={<Img src={place.photo} alt={place.name} className="h-14 w-14 rounded-xl object-cover" />}
                  leftTopText={place.name}
                  leftBottomText={place.position.address}
                  withSeparator
                  onClick={() => onSelectPlace(place.id, place.position.longitude, place.position.latitude)}
                />
              ))}
            </List>
          </div>
        </div>
      </Drawer>
    )
  }
)

NearbyModal.displayName = "NearbyModal"
