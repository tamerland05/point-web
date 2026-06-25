import { redirect } from "@tanstack/react-router"

/** Legacy earn flow from pre–Wave-1 product. Disabled in favor of Figma «Лояльность» tab. */
export const EARN_LEGACY_ENABLED = false

export function earnLegacyBeforeLoad() {
  if (!EARN_LEGACY_ENABLED) {
    throw redirect({ replace: true, to: "/loyalty" })
  }
}
