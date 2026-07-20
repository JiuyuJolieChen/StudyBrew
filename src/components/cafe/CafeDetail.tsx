import Link from 'next/link'
import { Cafe } from '@/types'
import CopyAddress from './CopyAddress'
import {
  BOROUGH_LABELS,
  WIFI_LABELS,
  OUTLETS_LABELS,
  DESK_SIZE_LABELS,
  SEATS_LABELS,
  NOISE_LABELS,
  AMENITY_ICONS,
} from '@/lib/constants'
import AttributeRow from './AttributeRow'
import HoursTable from './HoursTable'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import styles from './CafeCard.module.css'

interface CafeDetailProps {
  cafe: Cafe
}

export default function CafeDetail({ cafe }: CafeDetailProps) {
  return (
    <div className={styles['detail-card']}>
      <WatercolorSurface seed={3} />
      <div className={styles['detail-content']}>
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
              icon={<img src={AMENITY_ICONS.wifi} width={16} height={16} alt="" />}
              label="WiFi"
              value={WIFI_LABELS[cafe.wifi]}
            />
            <AttributeRow
              icon={<img src={AMENITY_ICONS.outlets} width={16} height={16} alt="" />}
              label="Outlets"
              value={OUTLETS_LABELS[cafe.outlets]}
            />
            <AttributeRow
              icon={<img src={AMENITY_ICONS.desk_size} width={16} height={16} alt="" />}
              label="Desk size"
              value={DESK_SIZE_LABELS[cafe.desk_size]}
            />
            {cafe.seats && (
              <AttributeRow
                icon={<img src={AMENITY_ICONS.seats} width={16} height={16} alt="" />}
                label="Seats"
                value={SEATS_LABELS[cafe.seats]}
              />
            )}
            {cafe.noise && (
              <AttributeRow
                icon={<img src={AMENITY_ICONS.noise} width={16} height={16} alt="" />}
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
    </div>
  )
}
