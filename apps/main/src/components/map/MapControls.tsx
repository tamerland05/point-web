import { mapAssets } from "./mapAssets"

interface MapControlsProps {
  bottomOffset: string
  onLocate: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function MapControls({ bottomOffset, onLocate, onZoomIn, onZoomOut }: MapControlsProps) {
  return (
    <div className="fixed right-4 z-[25] flex flex-col gap-2" style={{ bottom: bottomOffset }}>
      <div className="overflow-hidden rounded-2xl border border-[#d9d9d9] bg-white">
        <button className="flex h-12 w-12 items-center justify-center" onClick={onZoomIn} type="button">
          <img alt="" className="h-12 w-12" src={mapAssets.zoomIn} />
        </button>
        <button
          className="flex h-12 w-12 items-center justify-center border-[#d9d9d9] border-t"
          onClick={onZoomOut}
          type="button"
        >
          <img alt="" className="h-12 w-12" src={mapAssets.zoomOut} />
        </button>
      </div>
      <button
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9d9d9] bg-white"
        onClick={onLocate}
        type="button"
      >
        <img alt="" className="h-5 w-5" src={mapAssets.locate} />
      </button>
    </div>
  )
}
