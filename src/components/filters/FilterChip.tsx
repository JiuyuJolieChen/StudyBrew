'use client'

import styles from './FilterBar.module.css'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export default function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      className={[styles.chip, active ? styles['chip-active'] : styles['chip-inactive']].join(' ')}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
