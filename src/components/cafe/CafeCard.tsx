'use client'

import { Cafe } from '@/types'
import { BOROUGH_LABELS, WIFI_LABELS, OUTLETS_LABELS } from '@/lib/constants'
import styles from './CafeCard.module.css'

interface CafeCardProps {
  cafe: Cafe
  onClick?: () => void
}

export default function CafeCard({ cafe, onClick }: CafeCardProps) {
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
      <div className={styles['card-body']}>
        <div className={styles['card-header']}>
          <div className={styles['card-meta']}>
            <h2 className={styles['cafe-name']}>{cafe.name}</h2>
            <p className={styles['cafe-address']}>{cafe.address}</p>
          </div>
          <span className={styles['borough-badge']}>
            {BOROUGH_LABELS[cafe.borough]}
          </span>
        </div>

        <div className={styles['card-chips']}>
          <span className={styles['attr-chip']}>
            {WIFI_LABELS[cafe.wifi]}
          </span>
          <span className={styles['attr-chip']}>
            {OUTLETS_LABELS[cafe.outlets]}
          </span>
        </div>
      </div>
    </article>
  )
}
