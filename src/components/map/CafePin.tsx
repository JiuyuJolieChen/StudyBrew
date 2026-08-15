'use client'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import posthog from 'posthog-js'
import type { Cafe } from '@/types'
import CafePopcard from '@/components/cafe/CafePopcard'

const cupIcon = L.divIcon({
  className: 'cup-marker',
  html: `
    <svg class="cup-marker-wash" viewBox="0 0 48 58" width="48" height="58" aria-hidden="true">
      <ellipse cx="24" cy="29" rx="12" ry="16" fill="#d9be93" opacity="0.3" filter="url(#sb-icon-wash)" />
    </svg>
    <img class="cup-marker-img" src="/icons/coffee_cup_transparent.png" width="34" height="44" alt="" />
  `,
  iconSize:    [48, 58],
  iconAnchor:  [24, 29],
  popupAnchor: [0, -29],
})

interface Props {
  cafe: Cafe
  onClick?: (cafe: Cafe) => void
}

export default function CafePin({ cafe, onClick }: Props) {
  return (
    <Marker
      position={[cafe.lat, cafe.lng]}
      icon={cupIcon}
      eventHandlers={{ click: () => {
        posthog.capture('cafe_pin_clicked', { cafe_id: cafe.id })
        onClick?.(cafe)
      } }}
    >
      <Popup>
        <CafePopcard cafe={cafe} />
      </Popup>
    </Marker>
  )
}
