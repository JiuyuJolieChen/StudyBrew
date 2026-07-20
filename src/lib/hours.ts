import type { HoursJson } from '@/types'
import { DAYS } from './constants'

export function getTodayHoursLabel(hours: HoursJson): string {
  if (!hours) return 'Hours unknown'
  const todayKey = DAYS[(new Date().getDay() + 6) % 7]
  const entry = hours[todayKey]
  return entry ? `${entry.open} – ${entry.close}` : 'Closed today'
}
