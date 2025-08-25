import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useLaunchParams, useSignal, viewport } from "@telegram-apps/sdk-react"
import { useAtomValue } from "jotai"
import { memo, useCallback, useMemo, useState } from "react"
import Img from "react-cool-img"

import { placesNearQueryOptions } from "@point/shared/api/point/establishments"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { useDebounce } from "@point/shared/hooks/useDebounce"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { Input } from "@point/ui/input"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { NearbyModalStates, nearbyModalStateAtom } from "@/atoms/map"
import { userLocationQueryOptions } from "@/utils/get-user-location-query"

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
          alt={establishmentType.name}
          className="my-1 h-10 w-10 rounded-xl object-cover"
          src={establishmentType.icon}
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
      additionalTopSpace={additionalTopSpace}
      backgroundImage={undefined}
      className="z-20"
      disableScroll
      height={height}
      isOpen={state !== NearbyModalStates.HIDDEN}
      onClose={state === NearbyModalStates.EXPANDED ? onShow : onHide}
      onExpand={state === NearbyModalStates.PIMP_ONLY ? onShow : onExpand}
      standalone={lp.tgWebAppPlatform === "ios"}
    >
      <div className={cn("px-4", {})}>
        <Input containerClassName="mb-4" onChange={setSearch} placeholder="Search" value={search} />
        <div
          className={cn("rounded-b-xl", {
            "overflow-y-auto": state === NearbyModalStates.EXPANDED,
            "overflow-y-hidden": state !== NearbyModalStates.EXPANDED,
          })}
          style={{
            height: `calc(100vh - ${additionalTopSpace + 100}px)`,
          }}
        >
          <List title="Nearby establishments">
            {places?.map((place) => (
              <ListItem
                key={place.id}
                leftBottomText={place.position.address}
                leftIcon={getIconByEstablishmentType(place.establishmentTypeId)}
                leftTopText={place.name}
                onClick={() => onSelectPlace(place.id, place.position.longitude, place.position.latitude)}
                withSeparator
              />
            ))}
          </List>
        </div>
      </div>
    </Drawer>
  )
})

NearbyModal.displayName = "NearbyModal"
