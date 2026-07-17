'use client'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Cafe } from '@/types'
import CafePopcard from '@/components/cafe/CafePopcard'

const cupIcon = new L.Icon({
  iconUrl:      '/icons/coffee_cup_transparent.png',
  iconSize:     [34, 44],
  iconAnchor:   [17, 22],
  popupAnchor:  [0, -22],
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
      eventHandlers={{ click: () => onClick?.(cafe) }}
    >
      <Popup>
        <CafePopcard cafe={cafe} />
      </Popup>
    </Marker>
  )
}
