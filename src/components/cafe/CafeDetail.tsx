import Link from 'next/link'
import { Cafe } from '@/types'
import CopyAddress from './CopyAddress'
import {
  BOROUGH_LABELS,
  WIFI_FORM_LABELS,
  OUTLETS_LABELS,
  DESK_SIZE_LABELS,
  SEATS_LABELS,
  NOISE_LABELS,
  AMENITY_ICONS,
} from '@/lib/constants'
import CheckboxOptionGroup from '@/components/ui/CheckboxOptionGroup'
import HoursTable from './HoursTable'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import styles from './CafeCard.module.css'

interface CafeDetailProps {
  cafe: Cafe
}

function toOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label: label as string }))
}

export default function CafeDetail({ cafe }: CafeDetailProps) {
  return (
    <div className={styles['detail-card']}>
      <WatercolorSurface seed={3} />
      <div className={styles['detail-content']}>
        {/* Header section */}
        <div className={styles['detail-section']}>
          <h1 className={styles['detail-title']}>{cafe.name}</h1>
          <CopyAddress address={cafe.address} cafeId={cafe.id} className={styles['detail-address']} />
          <p className={styles['detail-neighborhood']}>
            {BOROUGH_LABELS[cafe.borough]}
            {cafe.neighborhood ? ` · ${cafe.neighborhood}` : ''}
          </p>
        </div>

        {/* Attributes section */}
        <div className={styles['detail-section']}>
          <p className={styles['detail-section-heading']}>Details</p>
          <div className={styles['detail-attributes']}>
            <CheckboxOptionGroup
              label="WiFi"
              icon={AMENITY_ICONS.wifi}
              value={cafe.wifi}
              options={toOptions(WIFI_FORM_LABELS)}
              readOnly
            />
            <CheckboxOptionGroup
              label="Outlets"
              icon={AMENITY_ICONS.outlets}
              value={cafe.outlets}
              options={toOptions(OUTLETS_LABELS)}
              readOnly
            />
            <CheckboxOptionGroup
              label="Desk size"
              icon={AMENITY_ICONS.desk_size}
              value={cafe.desk_size}
              options={toOptions(DESK_SIZE_LABELS)}
              readOnly
            />
            {cafe.seats && (
              <CheckboxOptionGroup
                label="Seats"
                icon={AMENITY_ICONS.seats}
                value={cafe.seats}
                options={toOptions(SEATS_LABELS)}
                readOnly
              />
            )}
            {cafe.noise && (
              <CheckboxOptionGroup
                label="Noise"
                icon={AMENITY_ICONS.noise}
                value={cafe.noise}
                options={toOptions(NOISE_LABELS)}
                readOnly
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
    </div>
  )
}
