import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { memo, useCallback, useMemo } from "react"
import Image from "react-cool-img"

import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { HorizontalScroller } from "@point/ui/horizontal-scroller"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { useFormatter } from "@point/shared/hooks/useFormatter"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { RatePlace } from "../rate-place"
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
    const { formatCurrency } = useFormatter()

    const establishmentQuery = useQuery(establishmentQueryOptions(id))
    const data = establishmentQuery.data

    const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
    const establishmentTypes = establishmentTypesQuery.data

    const establishmentTypeName = useMemo(() => {
      if (!establishmentTypes || !data?.establishmentTypeId) return "N/A"

      return establishmentTypes[data.establishmentTypeId]?.name
    }, [establishmentTypes, data?.establishmentTypeId])

    const handleNavigateToMenu = useCallback(() => {
      if (!id) return
      navigate({ to: "/menu/$id", params: { id } })
    }, [id, navigate])

    const handleOpenTelegramChannel = useCallback(() => {
      if (!data?.channelLink) return
      openTelegramLink(data.channelLink)
    }, [data?.channelLink])

    const secondaryButtonConfig = useMemo(
      () => ({
        title: !drawerExpanded ? "" : "Telegram Channel",
        loading: false,
        disabled: false,
        hidden: !id || !data?.channelLink || !drawerExpanded,
        onClick: !id || !data?.channelLink || !drawerExpanded ? undefined : handleOpenTelegramChannel,
      }),
      [id, data?.channelLink, drawerExpanded, handleOpenTelegramChannel]
    )

    const mainButtonConfig = useMemo(
      () => ({
        title: !drawerExpanded ? "" : "Send a Tip",
        loading: false,
        disabled: false,
        hidden: !id || !drawerExpanded,
        onClick: !id || !drawerExpanded ? undefined : () => navigate({ to: "/tips/$placeId", params: { placeId: id } }),
      }),
      [id, drawerExpanded, navigate]
    )

    const slicedMenu = useMemo(() => {
      if (!data?.menu) return []
      return data.menu.slice(0, 3)
    }, [data?.menu])

    return (
      <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
        <Drawer
          isOpen={!!id}
          height={drawerExpanded ? "full" : "md"}
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
                rightTopText={<div className="text-text-secondary">{establishmentTypeName}</div>}
                withSeparator
              />
              <ListItem
                className="text-base"
                leftIcon={<Icon name={"Vector"} className="h-7 w-7 rounded-md bg-[#FFCC00] p-1 text-transparent" />}
                leftTopText="Point Rating"
                rightTopText={<div className="text-text-secondary">{data?.rating || rating || "0"}</div>}
                withSeparator
              />
              {!!data?.menu.length && data?.menu?.length > 0 && (
                <ListItem
                  className="text-base"
                  leftIcon={
                    <Icon name={"MenuBoard"} className="h-7 w-7 rounded-md bg-[#0A78FF] p-1 text-transparent" />
                  }
                  leftTopText="Menu"
                  rightIcon={<Icon name={"ChevronRight"} className="h-7 w-7 py-1.5 pl-3 text-text-secondary" />}
                  onClick={handleNavigateToMenu}
                />
              )}
            </List>

            {(data?.gallery || []).length > 0 && id && (
              <div className="mb-8">
                <div className="mx-4 mb-1 text-caption-3 text-text-secondary uppercase">Photos</div>
                <HorizontalScroller<string>
                  className="gap-4"
                  scrollRestoration={false}
                  items={data?.gallery || []}
                  renderItem={({ item, isSnapPoint }) => (
                    <li
                      key={item}
                      className={cn(
                        "flex w-3/4 flex-shrink-0 items-center justify-center rounded-2xl",
                        isSnapPoint && "snap-start"
                      )}
                    >
                      <Image
                        placeholder="/img-ph.svg"
                        error="/img-ph.svg"
                        alt={data?.name}
                        className="h-100 w-full rounded-2xl object-cover"
                        src={item}
                      />
                    </li>
                  )}
                  showDots={false}
                />
              </div>
            )}

            <List className="mb-8" title="establishment info">
              <ListItem
                leftTopText={<span className="text-caption-1 text-text-secondary">Establishment Type</span>}
                leftBottomText={<span className="text-accent text-base">{establishmentTypeName}</span>}
                withSeparator
              />
              <ListItem
                leftTopText={<span className="text-caption-1 text-text-secondary">Description</span>}
                leftBottomText={<span className="text-base text-text">{data?.description || "N/A"}</span>}
              />
            </List>

            {!!slicedMenu.length && (
              <List title="menu" onExpand={handleNavigateToMenu}>
                {slicedMenu.map((menuItem, idx) => (
                  <ListItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: this map will never change
                    key={idx}
                    leftIcon={<Image src={menuItem.photo} alt={menuItem.title} className="h-14 w-14 rounded-xl" />}
                    leftTopText={<span className="line-clamp-1 text-base text-text">{menuItem.title}</span>}
                    leftBottomText={
                      <span className="line-clamp-2 text-caption-1 text-text-secondary">{menuItem.description}</span>
                    }
                    rightTopText={
                      <span className="whitespace-nowrap text-text-secondary">
                        {formatCurrency(menuItem.cost.amount)}
                        {menuItem.cost.currency}
                      </span>
                    }
                    onClick={() => {
                      if (!id) return
                      navigate({
                        to: "/menu/$id/$menuItemId",
                        params: { id, menuItemId: menuItem.id },
                      })
                    }}
                    withSeparator
                  />
                ))}
              </List>
            )}

            {drawerExpanded && data?.userRating !== undefined && id && (
              <RatePlace
                id={id}
                image={data?.icon || ""}
                title={data?.name || name || ""}
                establishmentType={establishmentTypeName || ""}
                userRating={data?.userRating}
              />
            )}
          </div>
        </Drawer>
      </ShowMainButton>
    )
  }
)

PlaceModal.displayName = "PlaceModal"
