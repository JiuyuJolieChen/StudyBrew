'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Cafe } from '@/types'
import { BOROUGH_LABELS, WIFI_LABELS, OUTLETS_LABELS } from '@/lib/constants'
import styles from './CafeCard.module.css'

interface CafeCardProps {
  cafe: Cafe
  onClick?: () => void
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
          <span className={styles['attr-chip']}>{WIFI_LABELS[cafe.wifi]}</span>
          <span className={styles['attr-chip']}>{OUTLETS_LABELS[cafe.outlets]}</span>
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
