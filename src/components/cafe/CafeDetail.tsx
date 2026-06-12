import Link from 'next/link'
import { Wifi, Zap, Monitor, Users, Volume2 } from 'lucide-react'
import { Cafe } from '@/types'
import CopyAddress from './CopyAddress'
import {
  BOROUGH_LABELS,
  WIFI_LABELS,
  OUTLETS_LABELS,
  DESK_SIZE_LABELS,
  SEATS_LABELS,
  NOISE_LABELS,
} from '@/lib/constants'
import AttributeRow from './AttributeRow'
import HoursTable from './HoursTable'
import styles from './CafeCard.module.css'

interface CafeDetailProps {
  cafe: Cafe
}

export default function CafeDetail({ cafe }: CafeDetailProps) {
  return (
    <div>
      {/* Header section */}
      <div className={styles['detail-section']}>
        <h1 className={styles['detail-title']}>{cafe.name}</h1>
        <CopyAddress address={cafe.address} className={styles['detail-address']} />
        <p className={styles['detail-neighborhood']}>
          {BOROUGH_LABELS[cafe.borough]}
          {cafe.neighborhood ? ` · ${cafe.neighborhood}` : ''}
        </p>
      </div>

      {/* Attributes section */}
      <div className={styles['detail-section']}>
        <p className={styles['detail-section-heading']}>Details</p>
        <div className={styles['detail-attributes']}>
          <AttributeRow
            icon={<Wifi size={16} />}
            label="WiFi"
            value={WIFI_LABELS[cafe.wifi]}
          />
          <AttributeRow
            icon={<Zap size={16} />}
            label="Outlets"
            value={OUTLETS_LABELS[cafe.outlets]}
          />
          <AttributeRow
            icon={<Monitor size={16} />}
            label="Desk size"
            value={DESK_SIZE_LABELS[cafe.desk_size]}
          />
          {cafe.seats && (
            <AttributeRow
              icon={<Users size={16} />}
              label="Seats"
              value={SEATS_LABELS[cafe.seats]}
            />
          )}
          {cafe.noise && (
            <AttributeRow
              icon={<Volume2 size={16} />}
              label="Noise"
              value={NOISE_LABELS[cafe.noise]}
            />
          )}
        </div>
      </div>

      {/* Hours section */}
      <div className={styles['detail-section']}>
        <p className={styles['detail-section-heading']}>Hours</p>
        <HoursTable hours={cafe.hours} />
      </div>

      {/* Edit link */}
      <div>
        <Link
          href={`/add?edit=${cafe.id}`}
          className={styles['detail-edit-link']}
        >
          Edit this listing
        </Link>
      </div>
    </div>
  )
}
