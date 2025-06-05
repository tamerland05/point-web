import { useQuery } from "@tanstack/react-query"
import { memo } from "react"

import { placeQueryOptions } from "@point/shared/api/point/places"
import { cn } from "@point/ui/cn"
import { Drawer } from "@point/ui/drawer"
import { HorizontalScroller } from "@point/ui/horizontal-scroller"
import { Icon } from "@point/ui/icon"
import { List } from "@point/ui/list"
import { ListItem } from "@point/ui/list-item"

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
		const placeQuery = useQuery(placeQueryOptions(id))
		const data = placeQuery.data

		console.log({ fulldata: data })

		return (
			<Drawer
				isOpen={!!id}
				height={drawerExpanded ? "full" : "lg"}
				onClose={handleCloseDrawer}
				onExpand={handleExpandDrawer}
				backgroundImage={data?.photo || photo}
			>
				<div className="h-max overflow-y-auto px-4 pb-4">
					<div className="mb-5 flex flex-col items-center gap-1">
						<h1 className="text-center font-semibold text-text text-title-2">{data?.name || name}</h1>
						<h2 className="text-center text-caption-1 text-text-secondary">{data?.position.address || address}</h2>
					</div>

					<List className="mb-8">
						<ListItem
							className="text-base"
							leftIcon={<Icon name={"Shape"} className="h-7 w-7 rounded-md bg-[#38C555] fill-white" />}
							leftTopText="Establishment Type"
							rightTopText={<div className="text-text-secondary">{data?.establishmentId || "Restaurant"}</div>}
							withSeparator
						/>
						<ListItem
							className="text-base"
							leftIcon={<Icon name={"Vector"} className="h-7 w-7 rounded-md bg-[#FFCC00] fill-white" />}
							leftTopText="Point Rating"
							rightTopText={<div className="text-text-secondary">{data?.rating || rating}</div>}
							withSeparator
						/>
						<ListItem
							className="text-base"
							leftIcon={<Icon name={"MenuBoard"} className="h-7 w-7 rounded-md bg-[#0A78FF] fill-white" />}
							leftTopText="Menu"
						/>
					</List>

					<div>
						<div className="mb-4 text-caption-3 text-text-secondary uppercase">Photos</div>
						{(data?.gallery || []).length > 0 && (
							<HorizontalScroller<string>
								className="mt-2 mb-4 gap-4"
								items={data?.gallery || []}
								renderItem={({ item, isSnapPoint }) => (
									<li
										key={item}
										className={cn(
											"mt-5 flex w-3/4 flex-shrink-0 items-center justify-center rounded-2xl",
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
				</div>
			</Drawer>
		)
	}
)

PlaceModal.displayName = "PlaceModal"
