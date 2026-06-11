'use client'
import { DAYS, DAY_LABELS } from '@/lib/constants'
import type { HoursJson } from '@/types'
import styles from './CafeForm.module.css'

interface Props {
  value: HoursJson
  onChange: (hours: HoursJson) => void
}

export default function HoursPicker({ value, onChange }: Props) {
  const hours = value ?? {}

  function toggleDay(day: string, open: boolean) {
    onChange({ ...hours, [day]: open ? { open: '09:00', close: '18:00' } : null })
  }

  function setTime(day: string, field: 'open' | 'close', time: string) {
    const existing = hours[day as keyof typeof hours]
    onChange({ ...hours, [day]: { open: '09:00', close: '18:00', ...existing, [field]: time } })
  }

  return (
    <div className={styles.hoursPicker}>
      {DAYS.map(day => {
        const entry = hours[day]
        const isOpen = entry !== null && entry !== undefined
        return (
          <div key={day} className={styles.hoursRow}>
            <label className={styles.hoursLabel}>
              <input
                type="checkbox"
                checked={isOpen}
                onChange={e => toggleDay(day, e.target.checked)}
              />
              <span>{DAY_LABELS[day]}</span>
            </label>
            {isOpen && (
              <div className={styles.hoursTimes}>
                <input type="time" value={entry?.open ?? '09:00'} onChange={e => setTime(day, 'open', e.target.value)} />
                <span>–</span>
                <input type="time" value={entry?.close ?? '18:00'} onChange={e => setTime(day, 'close', e.target.value)} />
              </div>
            )}
            {!isOpen && <span className={styles.hoursClosedLabel}>Closed</span>}
          </div>
        )
      })}
    </div>
  )
}
