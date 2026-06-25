import type { AxiosResponse } from "axios"

import { queryOptions } from "@tanstack/react-query"
import { getDefaultStore } from "jotai"

import posAxiosInstance from "@/api/point/posAxios"
import { posLinkIdAtom } from "@/atoms/posTable"

export const posQueryKeys = {
  menu: (sessionId: string) => ["pos", "menu", sessionId] as const,
  sessionCurrent: ["pos", "session", "current"] as const,
}

/** Nested POS payloads stay snake_case (raw dicts from backend). Root SessionStateOut uses camelCase aliases. */
export interface PosSessionPayload {
  id: string
  status: string
  link_id: string
  establishment_id: string
  /** Present when backend includes establishment in session_state */
  establishment_name?: string
  establishment_address?: string
}

export interface PosOrderItem {
  id: string
  /** POS menu row id; merge in cart + badge on menu (`null` if API omitted). */
  menu_item_id: string | null
  name: string
  price: string
  quantity: number
  product_size_id: string | null
  /** From linked menu item at session snapshot; first non-empty URL may be used as thumbnail */
  image_links?: string[]
}

export interface PosPaymentRow {
  id: string
  status: string
  amount: string
  provider: string
}

export interface PosOrder {
  id: string
  status: string
  total_amount: string
  currency: string | null
  pos_push_status: string | null
  /** Ошибка выгрузки в iiko/POS при последнем confirm_payment; только для диагностики */
  last_error?: string | null
  /** Guest note for the whole draft order; persisted server-side */
  guest_comment?: string | null
  items: PosOrderItem[]
  payments: PosPaymentRow[]
}

export interface PosSessionState {
  session: PosSessionPayload
  orders: PosOrder[]
  /** camelCase from PointBase serialization */
  ledgerBalance: string
}

export interface PosMenuPrice {
  current_price: number
  is_included_in_menu?: boolean
}

export interface PosMenuSizePrice {
  size_id?: string | null
  price: PosMenuPrice
}

export interface PosMenuProduct {
  id: string
  code?: string
  name: string
  /** From POS menu sync; optional */
  description?: string
  order_item_type?: string
  size_prices: PosMenuSizePrice[]
  is_stopped: boolean
  /** Public image URLs from POS sync; empty → no-photo card layout */
  image_links?: string[]
  /** Grams; from POS sync when available */
  weight?: number
  /** kcal; from POS sync when available */
  energy_amount?: number
}

export interface PosMenuCategory {
  id: string
  name: string
  code?: string | null
  categories: PosMenuCategory[]
  items: PosMenuProduct[]
}

export interface PosMenuResponse {
  menu_id: string
  revision: number
  categories: PosMenuCategory[]
}

function readNumericPriceField(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) {
    return v
  }
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number.parseFloat(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

/** Reads `current_price` or `currentPrice` from a menu price blob (API may use either). */
function readMenuPriceCurrent(priceRaw: unknown): number | undefined {
  if (!priceRaw || typeof priceRaw !== "object") {
    return undefined
  }
  const p = priceRaw as Record<string, unknown>
  return readNumericPriceField(p["current_price"] ?? p["currentPrice"])
}

function normalizeMenuPriceBlob(priceRaw: unknown): PosMenuPrice | null {
  const current_price = readMenuPriceCurrent(priceRaw)
  if (current_price === undefined) {
    return null
  }
  if (!priceRaw || typeof priceRaw !== "object") {
    return { current_price }
  }
  const p = priceRaw as Record<string, unknown>
  const inc = p["is_included_in_menu"] ?? p["isIncludedInMenu"]
  return {
    current_price,
    ...(typeof inc === "boolean" ? { is_included_in_menu: inc } : {}),
  }
}

function parseImageLinks(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
}

function normalizeMenuSizePriceRow(raw: unknown): PosMenuSizePrice | null {
  if (!raw || typeof raw !== "object") {
    return null
  }
  const row = raw as Record<string, unknown>
  const price = normalizeMenuPriceBlob(row["price"])
  if (!price) {
    return null
  }
  const sidRaw = row["size_id"] ?? row["sizeId"]
  const size_id = sidRaw === null || sidRaw === undefined ? null : String(sidRaw)
  return { price, size_id }
}

/** Keep first size/price row only; drop items with no displayable price. */
function normalizeMenuProduct(raw: unknown): PosMenuProduct | null {
  if (!raw || typeof raw !== "object") {
    return null
  }
  const p = raw as Record<string, unknown>
  const arr = (p["size_prices"] as unknown[]) ?? (p["sizePrices"] as unknown[]) ?? ([] as unknown[])
  const first = arr[0] !== undefined ? normalizeMenuSizePriceRow(arr[0]) : null
  if (!first) {
    return null
  }
  const stopped = Boolean(p["is_stopped"] ?? p["isStopped"])
  const image_links = parseImageLinks(p["image_links"] ?? p["imageLinks"])
  const descRaw = p["description"]
  const description = descRaw != null && String(descRaw).trim() !== "" ? String(descRaw).trim() : undefined
  const weightRaw = p["weight"]
  const weight = typeof weightRaw === "number" && Number.isFinite(weightRaw) && weightRaw > 0 ? weightRaw : undefined
  const energyRaw = p["energy_amount"] ?? p["energyAmount"]
  const energy_amount =
    typeof energyRaw === "number" && Number.isFinite(energyRaw) && energyRaw > 0 ? energyRaw : undefined
  return {
    code: p["code"] != null ? String(p["code"]) : undefined,
    description,
    id: String(p["id"] ?? ""),
    image_links,
    is_stopped: stopped,
    name: String(p["name"] ?? ""),
    order_item_type:
      p["order_item_type"] != null
        ? String(p["order_item_type"])
        : p["orderItemType"] != null
          ? String(p["orderItemType"])
          : undefined,
    size_prices: [first],
    ...(weight !== undefined ? { weight } : {}),
    ...(energy_amount !== undefined ? { energy_amount } : {}),
  }
}

function normalizeMenuCategory(raw: unknown): PosMenuCategory | null {
  if (!raw || typeof raw !== "object") {
    return null
  }
  const c = raw as Record<string, unknown>
  const nestedRaw = (c["categories"] as unknown[]) ?? []
  const nested = nestedRaw
    .map((sub) => normalizeMenuCategory(sub))
    .filter((sub): sub is PosMenuCategory => sub !== null)

  const itemsRaw = (c["items"] as unknown[]) ?? []
  const items = itemsRaw.map((it) => normalizeMenuProduct(it)).filter((it): it is PosMenuProduct => it !== null)

  if (items.length === 0 && nested.length === 0) {
    return null
  }

  return {
    categories: nested,
    code: c["code"] == null ? null : String(c["code"]),
    id: String(c["id"] ?? ""),
    items,
    name: String(c["name"] ?? ""),
  }
}

export function normalizePosMenuResponse(raw: Record<string, unknown>): PosMenuResponse {
  const menu_id = String(raw["menu_id"] ?? raw["menuId"] ?? "")
  const rev = raw["revision"]
  const revision = typeof rev === "number" ? rev : Number.parseInt(String(rev ?? "0"), 10) || 0
  const catsRaw = (raw["categories"] as unknown[]) ?? []
  const categories = catsRaw
    .map((cat) => normalizeMenuCategory(cat))
    .filter((cat): cat is PosMenuCategory => cat !== null)

  return { categories, menu_id, revision }
}

function normalizePosOrder(raw: unknown): PosOrder | null {
  if (!raw || typeof raw !== "object") {
    return null
  }
  const o = raw as Record<string, unknown>
  const id = o["id"] ?? o["orderId"]
  const status = o["status"]
  if (typeof id !== "string" || typeof status !== "string") {
    return null
  }
  const itemsRaw = (o["items"] as unknown[]) ?? []
  const items: PosOrderItem[] = itemsRaw
    .map((it) => {
      if (!it || typeof it !== "object") {
        return null
      }
      const row = it as Record<string, unknown>
      const iid = row["id"]
      const name = row["name"]
      const price = row["price"]
      const qtyRaw = row["quantity"]
      const qty = typeof qtyRaw === "number" ? qtyRaw : Number.parseFloat(String(qtyRaw ?? ""))
      if (typeof iid !== "string" || typeof name !== "string" || typeof price !== "string" || !Number.isFinite(qty)) {
        return null
      }
      const productSizeId =
        row["product_size_id"] != null
          ? String(row["product_size_id"])
          : row["productSizeId"] != null
            ? String(row["productSizeId"])
            : null
      const imageLinksRaw = row["image_links"] ?? row["imageLinks"]
      const image_links = Array.isArray(imageLinksRaw)
        ? imageLinksRaw.filter((u): u is string => typeof u === "string" && u.trim() !== "")
        : undefined
      const menuItemIdRaw =
        row["menu_item_id"] ?? row["menuItemId"] ?? row["external_menu_item_id"] ?? row["externalMenuItemId"]
      const menu_item_id: string | null = menuItemIdRaw != null && menuItemIdRaw !== "" ? String(menuItemIdRaw) : null
      return {
        id: iid,
        menu_item_id,
        name,
        price,
        product_size_id: productSizeId,
        quantity: qty,
        ...(image_links?.length ? { image_links } : {}),
      }
    })
    .filter((x): x is PosOrderItem => x != null)

  const paymentsRaw = (o["payments"] as unknown[]) ?? []
  const payments: PosPaymentRow[] = paymentsRaw
    .map((p) => {
      if (!p || typeof p !== "object") {
        return null
      }
      const row = p as Record<string, unknown>
      const pid = row["id"]
      const pst = row["status"]
      const amt = row["amount"]
      const prov = row["provider"]
      if (typeof pid !== "string" || typeof pst !== "string" || typeof amt !== "string" || typeof prov !== "string") {
        return null
      }
      return { amount: amt, id: pid, provider: prov, status: pst }
    })
    .filter((x): x is PosPaymentRow => x != null)

  const totalAmount =
    o["total_amount"] != null ? String(o["total_amount"]) : o["totalAmount"] != null ? String(o["totalAmount"]) : ""
  const currency =
    o["currency"] === null || o["currency"] === undefined
      ? null
      : typeof o["currency"] === "string"
        ? o["currency"]
        : String(o["currency"])
  const posPush = o["pos_push_status"] ?? o["posPushStatus"]
  const lastErr = o["last_error"] ?? o["lastError"]
  const guestRaw = o["guest_comment"] ?? o["guestComment"]

  return {
    currency,
    guest_comment: guestRaw == null || guestRaw === "" ? null : String(guestRaw),
    id,
    items,
    last_error: lastErr == null || lastErr === "" ? null : typeof lastErr === "string" ? lastErr : String(lastErr),
    payments,
    pos_push_status: posPush != null && posPush !== "" ? String(posPush) : null,
    status,
    total_amount: totalAmount,
  }
}

function normalizeSessionState(raw: Record<string, unknown>): PosSessionState {
  const r = raw as {
    ledgerBalance?: string
    ledger_balance?: string
    orders?: unknown[]
    session?: PosSessionPayload
  }

  const ledgerBalance =
    typeof r.ledgerBalance === "string"
      ? r.ledgerBalance
      : typeof r.ledger_balance === "string"
        ? r.ledger_balance
        : "0"

  const ordersRaw = r.orders ?? []
  const orders = ordersRaw.map(normalizePosOrder).filter((x): x is PosOrder => x != null)

  return {
    ledgerBalance,
    orders,
    session: r.session as PosSessionPayload,
  }
}

function _resolvePosLinkId(): string {
  const resolved = (getDefaultStore().get(posLinkIdAtom) ?? "").trim()
  if (!resolved) {
    throw new Error("Нет linkId POS-сессии")
  }
  return resolved
}

export async function fetchPosSessionCurrent(): Promise<PosSessionState> {
  const response = await posAxiosInstance.get<Record<string, unknown>>("/point/pos/sessions/current", {
    params: { link_id: _resolvePosLinkId() },
  })
  return normalizeSessionState(response.data)
}

export async function fetchPosMenu(sessionId: string): Promise<PosMenuResponse> {
  const response = await posAxiosInstance.get<Record<string, unknown>>(`/point/pos/sessions/${sessionId}/menu`)
  return normalizePosMenuResponse(response.data)
}

export function posSessionCurrentQueryOptions(opts: { enabled: boolean }) {
  return queryOptions({
    enabled: opts.enabled,
    queryFn: fetchPosSessionCurrent,
    queryKey: posQueryKeys.sessionCurrent,
    staleTime: 0,
  })
}

export function posMenuQueryOptions(sessionId: string | null, opts: { enabled: boolean }) {
  return queryOptions({
    enabled: !!sessionId && opts.enabled,
    queryFn: () => fetchPosMenu(sessionId as string),
    queryKey: posQueryKeys.menu(sessionId ?? ""),
    staleTime: 60_000,
  })
}

export async function createPosOrder(sessionId: string): Promise<{ orderId: string }> {
  const response = await posAxiosInstance.post<{ orderId: string }>(`/point/pos/sessions/${sessionId}/orders`, {})
  return response.data
}

export async function addPosOrderItem(params: {
  sessionId: string
  orderId: string
  menuItemId: string
  quantity: number
  productSizeId?: string | null
  idempotencyKey?: string
}): Promise<void> {
  const headers: Record<string, string> = {}
  if (params.idempotencyKey) {
    headers["Idempotency-Key"] = params.idempotencyKey
  }
  await posAxiosInstance.post(
    `/point/pos/sessions/${params.sessionId}/orders/${params.orderId}/items`,
    {
      menuItemId: params.menuItemId,
      productSizeId: params.productSizeId ?? null,
      quantity: params.quantity,
    },
    { headers }
  )
}

export async function patchPosOrderItem(params: {
  sessionId: string
  orderId: string
  itemId: string
  quantity: number
}): Promise<void> {
  await posAxiosInstance.patch(
    `/point/pos/sessions/${params.sessionId}/orders/${params.orderId}/items/${params.itemId}`,
    { quantity: params.quantity }
  )
}

export async function deletePosOrderItem(params: {
  sessionId: string
  orderId: string
  itemId: string
}): Promise<void> {
  await posAxiosInstance.delete(
    `/point/pos/sessions/${params.sessionId}/orders/${params.orderId}/items/${params.itemId}`
  )
}

export async function patchPosDraftOrder(params: {
  sessionId: string
  orderId: string
  guestComment: string | null
}): Promise<void> {
  const body = { guest_comment: params.guestComment, guestComment: params.guestComment }
  const patchUrl = `/point/pos/sessions/${params.sessionId}/orders/${params.orderId}`
  const postUrl = `${patchUrl}/comment`
  try {
    await posAxiosInstance.patch(patchUrl, body)
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } })?.response?.status
    if (status === 404) {
      await posAxiosInstance.post(postUrl, body)
      return
    }
    throw e
  }
}

export async function checkoutPosOrder(
  sessionId: string,
  orderId: string
): Promise<{
  orderId: string
  paymentId: string
  totalAmount: string
  status: string
}> {
  const response = await posAxiosInstance.post<
    { orderId: string; paymentId: string; totalAmount: string; status: string },
    AxiosResponse<{ orderId: string; paymentId: string; totalAmount: string; status: string }>
  >(`/point/pos/sessions/${sessionId}/orders/${orderId}/checkout`, {})
  return response.data
}

export async function initPosPayment(
  sessionId: string,
  orderId: string
): Promise<{
  paymentId: string
  checkoutUrl: string
}> {
  const response = await posAxiosInstance.post<{ paymentId: string; checkoutUrl: string }>(
    `/point/pos/sessions/${sessionId}/orders/${orderId}/payments`,
    {}
  )
  return response.data
}

export async function fetchPosCommandStatus(sessionId: string, correlationId: string): Promise<unknown> {
  const response = await posAxiosInstance.get(`/point/pos/sessions/${sessionId}/commands/${correlationId}`)
  return response.data
}

export function findDraftOrder(orders: PosOrder[]): PosOrder | undefined {
  return orders.find((o) => typeof o.status === "string" && o.status.toLowerCase() === "draft")
}

/** Total quantity in draft per menu item (any size), for menu list badges. */
export function draftCartQtyByMenuItemId(orders: PosOrder[]): ReadonlyMap<string, number> {
  const draft = findDraftOrder(orders)
  const m = new Map<string, number>()
  if (!draft) {
    return m
  }
  for (const li of draft.items) {
    const mid = li.menu_item_id
    if (mid === null || mid === "") {
      continue
    }
    m.set(mid, (m.get(mid) ?? 0) + li.quantity)
  }
  return m
}

/** Первая строка черновика по `menu_item_id` (для PATCH/DELETE со строки меню). */
export function draftLineByMenuItemId(orders: PosOrder[]): ReadonlyMap<string, { lineId: string; orderId: string }> {
  const draft = findDraftOrder(orders)
  const m = new Map<string, { lineId: string; orderId: string }>()
  if (!draft) {
    return m
  }
  for (const li of draft.items) {
    const mid = li.menu_item_id
    if (mid === null || mid === "") {
      continue
    }
    if (!m.has(mid)) {
      m.set(mid, { lineId: li.id, orderId: draft.id })
    }
  }
  return m
}

function _posProductSizeKey(productSizeId: string | null | undefined): string {
  if (productSizeId == null || productSizeId === "") {
    return "__default__"
  }
  return String(productSizeId)
}

/** Строка черновика для пары «позиция меню + размер» (экран блюда, PATCH вместо лишнего add). */
export function draftLineForMenuItemAndSize(
  orders: PosOrder[],
  menuItemId: string,
  productSizeId: string | null
): { lineId: string; orderId: string; quantity: number } | null {
  const draft = findDraftOrder(orders)
  if (!draft) {
    return null
  }
  const want = _posProductSizeKey(productSizeId)
  for (const li of draft.items) {
    if (li.menu_item_id !== menuItemId) {
      continue
    }
    if (_posProductSizeKey(li.product_size_id) !== want) {
      continue
    }
    return { lineId: li.id, orderId: draft.id, quantity: li.quantity }
  }
  return null
}

/** Сравнение статуса заказа без учёта регистра (ответ API может отличаться по кейсу). */
export function posOrderHasStatus(order: PosOrder | undefined, status: string): boolean {
  return typeof order?.status === "string" && order.status.toLowerCase() === status.toLowerCase()
}

export function findAwaitingPaymentOrder(orders: PosOrder[]): PosOrder | undefined {
  return orders.find((o) => posOrderHasStatus(o, "awaiting_payment"))
}

export function findLatestPaidOrder(orders: PosOrder[]): PosOrder | undefined {
  return orders.find((o) => posOrderHasStatus(o, "paid"))
}

export function pickDefaultSize(product: PosMenuProduct): { sizeId: string | null; price: number | null } {
  const prices = product.size_prices ?? []
  const first = prices[0]
  if (!first?.price) {
    return { price: null, sizeId: null }
  }
  const sid = first.size_id ?? null
  return {
    price: first.price.current_price ?? null,
    sizeId: sid === undefined ? null : sid,
  }
}

export function flattenMenuProducts(categories: PosMenuCategory[]): PosMenuProduct[] {
  const out: PosMenuProduct[] = []
  const walk = (nodes: PosMenuCategory[]) => {
    for (const c of nodes) {
      out.push(...c.items)
      if (c.categories?.length) {
        walk(c.categories)
      }
    }
  }
  walk(categories)
  return out
}

export function findMenuProductWithCategory(
  menu: PosMenuResponse | undefined,
  menuItemId: string
): { product: PosMenuProduct; categoryName: string } | undefined {
  if (!menu) {
    return undefined
  }

  const walk = (nodes: PosMenuCategory[]): { product: PosMenuProduct; categoryName: string } | undefined => {
    for (const c of nodes) {
      const hit = c.items.find((i) => i.id === menuItemId)
      if (hit) {
        return { categoryName: c.name, product: hit }
      }
      if (c.categories?.length) {
        const nested = walk(c.categories)
        if (nested) {
          return nested
        }
      }
    }
    return undefined
  }
  return walk(menu.categories)
}

export function findMenuProduct(menu: PosMenuResponse | undefined, menuItemId: string): PosMenuProduct | undefined {
  return findMenuProductWithCategory(menu, menuItemId)?.product
}
