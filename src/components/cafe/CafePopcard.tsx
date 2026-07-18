'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Cafe } from '@/types'
import { WIFI_LABELS, OUTLETS_LABELS, DESK_SIZE_LABELS, SEATS_LABELS, AMENITY_ICONS } from '@/lib/constants'
import Button from '@/components/ui/Button'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import styles from './CafePopcard.module.css'

interface Props {
  cafe: Cafe
}

export default function CafePopcard({ cafe }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cafe.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore — clipboard API unavailable */ }
  }

  return (
    <div className={styles.popcard}>
      <WatercolorSurface seed={2} />
      <div className={styles.content}>
        <p className={styles.name}>{cafe.name}</p>
        <div className={styles.attrs}>
          <span className={`${styles.attr} ${cafe.wifi === 'none' ? styles.attrNegative : styles.attrPositive}`}>
            <img src={AMENITY_ICONS.wifi} alt="" className={styles.attrIcon} />
            {WIFI_LABELS[cafe.wifi]}
          </span>
          <span className={`${styles.attr} ${cafe.outlets === 'none' ? styles.attrNegative : styles.attrPositive}`}>
            <img src={AMENITY_ICONS.outlets} alt="" className={styles.attrIcon} />
            {OUTLETS_LABELS[cafe.outlets]}
          </span>
          <span className={styles.attr}>
            <img src={AMENITY_ICONS.desk_size} alt="" className={styles.attrIcon} />
            {DESK_SIZE_LABELS[cafe.desk_size]}
          </span>
          {cafe.seats && (
            <span className={styles.attr}>
              <img src={AMENITY_ICONS.seats} alt="" className={styles.attrIcon} />
              {SEATS_LABELS[cafe.seats]}
            </span>
          )}
        </div>
        <p className={styles.address}>{cafe.address}</p>
        <div className={styles.actions}>
          <Link href={`/cafe/${cafe.id}`} className={styles.actionLink}>
            <Button variant="secondary" size="sm" className={styles.actionBtn}>View details</Button>
          </Link>
          <Button variant="secondary" size="sm" className={styles.actionBtn} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy address'}
          </Button>
        </div>
      </div>
    </div>
  )
}
