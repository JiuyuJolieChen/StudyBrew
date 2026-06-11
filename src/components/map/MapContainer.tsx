'use client'
import dynamic from 'next/dynamic'
import type { Cafe } from '@/types'
import styles from './MapContainer.module.css'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <div className={styles.skeleton} />,
})

interface Props {
  cafes: Cafe[]
  onCafeClick?: (cafe: Cafe) => void
}

export default function MapContainer({ cafes, onCafeClick }: Props) {
  return (
    <div className={styles.wrapper}>
      <MapInner cafes={cafes} onCafeClick={onCafeClick} />
    </div>
  )
}
