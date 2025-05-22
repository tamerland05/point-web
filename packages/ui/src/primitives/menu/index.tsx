import { memo } from "react"

import clsx from "clsx"

import { cn } from "@/utils/cn"

export interface MenuItem {
	label: string
	icon: React.ReactNode
	onClick: () => void
	active: boolean
	disabled?: boolean
	hidden?: boolean
}

interface MenuProps {
	standalone: boolean
	items: MenuItem[]
}

// TODO: refactor using splitAtom
const MenuButton: React.FC<MenuItem> = memo(({ label, icon, onClick, active, disabled }) => (
	<button
		className="flex flex-1 flex-col items-center justify-center gap-1 p-3"
		disabled={disabled}
		type="button"
		onClick={onClick}
	>
		<div className={cn({ "flex ": true, "text-accent": active })}>{icon}</div>
		<div
			className={clsx({
				"text-nowrap font-medium text-caption-2": true,
				"text-text-secondary": !active,
				"text-accent": active,
			})}
		>
			{label}
		</div>
	</button>
))

MenuButton.displayName = "MenuButton"

export const Menu: React.FC<MenuProps> = ({ standalone, items }) => (
	<nav
		className={cn({
			"z-10 w-full border-separator border-t bg-background": true,
			"pb-2": standalone,
		})}
	>
		<div className="flex w-full justify-between">
			{items
				.filter((item) => !item.hidden)
				.map((item) => (
					<MenuButton
						key={item.label}
						active={item.active}
						disabled={item.disabled}
						icon={item.icon}
						label={item.label}
						onClick={item.onClick}
					/>
				))}
		</div>
	</nav>
)
