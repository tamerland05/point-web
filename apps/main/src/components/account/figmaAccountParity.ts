import type { AccountOrderHistoryItemDTO } from "@point/shared/api/point/accountHistory"
import type { UserNotificationDTO } from "@point/shared/api/point/notifications"

import { accountAssets } from "./accountAssets"

export interface FigmaNotificationItem extends UserNotificationDTO {
  icon: string
}

export interface FigmaHistoryItem extends AccountOrderHistoryItemDTO {
  icon: string
}

export function buildFigmaNotifications(t: (key: string) => string): FigmaNotificationItem[] {
  return [
    {
      createdAt: new Date().toISOString(),
      icon: accountAssets.notifItaly,
      id: "figma-ntf-1",
      read: false,
      text: t("WAVE1.NOTIFICATIONS.ITEM_1_TEXT"),
      title: t("WAVE1.NOTIFICATIONS.ITEM_1_TITLE"),
    },
    {
      createdAt: new Date().toISOString(),
      icon: accountAssets.notifStar,
      id: "figma-ntf-2",
      read: false,
      text: t("WAVE1.NOTIFICATIONS.ITEM_2_TEXT"),
      title: t("WAVE1.NOTIFICATIONS.ITEM_2_TITLE"),
    },
    {
      createdAt: new Date().toISOString(),
      icon: accountAssets.notifBonus,
      id: "figma-ntf-3",
      read: true,
      text: t("WAVE1.NOTIFICATIONS.ITEM_3_TEXT"),
      title: t("WAVE1.NOTIFICATIONS.ITEM_3_TITLE"),
    },
    {
      createdAt: new Date().toISOString(),
      icon: accountAssets.notifMax,
      id: "figma-ntf-4",
      read: true,
      text: t("WAVE1.NOTIFICATIONS.ITEM_4_TEXT"),
      title: t("WAVE1.NOTIFICATIONS.ITEM_4_TITLE"),
    },
    {
      createdAt: new Date().toISOString(),
      icon: accountAssets.notifMeat,
      id: "figma-ntf-5",
      read: true,
      text: t("WAVE1.NOTIFICATIONS.ITEM_5_TEXT"),
      title: t("WAVE1.NOTIFICATIONS.ITEM_5_TITLE"),
    },
  ]
}

export function buildFigmaHistory(t: (key: string) => string): {
  today: FigmaHistoryItem[]
  week: FigmaHistoryItem[]
  yesterday: FigmaHistoryItem[]
} {
  const now = new Date()

  return {
    today: [
      {
        createdAt: now.toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_K_BAKERY"),
        icon: accountAssets.logoKBakery,
        id: "figma-h-1",
        itemsCount: 2,
        status: "paid",
        totalAmount: 1830,
      },
    ],
    week: [
      {
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_TANUKI"),
        icon: accountAssets.logoTanuki,
        id: "figma-h-4",
        itemsCount: 2,
        status: "paid",
        totalAmount: 3170,
      },
      {
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_OSTERIA"),
        icon: accountAssets.logoOsteria,
        id: "figma-h-5",
        itemsCount: 2,
        status: "paid",
        totalAmount: 1770,
      },
      {
        createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_MEAT"),
        icon: accountAssets.logoMeat,
        id: "figma-h-6",
        itemsCount: 4,
        status: "paid",
        totalAmount: 6470,
      },
    ],
    yesterday: [
      {
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_MANUL"),
        icon: accountAssets.logoManul,
        id: "figma-h-2",
        itemsCount: 4,
        status: "paid",
        totalAmount: 4620,
      },
      {
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "RUB",
        establishmentName: t("WAVE1.HISTORY.ITEM_DUO"),
        icon: accountAssets.logoDuo,
        id: "figma-h-3",
        itemsCount: 4,
        status: "paid",
        totalAmount: 6830,
      },
    ],
  }
}

export function resolveHistoryIcon(name: string): string | undefined {
  const normalized = name.toLowerCase()
  if (normalized.includes("k-bakery") || normalized.includes("bakery")) return accountAssets.logoKBakery
  if (normalized.includes("manul")) return accountAssets.logoManul
  if (normalized.includes("duo")) return accountAssets.logoDuo
  if (normalized.includes("тануки") || normalized.includes("tanuki")) return accountAssets.logoTanuki
  if (normalized.includes("osteria")) return accountAssets.logoOsteria
  if (normalized.includes("мясом") || normalized.includes("meat")) return accountAssets.logoMeat
  return undefined
}

export function resolveNotificationIcon(index: number): string {
  const icons = [
    accountAssets.notifItaly,
    accountAssets.notifStar,
    accountAssets.notifBonus,
    accountAssets.notifMax,
    accountAssets.notifMeat,
  ]

  return icons[index % icons.length] ?? accountAssets.notifItaly
}
