/** Default booking slot: now, seconds/ms cleared. */
export function createInitialBookingDateTime(): Date {
  const date = new Date()
  date.setSeconds(0, 0)
  return date
}

export function shiftBookingDateTime(date: Date, dayOffset: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + dayOffset)
  return next
}
