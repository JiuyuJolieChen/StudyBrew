'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Cafe } from '@/types'
import { NYC_CENTER, NYC_BOUNDS } from '@/lib/constants'
import CafePin from './CafePin'
import styles from './MapContainer.module.css'

// Fix webpack-broken default icon paths once
L.Icon.Default.mergeOptions({
  iconUrl:       '/icons/pin-default.svg',
  iconRetinaUrl: '/icons/pin-default.svg',
  shadowUrl:     '',
  shadowSize:    [0, 0],
  iconSize:      [24, 32],
  iconAnchor:    [12, 32],
  popupAnchor:   [0, -32],
})

interface Props {
  cafes: Cafe[]
  onCafeClick?: (cafe: Cafe) => void
}

export default function MapInner({ cafes, onCafeClick }: Props) {
  return (
    <MapContainer
      center={NYC_CENTER}
      zoom={12}
      minZoom={10}
      maxZoom={18}
      maxBounds={NYC_BOUNDS}
      maxBoundsViscosity={0.9}
      className={styles.map}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />
      {cafes.map(cafe => (
        <CafePin key={cafe.id} cafe={cafe} onClick={onCafeClick} />
      ))}
    </MapContainer>
  )
}
