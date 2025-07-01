import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useLaunchParams, useSignal, viewport } from "@telegram-apps/sdk-react"
import { memo, useCallback, useMemo, useState } from "react"
import Img from "react-cool-img"

import { NearbyModalStates, nearbyModalStateAtom } from "@/atoms/map"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { placesNearQueryOptions } from "@point/shared/api/point/establishments"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { Input } from "@point/ui/input"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useAtomValue } from "jotai"

interface NearbyModalProps {
  onExpand: () => void
  onShow: () => void
  onHide: () => void
  onSelectPlace: (placeId: string, longitude: number, latitude: number) => void
}

export const NearbyModal = memo(({ onExpand, onShow, onHide, onSelectPlace }: NearbyModalProps) => {
  const userLocationQuery = useSuspenseQuery(userLocationQueryOptions)
  const userLocation = userLocationQuery.data
  const lp = useLaunchParams()

  const inset = useSignal(viewport.safeAreaInsets)
  const contentInset = useSignal(viewport.contentSafeAreaInsets)
  const additionalTopSpace = useMemo(() => inset.top + contentInset.top, [inset, contentInset])

  const state = useAtomValue(nearbyModalStateAtom)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const placesQuery = useQuery(placesNearQueryOptions(debouncedSearch, userLocation))
  const places = placesQuery.data

  const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
  const establishmentTypes = establishmentTypesQuery.data

  const getIconByEstablishmentType = useCallback(
    (establishmentTypeId: string) => {
      const establishmentType = establishmentTypes?.[establishmentTypeId]

      if (!establishmentType) return null

      return (
        <Img
          src={establishmentType.icon}
          alt={establishmentType.name}
          className="my-1 h-10 w-10 rounded-xl object-cover"
        />
      )
    },
    [establishmentTypes]
  )

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
      standalone={lp.tgWebAppPlatform === "ios"}
      additionalTopSpace={additionalTopSpace}
      backgroundImage={undefined}
      disableScroll
      onExpand={state === NearbyModalStates.PIMP_ONLY ? onShow : onExpand}
      onClose={state === NearbyModalStates.EXPANDED ? onShow : onHide}
      className="z-20"
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
                leftIcon={getIconByEstablishmentType(place.establishmentTypeId)}
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
})

NearbyModal.displayName = "NearbyModal"
