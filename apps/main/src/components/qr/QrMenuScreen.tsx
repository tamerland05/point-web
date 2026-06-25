import type { ReactNode } from "react"

import { useMemo, useState } from "react"

import { useTranslation } from "@point/i18n"
import { type PosMenuCategory, type PosMenuProduct, pickDefaultSize } from "@point/shared/api/point/posTable"
import { useFormatter } from "@point/shared/hooks/useFormatter"
import { cn } from "@point/ui/cn"

import { useParityCapture } from "@/hooks/useParityCapture"
import { useTableMenuCart } from "@/hooks/useTableMenuCart"
import {
  buildMenuTabs,
  filterMenuCategoriesByQuery,
  formatProductMeta,
  itemsForActiveTab,
  POPULAR_TAB_ID,
  partitionMenuItems,
  productImageUrl,
} from "@/utils/tableMenuPresentation"

import { QrMenuTabs } from "./QrMenuTabs"
import { QrParityBackdrop } from "./QrParityBackdrop"
import { qrAssets } from "./qrAssets"

export type QrMenuLayout = "grid" | "list"
export type QrMenuStepperMode = "default" | "always"

interface QrMenuScreenProps {
  categories: PosMenuCategory[]
  checkoutTotal?: number
  currencyFallback: string
  establishmentAddress?: string
  establishmentName?: string
  isEmpty?: boolean
  isError?: boolean
  isLoading?: boolean
  layout?: QrMenuLayout
  linkId: string
  onCheckout?: () => void
  onOpenItem?: (item: PosMenuProduct) => void
  onRetry?: () => void
  ordersOverview?: ReactNode
  searchQuery: string
  stepperMode?: QrMenuStepperMode
  onSearchChange: (value: string) => void
}

function MenuStepper({
  inCartQty,
  isMutating,
  minusIcon,
  onDec,
  onInc,
  plusIcon,
  stopped,
}: {
  inCartQty: number
  isMutating: boolean
  minusIcon: string
  onDec: () => void
  onInc: () => void
  plusIcon: string
  stopped: boolean
}) {
  const qtyShown = inCartQty > 99 ? 99 : Math.round(inCartQty)

  if (inCartQty > 0) {
    return (
      <div className="flex h-[34px] items-center gap-7 rounded-2xl bg-white px-0">
        <button
          aria-label="Уменьшить"
          className="disabled:opacity-40"
          disabled={stopped || isMutating}
          onClick={(e) => {
            e.stopPropagation()
            onDec()
          }}
          type="button"
        >
          <img alt="" className="h-[34px] w-[34px]" src={minusIcon} />
        </button>
        <span className="font-medium text-[17px] text-black">{qtyShown}</span>
        <button
          aria-label="Увеличить"
          className="disabled:opacity-40"
          disabled={stopped || isMutating}
          onClick={(e) => {
            e.stopPropagation()
            onInc()
          }}
          type="button"
        >
          <img alt="" className="h-[34px] w-[34px]" src={plusIcon} />
        </button>
      </div>
    )
  }

  return (
    <button
      aria-label="Добавить"
      className="disabled:opacity-40"
      disabled={stopped || isMutating}
      onClick={(e) => {
        e.stopPropagation()
        onInc()
      }}
      type="button"
    >
      <img alt="" className="h-[34px] w-[34px]" src={plusIcon} />
    </button>
  )
}

function GridCard({
  currencyFallback,
  formatCurrency,
  inCartQty,
  isMutating,
  item,
  onDec,
  onInc,
  onOpen,
  showStepper,
  stepperMode,
}: {
  currencyFallback: string
  formatCurrency: (n: number) => string
  inCartQty: number
  isMutating: boolean
  item: PosMenuProduct
  onDec: () => void
  onInc: () => void
  onOpen: () => void
  showStepper: boolean
  stepperMode: QrMenuStepperMode
}) {
  const image = productImageUrl(item) ?? qrAssets.dish1
  const price = pickDefaultSize(item).price
  const priceLabel = price != null ? `${formatCurrency(price)} ${currencyFallback}` : "—"
  const stepperVisible = showStepper && (stepperMode === "always" || inCartQty > 0)

  return (
    <div className={cn("rounded-2xl bg-white p-2", item.is_stopped && "opacity-50")}>
      <button className="relative w-full text-left" onClick={onOpen} type="button">
        <img alt="" className="h-40 w-full rounded-[14px] object-cover" src={image} />
        <div className="absolute right-2 bottom-2 left-2 flex justify-center">
          {stepperVisible ? (
            <MenuStepper
              inCartQty={inCartQty}
              isMutating={isMutating}
              minusIcon={qrAssets.minusGrid}
              onDec={onDec}
              onInc={onInc}
              plusIcon={qrAssets.plusGrid}
              stopped={item.is_stopped}
            />
          ) : (
            <div className="ml-auto">
              <MenuStepper
                inCartQty={0}
                isMutating={isMutating}
                minusIcon={qrAssets.minusGrid}
                onDec={onDec}
                onInc={onInc}
                plusIcon={qrAssets.plusSm}
                stopped={item.is_stopped}
              />
            </div>
          )}
        </div>
      </button>
      <div className="mt-3 space-y-0.5 px-1">
        <p className="font-medium text-[#222222] text-[17px]">{priceLabel}</p>
        <p className="text-[#222222] text-[15px]">{item.name}</p>
        <p className="text-[#707579] text-[14px]">{formatProductMeta(item)}</p>
      </div>
    </div>
  )
}

function ListRow({
  currencyFallback,
  formatCurrency,
  inCartQty,
  isMutating,
  item,
  onDec,
  onInc,
  onOpen,
  showStepper,
  stepperMode,
}: {
  currencyFallback: string
  formatCurrency: (n: number) => string
  inCartQty: number
  isMutating: boolean
  item: PosMenuProduct
  onDec: () => void
  onInc: () => void
  onOpen: () => void
  showStepper: boolean
  stepperMode: QrMenuStepperMode
}) {
  const price = pickDefaultSize(item).price
  const priceLabel = price != null ? `${formatCurrency(price)} ${currencyFallback}` : "—"
  const stepperVisible = showStepper && (stepperMode === "always" || inCartQty > 0)

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl bg-white px-4 py-3",
        item.is_stopped && "opacity-50"
      )}
    >
      <button className="min-w-0 flex-1 space-y-0.5 text-left" onClick={onOpen} type="button">
        <p className="font-medium text-[#222222] text-[17px]">{priceLabel}</p>
        <p className="text-[#222222] text-[15px]">{item.name}</p>
        <p className="text-[#707579] text-[14px]">{formatProductMeta(item)}</p>
      </button>
      {stepperVisible ? (
        <div className="rounded-2xl bg-[#efeff4]">
          <MenuStepper
            inCartQty={inCartQty}
            isMutating={isMutating}
            minusIcon={qrAssets.minus}
            onDec={onDec}
            onInc={onInc}
            plusIcon={qrAssets.plus}
            stopped={item.is_stopped}
          />
        </div>
      ) : (
        <MenuStepper
          inCartQty={0}
          isMutating={isMutating}
          minusIcon={qrAssets.minus}
          onDec={onDec}
          onInc={onInc}
          plusIcon={qrAssets.add}
          stopped={item.is_stopped}
        />
      )}
    </div>
  )
}

export function QrMenuScreen({
  categories,
  checkoutTotal = 0,
  currencyFallback,
  establishmentAddress,
  establishmentName,
  isEmpty,
  isError,
  isLoading,
  layout = "grid",
  linkId: _linkId,
  onCheckout,
  onOpenItem,
  onRetry,
  ordersOverview,
  searchQuery,
  stepperMode = "default",
  onSearchChange,
}: QrMenuScreenProps) {
  const { t } = useTranslation()
  const parityCapture = useParityCapture()
  const { formatCurrency } = useFormatter()
  const { cartQtyByMenuItemId, decrementItem, incrementItem, isMutating } = useTableMenuCart()
  const [activeTab, setActiveTab] = useState(POPULAR_TAB_ID)

  const filteredCategories = useMemo(
    () => filterMenuCategoriesByQuery(categories, searchQuery),
    [categories, searchQuery]
  )

  const tabs = useMemo(
    () => (parityCapture ? [] : buildMenuTabs(categories, t("WAVE1.QR.MENU_TAB_POPULAR"))),
    [categories, parityCapture, t]
  )

  const sections = useMemo(() => itemsForActiveTab(filteredCategories, activeTab), [activeTab, filteredCategories])

  if (isLoading) {
    return (
      <div className="space-y-3 bg-[#efeff4] px-4 pt-2 pb-28">
        <div className="h-20 animate-pulse rounded-2xl bg-white" />
        <div className="h-12 animate-pulse rounded-[14px] bg-black/[0.04]" />
        <div className="h-12 animate-pulse rounded-2xl bg-white" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
          <div className="h-56 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-[#efeff4] px-4 py-12 text-center">
        <p className="text-[#8d969d] text-[15px]">{t("WAVE1.QR.MENU_LOAD_ERROR")}</p>
        {onRetry ? (
          <button
            className="mt-4 rounded-xl bg-accent px-4 py-2 text-[15px] text-white"
            onClick={onRetry}
            type="button"
          >
            {t("WAVE1.QR.MENU_RETRY")}
          </button>
        ) : null}
      </div>
    )
  }

  const renderItemControls = (item: PosMenuProduct) => ({
    inCartQty: cartQtyByMenuItemId.get(item.id) ?? 0,
    onDec: () => decrementItem(item),
    onInc: () => incrementItem(item),
    onOpen: () => onOpenItem?.(item),
  })

  return (
    <>
      <QrParityBackdrop enabled={parityCapture} />
      <div className={cn("relative min-h-screen space-y-3 bg-[#efeff4] px-4 pt-2 pb-28", parityCapture && "hidden")}>
        {ordersOverview}

        <div className="rounded-2xl bg-white px-4 py-2.5">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#dab072]">
              <img alt="" className="absolute inset-0 h-full w-full object-cover" src={qrAssets.logo1} />
              <img alt="" className="absolute inset-0 h-full w-full object-cover" src={qrAssets.logo2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="font-medium text-[#222222] text-[17px]">
                  {establishmentName ?? t("WAVE1.QR.RESTAURANT")}
                </p>
                <img alt="" className="h-3.5 w-3.5" src={qrAssets.verified} />
              </div>
              <p className="text-[#8d969d] text-[15px]">{establishmentAddress ?? t("WAVE1.QR.RESTAURANT_ADDRESS")}</p>
            </div>
            <img alt="" className="h-11 w-11 shrink-0" src={qrAssets.shop} />
          </div>
        </div>

        <div className="flex h-[46px] items-center rounded-[14px] bg-black/[0.04] px-3">
          <img alt="" className="mr-2 h-5 w-5" src={qrAssets.search} />
          <input
            className="w-full bg-transparent text-[#222222] text-[15px] outline-none placeholder:text-[#8d969d]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("WAVE1.QR.SEARCH")}
            value={searchQuery}
          />
        </div>

        {parityCapture ? (
          <QrMenuTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: "popular", label: t("WAVE1.QR.MENU_TAB_POPULAR") },
              { id: "soups", label: t("WAVE1.QR.MENU_TAB_SOUPS") },
              { id: "pizza", label: t("WAVE1.QR.MENU_TAB_PIZZA") },
              { id: "drinks", label: t("WAVE1.QR.MENU_TAB_DRINKS") },
              { id: "salads", label: t("WAVE1.QR.MENU_TAB_SALADS") },
            ]}
          />
        ) : tabs.length > 0 ? (
          <QrMenuTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
        ) : null}

        {isEmpty || !filteredCategories.length ? (
          <p className="py-8 text-center text-[#8d969d] text-[15px]">{t("WAVE1.QR.MENU_EMPTY")}</p>
        ) : (
          sections.map((section) => {
            const { gridItems, listItems } = partitionMenuItems(section.items, layout)
            return (
              <div key={section.sectionTitle ?? activeTab}>
                {section.sectionTitle ? (
                  <p className="mb-2 px-1 text-[#707579] text-[13px] uppercase">{section.sectionTitle}</p>
                ) : null}
                {gridItems.length > 0 ? (
                  <div className="mb-3 grid grid-cols-2 gap-3">
                    {gridItems.map((item) => {
                      const controls = renderItemControls(item)
                      return (
                        <GridCard
                          currencyFallback={currencyFallback}
                          formatCurrency={formatCurrency}
                          isMutating={isMutating}
                          item={item}
                          key={item.id}
                          showStepper
                          stepperMode={stepperMode}
                          {...controls}
                        />
                      )
                    })}
                  </div>
                ) : null}
                {listItems.length > 0 ? (
                  <div className="space-y-3">
                    {listItems.map((item) => {
                      const controls = renderItemControls(item)
                      return (
                        <ListRow
                          currencyFallback={currencyFallback}
                          formatCurrency={formatCurrency}
                          isMutating={isMutating}
                          item={item}
                          key={item.id}
                          showStepper
                          stepperMode={stepperMode}
                          {...controls}
                        />
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })
        )}

        {checkoutTotal > 0 ? (
          <button
            className="fixed right-4 bottom-6 z-30 flex items-center gap-3 rounded-full bg-accent px-4 py-3 font-semibold text-[20px] text-white shadow-lg"
            onClick={onCheckout}
            type="button"
          >
            <span>
              {formatCurrency(checkoutTotal)} {currencyFallback}
            </span>
            <img alt="" className="h-5 w-[18px]" src={qrAssets.bag} />
          </button>
        ) : null}
      </div>
    </>
  )
}
