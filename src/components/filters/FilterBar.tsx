'use client'

import { FilterState, BoroughEnum, WifiEnum, NoiseEnum } from '@/types'
import { BOROUGH_LABELS, WIFI_LABELS, NOISE_LABELS } from '@/lib/constants'
import FilterChip from './FilterChip'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filters: FilterState
  onChange: (next: FilterState) => void
}

const BOROUGH_OPTIONS: { value: BoroughEnum; label: string }[] = [
  { value: 'manhattan', label: BOROUGH_LABELS.manhattan },
  { value: 'brooklyn', label: BOROUGH_LABELS.brooklyn },
  { value: 'queens', label: BOROUGH_LABELS.queens },
  { value: 'bronx', label: BOROUGH_LABELS.bronx },
  { value: 'staten_island', label: BOROUGH_LABELS.staten_island },
]

const WIFI_OPTIONS: { value: WifiEnum; label: string }[] = [
  { value: 'free', label: WIFI_LABELS.free },
  { value: 'none', label: WIFI_LABELS.none },
  { value: 'paid_or_login', label: WIFI_LABELS.paid_or_login },
]

const NOISE_OPTIONS: { value: NoiseEnum; label: string }[] = [
  { value: 'quiet', label: NOISE_LABELS.quiet },
  { value: 'moderate', label: NOISE_LABELS.moderate },
  { value: 'lively', label: NOISE_LABELS.lively },
]

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggleBorough(value: BoroughEnum) {
    onChange({ ...filters, borough: filters.borough === value ? null : value })
  }

  function toggleWifi(value: WifiEnum) {
    onChange({ ...filters, wifi: filters.wifi === value ? null : value })
  }

  function toggleNoise(value: NoiseEnum) {
    onChange({ ...filters, noise: filters.noise === value ? null : value })
  }

  return (
    <nav className={styles.bar} aria-label="Filter cafes">
      {BOROUGH_OPTIONS.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          active={filters.borough === opt.value}
          onClick={() => toggleBorough(opt.value)}
        />
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {WIFI_OPTIONS.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          active={filters.wifi === opt.value}
          onClick={() => toggleWifi(opt.value)}
        />
      ))}

      <span className={styles.divider} aria-hidden="true" />

      {NOISE_OPTIONS.map((opt) => (
        <FilterChip
          key={opt.value}
          label={opt.label}
          active={filters.noise === opt.value}
          onClick={() => toggleNoise(opt.value)}
        />
      ))}
    </nav>
  )
}
