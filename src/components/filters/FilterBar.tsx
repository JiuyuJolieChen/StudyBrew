'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { FilterState, BoroughEnum, OutletsEnum, DeskSizeEnum, SeatsEnum, NoiseEnum } from '@/types'
import {
  BOROUGH_LABELS,
  WIFI_FILTER_GROUPS,
  OUTLETS_LABELS,
  DESK_SIZE_LABELS,
  SEATS_LABELS,
  NOISE_LABELS,
  AMENITY_ICONS,
} from '@/lib/constants'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filters: FilterState
  onChange: (next: FilterState) => void
}

function FilterDropdown<T extends string>({
  label,
  icon,
  options,
  selected,
  onToggle,
}: {
  label: string
  icon?: string
  options: { value: T; label: string }[]
  selected: T[]
  onToggle: (value: T) => void
}) {
  const [open, setOpen]         = useState(false)
  const [mounted, setMounted]   = useState(false)
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 })
  const triggerRef              = useRef<HTMLButtonElement>(null)
  const panelRef                = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  function openDropdown() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPanelPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function onOutsideClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onOutsideClick)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  const count = selected.length

  return (
    <div className={styles.dropdown}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${count > 0 ? styles.triggerActive : ''}`}
        onClick={open ? () => setOpen(false) : openDropdown}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {icon && <img src={icon} alt="" className={styles.triggerIcon} />}
        {label}
        {count > 0 && <span className={styles.badge}>{count}</span>}
        <span className={styles.chevron} aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>

      {mounted && open && createPortal(
        <div
          ref={panelRef}
          className={styles.panel}
          style={{ position: 'fixed', top: panelPos.top, left: panelPos.left, zIndex: 9999 }}
        >
          {options.map(opt => (
            <label key={opt.value} className={styles.option}>
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggle<K extends keyof FilterState>(key: K, value: string) {
    const current = filters[key] as string[]
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next as FilterState[K] })
  }

  const wifiSelected = WIFI_FILTER_GROUPS
    .filter(g => g.values.some(v => filters.wifi.includes(v)))
    .map(g => g.key)

  function toggleWifiGroup(key: 'none' | 'have_wifi') {
    const group = WIFI_FILTER_GROUPS.find(g => g.key === key)!
    const isOn = group.values.some(v => filters.wifi.includes(v))
    const next = isOn
      ? filters.wifi.filter(v => !group.values.includes(v))
      : [...filters.wifi, ...group.values.filter(v => !filters.wifi.includes(v))]
    onChange({ ...filters, wifi: next })
  }

  return (
    <nav className={styles.bar} aria-label="Filter cafes">
      <FilterDropdown<BoroughEnum>
        label="Borough"
        options={Object.entries(BOROUGH_LABELS).map(([v, l]) => ({ value: v as BoroughEnum, label: l }))}
        selected={filters.borough}
        onToggle={v => toggle('borough', v)}
      />
      <FilterDropdown<'none' | 'have_wifi'>
        label="WiFi"
        icon={AMENITY_ICONS.wifi}
        options={WIFI_FILTER_GROUPS.map(g => ({ value: g.key, label: g.label }))}
        selected={wifiSelected}
        onToggle={toggleWifiGroup}
      />
      <FilterDropdown<OutletsEnum>
        label="Outlets"
        icon={AMENITY_ICONS.outlets}
        options={Object.entries(OUTLETS_LABELS).map(([v, l]) => ({ value: v as OutletsEnum, label: l }))}
        selected={filters.outlets}
        onToggle={v => toggle('outlets', v)}
      />
      <FilterDropdown<DeskSizeEnum>
        label="Desk size"
        icon={AMENITY_ICONS.desk_size}
        options={Object.entries(DESK_SIZE_LABELS).map(([v, l]) => ({ value: v as DeskSizeEnum, label: l }))}
        selected={filters.desk_size}
        onToggle={v => toggle('desk_size', v)}
      />
      <FilterDropdown<SeatsEnum>
        label="Seats"
        icon={AMENITY_ICONS.seats}
        options={Object.entries(SEATS_LABELS).map(([v, l]) => ({ value: v as SeatsEnum, label: l }))}
        selected={filters.seats}
        onToggle={v => toggle('seats', v)}
      />
      <FilterDropdown<NoiseEnum>
        label="Noise"
        icon={AMENITY_ICONS.noise}
        options={Object.entries(NOISE_LABELS).map(([v, l]) => ({ value: v as NoiseEnum, label: l }))}
        selected={filters.noise}
        onToggle={v => toggle('noise', v)}
      />
    </nav>
  )
}
