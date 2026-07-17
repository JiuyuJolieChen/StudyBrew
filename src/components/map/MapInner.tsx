'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Pane } from 'react-leaflet'
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

const waterStyle = () => ({ className: 'water-feature' })
const parkStyle = () => ({ className: 'park-feature' })

export default function MapInner({ cafes, onCafeClick }: Props) {
  const [waterData, setWaterData] = useState(null)
  const [parksData, setParksData] = useState(null)

  useEffect(() => {
    fetch('/geo/water.geojson').then(r => r.json()).then(setWaterData)
    fetch('/geo/parks.geojson').then(r => r.json()).then(setParksData)
  }, [])

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
      {/* Hand-drawn watercolor filter defs — referenced via CSS `filter: url(#id)`
          on the GeoJSON landmark overlay (MapContainer.module.css). Housed here
          since this component owns the map/overlay lifecycle. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="sb-water-feather" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <filter id="sb-park-feather" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="3" seed="9" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id="sb-avenue-wobble" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="13" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
          </filter>
          <filter id="sb-icon-wash" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="17" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="8" />
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
      </svg>

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Paper-grain texture — Leaflet-native Pane so it stacks correctly
          (above tiles z=200, below markers z=600) without fighting CSS
          stacking contexts. */}
      <Pane name="paperGrain" style={{ zIndex: 250 }}>
        <div className={styles.paperGrain} />
      </Pane>

      {/* Real-geometry landmark overlay — iconic elements only (Hudson/East
          River from NYC Open Data's Hydrography dataset, Central Park/Prospect
          Park from Parks Properties). Genuine georeferenced SVG paths, so each
          feature type can carry its own differentiated hand-drawn filter,
          unlike the flattened raster tiles. Avenues dropped for now — no real
          street-centerline data available yet. */}
      {waterData && <GeoJSON data={waterData} style={waterStyle} />}
      {parksData && <GeoJSON data={parksData} style={parkStyle} />}

      {cafes.map(cafe => (
        <CafePin key={cafe.id} cafe={cafe} onClick={onCafeClick} />
      ))}
    </MapContainer>
  )
}
