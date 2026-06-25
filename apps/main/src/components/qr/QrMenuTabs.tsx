import type { MenuTabOption } from "@/utils/tableMenuPresentation"

import { cn } from "@point/ui/cn"

import { useParityCapture } from "@/hooks/useParityCapture"

interface QrMenuTabsProps {
  activeTab: string
  onChange: (value: string) => void
  tabs: MenuTabOption[]
}

export function QrMenuTabs({ activeTab, onChange, tabs }: QrMenuTabsProps) {
  const parityCapture = useParityCapture()

  if (!tabs.length) {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white">
      <div className="flex gap-10 overflow-x-auto px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            className={cn("shrink-0 font-medium text-[15px]", {
              "border-[#007aff] border-b-2 pb-1 text-[#007aff]": !parityCapture && activeTab === tab.id,
              "text-[#007aff]": parityCapture && activeTab === tab.id,
              "text-black": activeTab !== tab.id,
            })}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {parityCapture && activeTab === tabs[0]?.id ? (
        <div className="pointer-events-none absolute bottom-[9px] left-4 h-[2px] w-[92px] rounded-full bg-[#007aff]" />
      ) : null}
    </div>
  )
}
