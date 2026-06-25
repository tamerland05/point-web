import type { MenuItem } from "@point/shared/types"

import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { openTelegramLink } from "@telegram-apps/sdk-react"
import { memo, useCallback, useMemo } from "react"
import Image from "react-cool-img"

import { useTranslation } from "@point/i18n"
import { establishmentQueryOptions } from "@point/shared/api/point/establishments"
import { establishmentTypesQueryOptions } from "@point/shared/api/point/establishmentTypes"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { HorizontalScroller } from "@point/ui/horizontal-scroller"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

import { RatePlace } from "../rate-place"
import { ShowMainButton } from "../tg-internals"
import { PlaceActionBar } from "./PlaceActionBar"
import { PlaceRatingValue } from "./PlaceRatingValue"

interface PlaceModalProps {
  id?: string
  photo?: string
  name?: string
  address?: string
  rating?: number
  distanceLabel?: string | null

  drawerExpanded: boolean
  handleCloseDrawer: () => void
  handleExpandDrawer: () => void
}

export const PlaceModal = memo(
  ({
    id,
    photo,
    name,
    address,
    rating,
    distanceLabel,
    drawerExpanded,
    handleCloseDrawer,
    handleExpandDrawer,
  }: PlaceModalProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate({ from: "/map" })
    const { formatCurrency } = useFormatter()

    const establishmentQuery = useQuery(establishmentQueryOptions(id))
    const data = establishmentQuery.data

    const establishmentTypesQuery = useQuery(establishmentTypesQueryOptions)
    const establishmentTypes = establishmentTypesQuery.data

    const establishmentTypeName = useMemo(() => {
      if (!establishmentTypes || !data?.establishmentTypeId) return "—"

      return establishmentTypes[data.establishmentTypeId]?.name
    }, [establishmentTypes, data?.establishmentTypeId])

    const handleNavigateToMenu = useCallback(() => {
      if (!id) return
      void navigate({ params: { id }, to: "/menu/$id" })
    }, [id, navigate])

    const handleOpenTelegramChannel = useCallback(() => {
      if (!data?.channelLink) return
      openTelegramLink(data.channelLink)
    }, [data?.channelLink])

    const handleBookingClick = useCallback(() => {
      if (!id) return
      void navigate({
        search: { establishmentId: id },
        to: "/booking/process",
      })
    }, [id, navigate])

    const mainButtonConfig = useMemo(
      () => ({
        disabled: false,
        hidden: true,
        loading: false,
        onClick: undefined,
        title: "",
      }),
      []
    )

    const secondaryButtonConfig = useMemo(
      () => ({
        disabled: false,
        hidden: true,
        loading: false,
        onClick: undefined,
        title: "",
      }),
      []
    )

    const slicedMenu = useMemo(() => {
      if (!data?.menu) return []
      return data.menu.slice(0, 3)
    }, [data?.menu])

    const ratingValue = data?.rating ?? rating
    const ratingCount = data?.ratingCount

    return (
      <ShowMainButton secondary={secondaryButtonConfig} {...mainButtonConfig}>
        <Drawer
          backgroundImage={data?.photo || photo}
          disableScroll={!drawerExpanded}
          height={drawerExpanded ? "full" : "md"}
          isOpen={!!id}
          onClose={handleCloseDrawer}
          onExpand={handleExpandDrawer}
        >
          <div className={cn("h-max px-4 pb-4", {})}>
            <div className="mb-5 flex flex-col items-center gap-1">
              <h1 className="text-center font-semibold text-text text-title-2">{data?.name || name}</h1>
              <h2 className="text-center text-caption-1 text-text-secondary">{data?.position.address || address}</h2>
            </div>

            <List className="mb-8">
              <ListItem
                className="text-base"
                leftIcon={<Icon className="h-7 w-7 rounded-md bg-[#38C555] p-1 text-transparent" name={"Shape"} />}
                leftTopText={t("WAVE1.PLACE.TYPE")}
                rightTopText={<div className="text-text-secondary">{establishmentTypeName}</div>}
                withSeparator
              />
              <ListItem
                className="text-base"
                leftIcon={<Icon className="h-7 w-7 rounded-md bg-[#FFCC00] p-1 text-transparent" name={"Vector"} />}
                leftTopText={t("WAVE1.PLACE.RATING")}
                rightTopText={<PlaceRatingValue rating={ratingValue} ratingCount={ratingCount} />}
                withSeparator
              />
              {!!data?.menu.length && data?.menu?.length > 0 && (
                <ListItem
                  className="text-base"
                  leftIcon={
                    <Icon className="h-7 w-7 rounded-md bg-[#0A78FF] p-1 text-transparent" name={"MenuBoard"} />
                  }
                  leftTopText={t("WAVE1.PLACE.MENU")}
                  onClick={handleNavigateToMenu}
                  rightIcon={<Icon className="h-7 w-7 py-1.5 pl-3 text-text-secondary" name={"ChevronRight"} />}
                />
              )}
            </List>

            {(data?.gallery || []).length > 0 && id && (
              <div className="mb-8">
                <div className="mx-4 mb-1 text-caption-3 text-text-secondary uppercase">{t("WAVE1.PLACE.PHOTOS")}</div>
                <HorizontalScroller<string>
                  className="gap-4"
                  items={data?.gallery || []}
                  renderItem={({ item, isSnapPoint }) => (
                    <li
                      className={cn(
                        "flex w-3/4 flex-shrink-0 items-center justify-center rounded-2xl",
                        isSnapPoint && "snap-start"
                      )}
                      key={item}
                    >
                      <Image
                        alt={data?.name}
                        className="h-100 w-full rounded-2xl object-cover"
                        error="/img-ph.svg"
                        placeholder="/img-ph.svg"
                        src={item}
                      />
                    </li>
                  )}
                  scrollRestoration={false}
                  showDots={false}
                />
              </div>
            )}

            <List className="mb-8" title="О заведении">
              <ListItem
                leftBottomText={<span className="text-accent text-base">{establishmentTypeName}</span>}
                leftTopText={<span className="text-caption-1 text-text-secondary">Тип заведения</span>}
                withSeparator
              />
              <ListItem
                leftBottomText={<span className="text-base text-text">{data?.description || "—"}</span>}
                leftTopText={<span className="text-caption-1 text-text-secondary">Описание</span>}
              />
            </List>

            {!!slicedMenu.length && (
              <List onExpand={handleNavigateToMenu} title="Меню">
                {slicedMenu.map((menuItem: MenuItem, idx: number) => (
                  <ListItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: this map will never change
                    key={idx}
                    leftBottomText={
                      <span className="line-clamp-2 text-caption-1 text-text-secondary">{menuItem.description}</span>
                    }
                    leftIcon={
                      menuItem.photo && (
                        <Image
                          alt={menuItem.title}
                          className="size-14 rounded-xl object-cover"
                          error="/img-ph.svg"
                          placeholder="/img-ph.svg"
                          src={menuItem.photo}
                        />
                      )
                    }
                    leftTopText={<span className="line-clamp-1 text-base text-text">{menuItem.title}</span>}
                    onClick={() => {
                      if (!id) return
                      void navigate({
                        params: { id, menuItemId: menuItem.id },
                        to: "/menu/$id/$menuItemId",
                      })
                    }}
                    rightTopText={
                      <span className="whitespace-nowrap text-text-secondary">
                        {formatCurrency(menuItem.cost.amount)}
                        {menuItem.cost.currency}
                      </span>
                    }
                    withSeparator
                  />
                ))}
              </List>
            )}

            {drawerExpanded && data?.userRating !== undefined && id && (
              <RatePlace
                establishmentType={establishmentTypeName || ""}
                id={id}
                image={data?.icon || ""}
                title={data?.name || name || ""}
                userRating={data?.userRating}
              />
            )}

            {id ? (
              <PlaceActionBar
                distanceLabel={distanceLabel}
                hasChannel={Boolean(data?.channelLink)}
                onBookingClick={handleBookingClick}
                onChannelClick={handleOpenTelegramChannel}
              />
            ) : null}
          </div>
        </Drawer>
      </ShowMainButton>
    )
  }
)

PlaceModal.displayName = "PlaceModal"
