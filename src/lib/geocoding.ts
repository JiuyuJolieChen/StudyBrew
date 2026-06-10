import type { BoroughEnum } from '@/types'

interface NominatimAddress {
  city_district?: string
  suburb?: string
  borough?: string
  county?: string
  neighbourhood?: string
  [key: string]: string | undefined
}

const BOROUGH_MAP: Record<string, BoroughEnum> = {
  'Manhattan':       'manhattan',
  'Brooklyn':        'brooklyn',
  'Queens':          'queens',
  'The Bronx':       'bronx',
  'Bronx':           'bronx',
  'Staten Island':   'staten_island',
  'New York County': 'manhattan',
  'Kings County':    'brooklyn',
  'Queens County':   'queens',
  'Bronx County':    'bronx',
  'Richmond County': 'staten_island',
}

export function inferBorough(address: NominatimAddress): BoroughEnum | null {
  const candidates = [
    address.city_district,
    address.suburb,
    address.borough,
    address.county,
  ]
  for (const c of candidates) {
    if (c && BOROUGH_MAP[c]) return BOROUGH_MAP[c]
  }
  return null
}

export function inferNeighborhood(address: NominatimAddress): string | null {
  return address.neighbourhood ?? address.suburb ?? null
}
