/** Default POS table link for QR dev entry (`/qr/scan*`). Override via `VITE_DEMO_TABLE_LINK_ID`. */
export const DEMO_TABLE_LINK_ID =
  (import.meta.env["VITE_DEMO_TABLE_LINK_ID"] as string | undefined)?.trim() || "demo-table-1"
