'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cafe } from '@/types'
import { BOROUGH_LABELS, WIFI_LABELS, OUTLETS_LABELS, DESK_SIZE_LABELS, SEATS_LABELS, AMENITY_ICONS } from '@/lib/constants'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import styles from './CafeCard.module.css'

interface CafeCardProps {
  cafe: Cafe
  onClick?: () => void
}

function seedFromId(id: string): 1 | 2 | 3 {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return ((Math.abs(hash) % 3) + 1) as 1 | 2 | 3
}

export default function CafeCard({ cafe, onClick }: CafeCardProps) {
  const [copied, setCopied] = useState(false)

  async function copyAddress(e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(cafe.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <article
      className={styles.card}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`${cafe.name}, ${cafe.address}`}
    >
      <WatercolorSurface seed={seedFromId(cafe.id)} />
      <div className={styles['card-body']}>
        <div className={styles['card-header']}>
          <div className={styles['card-meta']}>
            <h2 className={styles['cafe-name']}>{cafe.name}</h2>
            <button
              className={styles['copy-address']}
              onClick={copyAddress}
              title="Click to copy address"
              type="button"
            >
              {copied ? '✓ Copied' : cafe.address}
            </button>
          </div>
          <span className={styles['borough-badge']}>
            {BOROUGH_LABELS[cafe.borough]}
          </span>
        </div>

        <div className={styles['card-chips']}>
          <span className={styles['attr-chip']}>
            <img src={AMENITY_ICONS.wifi} alt="" className={styles['attr-chip-icon']} />
            {WIFI_LABELS[cafe.wifi]}
          </span>
          <span className={styles['attr-chip']}>
            <img src={AMENITY_ICONS.outlets} alt="" className={styles['attr-chip-icon']} />
            {OUTLETS_LABELS[cafe.outlets]}
          </span>
          <span className={styles['attr-chip']}>
            <img src={AMENITY_ICONS.desk_size} alt="" className={styles['attr-chip-icon']} />
            {DESK_SIZE_LABELS[cafe.desk_size]}
          </span>
          {cafe.seats && (
            <span className={styles['attr-chip']}>
              <img src={AMENITY_ICONS.seats} alt="" className={styles['attr-chip-icon']} />
              {SEATS_LABELS[cafe.seats]}
            </span>
          )}
        </div>

        <div className={styles['card-footer']}>
          <Link
            href={`/cafe/${cafe.id}`}
            className={styles['view-details']}
            onClick={e => e.stopPropagation()}
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  )
}
