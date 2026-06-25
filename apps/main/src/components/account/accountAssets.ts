export const accountAssets = {
  actionBell: "/parity/account/action-bell.svg",
  actionScanner: "/parity/account/action-scanner.svg",
  calendar: "/parity/account/calendar.svg",
  chevron: "/parity/account/chevron.svg",
  expertThumb: "/parity/account/expert-thumb.svg",
  logoDuo: "/parity/account/logo-duo.png",
  logoKBakery: "/parity/account/logo-k-bakery.png",
  logoManul: "/parity/account/logo-manul.png",
  logoMeat: "/parity/account/logo-meat.png",
  logoOsteria: "/parity/account/logo-osteria.png",
  logoTanuki: "/parity/account/logo-tanuki.png",
  menuBusiness: "/parity/account/menu-business.svg",
  menuHistory: "/parity/account/menu-history.svg",
  menuInfo: "/parity/account/menu-info.svg",
  menuLanguage: "/parity/account/menu-language.svg",
  menuMyProfile: "/parity/account/menu-my-profile.svg",
  menuPayment: "/parity/account/menu-payment.svg",
  menuSupport: "/parity/account/menu-support.svg",
  notifBonus: "/parity/account/notif-bonus.png",
  notifItaly: "/parity/account/notif-italy.png",
  notifMax: "/parity/account/notif-max.png",
  notifMeat: "/parity/account/notif-meat.png",
  notifStar: "/parity/account/notif-star.png",
  search: "/parity/account/search.svg",
  unreadDot: "/parity/account/unread-dot.svg",
} as const

export function formatAccountAmount(amount: number, currency = "RUB") {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  if (currency === "RUB") {
    return `${formatted} ₽`
  }

  return `${formatted} ${currency}`
}
