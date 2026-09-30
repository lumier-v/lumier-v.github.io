/**
 * Opening hours for the Al Ghat shop, evaluated in Riyadh time regardless of
 * where the visitor is. Ranges are minutes-of-week with Sunday 00:00 as zero,
 * which lets a session that crosses midnight (Friday runs to 1am Saturday) stay
 * one contiguous range instead of being split across two days.
 */
export type MoonPhase = 'full' | 'half' | 'crescent'

export interface Schedule {
  /** Day label key, resolved through the dictionary. */
  id: string
  /** [start, end) in minutes of week, Sunday 00:00 = 0. */
  ranges: [number, number][]
  /** Fuller moon = longer day. Thursday is 24h, so it gets the full moon. */
  phase: MoonPhase
}

const DAY = 1440

export const SCHEDULE: Schedule[] = [
  {
    id: 'sunWed',
    phase: 'half',
    ranges: [
      [420, DAY], // Sun 07:00 → 24:00
      [DAY + 420, 2 * DAY],
      [2 * DAY + 420, 3 * DAY],
      [3 * DAY + 420, 4 * DAY],
    ],
  },
  { id: 'thu', phase: 'full', ranges: [[4 * DAY, 5 * DAY]] }, // 24 hours
  { id: 'fri', phase: 'crescent', ranges: [[5 * DAY + 690, 6 * DAY + 60]] }, // 11:30 → 01:00
  { id: 'sat', phase: 'crescent', ranges: [[6 * DAY + 690, 7 * DAY]] }, // 11:30 → 24:00
]

const ALL_RANGES: [number, number][] = SCHEDULE.flatMap((s) => s.ranges)

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

/** Current minute of the week in Asia/Riyadh, or null if Intl misbehaves. */
export function riyadhMinuteOfWeek(now: Date = new Date()): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Riyadh',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(now)

    const map: Record<string, string> = {}
    for (const p of parts) map[p.type] = p.value

    const day = WEEKDAY_INDEX[map.weekday]
    if (day === undefined) return null

    // Some engines render midnight as hour 24 rather than 00.
    let hour = Number.parseInt(map.hour, 10)
    if (hour === 24) hour = 0

    return day * DAY + hour * 60 + Number.parseInt(map.minute, 10)
  } catch {
    return null
  }
}

export function isOpenAt(minuteOfWeek: number): boolean {
  return ALL_RANGES.some(([start, end]) => minuteOfWeek >= start && minuteOfWeek < end)
}

/** True when open now. Null when the time could not be determined at all. */
export function isOpenNow(now: Date = new Date()): boolean | null {
  const t = riyadhMinuteOfWeek(now)
  return t === null ? null : isOpenAt(t)
}
