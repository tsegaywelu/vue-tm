/**
 * Ethiopian Calendar Utilities
 * Ported from Raaz Project
 */

export interface EthiopianDate {
  year: number
  month: number
  day: number
}

const ETHIOPIAN_EPOCH = 1724221

export function isEthiopianLeap(year: number): boolean {
  return (year + 1) % 4 === 0
}

export function gregorianToJdn(year: number | Date, month?: number, day?: number): number {
  let y: number, m: number, d: number
  if (year instanceof Date) {
    y = year.getUTCFullYear()
    m = year.getUTCMonth() + 1
    d = year.getUTCDate()
  } else {
    y = year
    m = month!
    d = day!
  }

  const yCalc = y > 0 ? y : y + 1
  const a = Math.floor((14 - m) / 12)
  const yFinal = yCalc + 4800 - a
  const mFinal = m + 12 * a - 3

  const jdn = d + Math.floor((153 * mFinal + 2) / 5) + 365 * yFinal +
    Math.floor(yFinal / 4) - Math.floor(yFinal / 100) +
    Math.floor(yFinal / 400) - 32045

  return jdn
}

export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const f = jdn + 1401 + Math.floor((Math.floor((4 * jdn + 274277) / 146097) * 3) / 4) - 38
  const e = 4 * f + 3
  const g = Math.floor((e % 1461) / 4)
  const h = 5 * g + 2
  const d = Math.floor((h % 153) / 5) + 1
  const m = ((Math.floor(h / 153) + 2) % 12) + 1
  const y = Math.floor(e / 1461) - 4716 + Math.floor((14 - m) / 12)

  return { year: y, month: m, day: d }
}

export function ethiopianToJdn(year: number, month: number, day: number): number {
  return (ETHIOPIAN_EPOCH - 1) + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day
}

export function jdnToEthiopian(jdn: number): EthiopianDate {
  const n = jdn - ETHIOPIAN_EPOCH
  const year = Math.floor((4 * n + 3) / 1461) + 1
  const r1 = (4 * n + 3) % 1461
  const days = Math.floor(r1 / 4)

  const month = Math.floor(days / 30) + 1
  const day = (days % 30) + 1

  return { year, month, day }
}

export function toEthiopian(date: Date): EthiopianDate {
  const jdn = gregorianToJdn(date)
  return jdnToEthiopian(jdn)
}

export function toGregorian(year: number, month: number, day: number): Date {
  const jdn = ethiopianToJdn(year, month, day)
  const greg = jdnToGregorian(jdn)
  return new Date(Date.UTC(greg.year, greg.month - 1, greg.day))
}

export const ETHIOPIAN_MONTHS = [
  "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yakatit",
  "Magabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
]

export const AMHARIC_MONTHS = [
  "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
]

export const ENGLISH_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function formatEthiopianDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseEthiopianDate(dateStr: string): EthiopianDate | null {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return null
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null
  return { year, month, day }
}
