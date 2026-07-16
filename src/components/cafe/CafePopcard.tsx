import Link from 'next/link'
import type { Cafe } from '@/types'
import { WIFI_LABELS, OUTLETS_LABELS } from '@/lib/constants'
import styles from './CafePopcard.module.css'

interface Props {
  cafe: Cafe
}

export default function CafePopcard({ cafe }: Props) {
  return (
    <div className={styles.popcard}>
      <p className={styles.name}>{cafe.name}</p>
      <p className={styles.address}>{cafe.address}</p>
      <div className={styles.attrs}>
        <span className={`${styles.attr} ${styles.attrWifi}`}>{WIFI_LABELS[cafe.wifi]}</span>
        <span className={`${styles.attr} ${styles.attrOutlet}`}>{OUTLETS_LABELS[cafe.outlets]}</span>
      </div>
      <Link href={`/cafe/${cafe.id}`} className={styles.link}>
        View details →
      </Link>
    </div>
  )
}
