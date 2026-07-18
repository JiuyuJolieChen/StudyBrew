export type BoroughEnum  = 'manhattan' | 'brooklyn' | 'queens' | 'bronx' | 'staten_island'
export type WifiEnum     = 'none' | 'free' | 'paid_or_login'
export type OutletsEnum  = 'none' | 'few' | 'plenty'
export type DeskSizeEnum = 'small' | 'medium' | 'large'
export type SeatsEnum    = 's_0_10' | 's_10_20' | 's_20_30' | 's_30_plus'
export type NoiseEnum    = 'quiet' | 'moderate' | 'lively'

export type DayHours = { open: string; close: string } | null
export type HoursJson = Partial<Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', DayHours>> | null

export interface Cafe {
  id: string
  name: string
  address: string
  borough: BoroughEnum
  neighborhood: string | null
  lat: number
  lng: number
  wifi: WifiEnum
  outlets: OutletsEnum
  desk_size: DeskSizeEnum
  seats: SeatsEnum | null
  hours: HoursJson
  noise: NoiseEnum | null
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface CafeEdit {
  id: string
  cafe_id: string
  changed_fields: Record<string, unknown>
  created_at: string
}

export interface FilterState {
  borough:   BoroughEnum[]
  wifi:      WifiEnum[]
  outlets:   OutletsEnum[]
  noise:     NoiseEnum[]
  desk_size: DeskSizeEnum[]
  seats:     SeatsEnum[]
}

export interface GeoResult {
  display_name: string
  name: string | null
  lat: number
  lng: number
  borough: BoroughEnum | null
  neighborhood: string | null
}
