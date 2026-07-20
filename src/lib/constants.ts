import type { BoroughEnum, WifiEnum, OutletsEnum, DeskSizeEnum, SeatsEnum, NoiseEnum } from '@/types'

export const NYC_CENTER: [number, number] = [40.7128, -74.006]
export const NYC_BOUNDS: [[number, number], [number, number]] = [
  [40.4, -74.27],
  [40.95, -73.68],
]

export const BOROUGH_LABELS: Record<BoroughEnum, string> = {
  manhattan:     'Manhattan',
  brooklyn:      'Brooklyn',
  queens:        'Queens',
  bronx:         'The Bronx',
  staten_island: 'Staten Island',
}

export const WIFI_LABELS: Record<WifiEnum, string> = {
  none:          'No WiFi',
  free:          'Free WiFi',
  paid_or_login: 'Free WiFi',
}

export const WIFI_FORM_LABELS: Record<WifiEnum, string> = {
  none:          'No WiFi',
  free:          'Free WiFi',
  paid_or_login: 'Paid / Login',
}

export const WIFI_FILTER_GROUPS: { key: 'none' | 'have_wifi'; values: WifiEnum[]; label: string }[] = [
  { key: 'none',      values: ['none'],                 label: 'No WiFi' },
  { key: 'have_wifi', values: ['free', 'paid_or_login'], label: 'Free WiFi' },
]

export const OUTLETS_LABELS: Record<OutletsEnum, string> = {
  none:   'No outlets',
  few:    'Few outlets',
  plenty: 'Plenty of outlets',
}

export const DESK_SIZE_LABELS: Record<DeskSizeEnum, string> = {
  small:  'Small desks',
  medium: 'Medium desks',
  large:  'Large desks',
}

export const SEATS_LABELS: Record<SeatsEnum, string> = {
  s_0_10:   '0-10 seats',
  s_10_20:  '10-20 seats',
  s_20_30:  '20-30 seats',
  s_30_plus: '30+ seats',
}

export const NOISE_LABELS: Record<NoiseEnum, string> = {
  quiet:    'Quiet',
  moderate: 'Moderate',
  lively:   'Lively',
}

export const AMENITY_ICONS = {
  wifi:      '/icons/wifi.png',
  outlets:   '/icons/outlet.png',
  desk_size: '/icons/table.png',
  seats:     '/icons/seat.png',
  noise:     '/icons/noise.png',
} as const

export const CHECKBOX_ICONS = {
  unchecked: '/icons/checkbox-unchecked.png',
  checked:   '/icons/checkbox-checked.png',
} as const

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type Day = typeof DAYS[number]

export const DAY_LABELS: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}
