import { useQuery } from "@tanstack/react-query"
import { memo, useCallback, useMemo } from "react"

import { establishmentsQueryOptions } from "@point/shared/api/point/establishments"
import { placeQueryOptions } from "@point/shared/api/point/places"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { HorizontalScroller } from "@point/ui/horizontal-scroller"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { ShowMainButton } from "../tg-internals"

interface PlaceModalProps {
  id?: string
  photo?: string
  name?: string
  address?: string
  rating?: number

  drawerExpanded: boolean
  handleCloseDrawer: () => void
  handleExpandDrawer: () => void
}

export const PlaceModal = memo(
  ({ id, photo, name, address, rating, drawerExpanded, handleCloseDrawer, handleExpandDrawer }: PlaceModalProps) => {
    const navigate = useNavigate({ from: "/map" })

    const placeQuery = useQuery(placeQueryOptions(id))
    const data = placeQuery.data

    const establishmentsQuery = useQuery(establishmentsQueryOptions)
    const establishments = establishmentsQuery.data

    const establishment = useMemo(() => {
      if (!establishments?.length) return "N/A"
      return establishments.find((establishment) => establishment.id === data?.establishmentId)?.name || "N/A"
    }, [establishments, data?.establishmentId])

    const handleNavigateToMenu = useCallback(() => {
      if (!id) return
      navigate({ to: "/menu/$id", params: { id } })
    }, [id, navigate])

    const secondaryButtonConfig = useMemo(
      () => ({
        title: "Telegram Channel",
        loading: false,
        disabled: false,
        hidden: !data?.channelLink || !drawerExpanded,
        onClick: () => toast("secondary button clicked"),
      }),
      [data?.channelLink, drawerExpanded]
    )

    const mainButtonConfig = useMemo(
      () => ({
        title: "Send a Tip",
        loading: false,
        disabled: false,
        hidden: !drawerExpanded,
        onClick: () => toast("main button clicked"),
      }),
      [drawerExpanded]
    )

    const slicedMenu = useMemo(() => {
      if (!data?.menu) return []
      return data.menu.slice(0, 3)
    }, [data?.menu])

    return (
      <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
        <Drawer
          isOpen={!!id}
          height={drawerExpanded ? "full" : "lg"}
          onClose={handleCloseDrawer}
          onExpand={handleExpandDrawer}
          backgroundImage={data?.photo || photo}
          disableScroll={!drawerExpanded}
        >
          <div className={cn("h-max px-4 pb-4", {})}>
            <div className="mb-5 flex flex-col items-center gap-1">
              <h1 className="text-center font-semibold text-text text-title-2">{data?.name || name}</h1>
              <h2 className="text-center text-caption-1 text-text-secondary">{data?.position.address || address}</h2>
            </div>

            <List className="mb-8">
              <ListItem
                className="text-base"
                leftIcon={<Icon name={"Shape"} className="h-7 w-7 rounded-md bg-[#38C555] p-1 text-transparent" />}
                leftTopText="Establishment Type"
                rightTopText={<div className="text-text-secondary">{establishment}</div>}
                withSeparator
              />
              <ListItem
                className="text-base"
                leftIcon={<Icon name={"Vector"} className="h-7 w-7 rounded-md bg-[#FFCC00] p-1 text-transparent" />}
                leftTopText="Point Rating"
                rightTopText={<div className="text-text-secondary">{data?.rating || rating}</div>}
                withSeparator
              />
              <ListItem
                className="text-base"
                leftIcon={<Icon name={"MenuBoard"} className="h-7 w-7 rounded-md bg-[#0A78FF] p-1 text-transparent" />}
                leftTopText="Menu"
                rightIcon={<Icon name={"ChevronRight"} className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
                onClick={handleNavigateToMenu}
              />
            </List>

            <div className="mb-8">
              <div className="mx-4 mb-1 text-caption-3 text-text-secondary uppercase">Photos</div>
              {(data?.gallery || []).length > 0 && (
                <HorizontalScroller<string>
                  className="gap-4"
                  items={data?.gallery || []}
                  renderItem={({ item, isSnapPoint }) => (
                    <li
                      key={item}
                      className={cn(
                        "flex w-3/4 flex-shrink-0 items-center justify-center rounded-2xl",
                        isSnapPoint && "snap-start"
                      )}
                    >
                      <img alt={data?.name} className="h-full w-full rounded-2xl object-cover" src={item} />
                    </li>
                  )}
                  showDots={false}
                />
              )}
            </div>

            <List className="mb-8" title="establishment info">
              <ListItem
                leftTopText={<span className="text-caption-1 text-text-secondary">Establishment Type</span>}
                leftBottomText={<span className="text-accent text-base">{establishment}</span>}
                withSeparator
              />
              <ListItem
                leftTopText={<span className="text-caption-1 text-text-secondary">Description</span>}
                leftBottomText={<span className="text-base text-text">{data?.description}</span>}
              />
            </List>

            {slicedMenu.length && (
              <List title="menu" onExpand={handleNavigateToMenu}>
                {slicedMenu.map((menuItem, idx) => (
                  <ListItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: this map will never change
                    key={idx}
                    leftIcon={<img src={menuItem.photo} alt={menuItem.title} className="h-14 w-14 rounded-xl" />}
                    leftTopText={<span className="text-base text-text">{menuItem.title}</span>}
                    leftBottomText={<span className="text-caption-1 text-text-secondary">{menuItem.description}</span>}
                    rightTopText={
                      <span className="whitespace-nowrap text-text-secondary">
                        {menuItem.cost.value} {menuItem.cost.currency}
                      </span>
                    }
                  />
                ))}
              </List>
            )}
          </div>
        </Drawer>
      </ShowMainButton>
    )
  }
)

PlaceModal.displayName = "PlaceModal"
