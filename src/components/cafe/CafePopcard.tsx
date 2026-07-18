import Link from 'next/link'
import type { Cafe } from '@/types'
import { WIFI_LABELS, OUTLETS_LABELS, DESK_SIZE_LABELS, SEATS_LABELS, AMENITY_ICONS } from '@/lib/constants'
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
        <span className={`${styles.attr} ${styles.attrWifi}`}>
          <img src={AMENITY_ICONS.wifi} alt="" className={styles.attrIcon} />
          {WIFI_LABELS[cafe.wifi]}
        </span>
        <span className={`${styles.attr} ${styles.attrOutlet}`}>
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
      <Link href={`/cafe/${cafe.id}`} className={styles.link}>
        View details →
      </Link>
    </div>
  )
}
