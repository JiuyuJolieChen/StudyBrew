'use client'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Cafe } from '@/types'
import CafePopcard from '@/components/cafe/CafePopcard'

const defaultIcon = new L.Icon({
  iconUrl:      '/icons/pin-default.svg',
  iconSize:     [24, 32],
  iconAnchor:   [12, 32],
  popupAnchor:  [0, -32],
})

const unknownIcon = new L.Icon({
  iconUrl:      '/icons/pin-unknown.svg',
  iconSize:     [24, 32],
  iconAnchor:   [12, 32],
  popupAnchor:  [0, -32],
})

interface Props {
  cafe: Cafe
  onClick?: (cafe: Cafe) => void
}

export default function CafePin({ cafe, onClick }: Props) {
  const icon = cafe.hours ? defaultIcon : unknownIcon

  return (
    <Marker
      position={[cafe.lat, cafe.lng]}
      icon={icon}
      eventHandlers={{ click: () => onClick?.(cafe) }}
    >
      <Popup>
        <CafePopcard cafe={cafe} />
      </Popup>
    </Marker>
  )
}
