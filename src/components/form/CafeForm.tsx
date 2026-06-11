'use client'
import { useState } from 'react'
import type { Cafe, GeoResult, HoursJson, BoroughEnum, WifiEnum, OutletsEnum, DeskSizeEnum, SeatsEnum, NoiseEnum } from '@/types'
import {
  BOROUGH_LABELS,
  WIFI_LABELS,
  OUTLETS_LABELS,
  DESK_SIZE_LABELS,
  SEATS_LABELS,
  NOISE_LABELS,
} from '@/lib/constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import AddressSearch from './AddressSearch'
import HoursPicker from './HoursPicker'
import styles from './CafeForm.module.css'

interface CafeFormProps {
  initialData?: Cafe
  editId?: string
}

function toOptions<T extends string>(labels: Record<T, string>, placeholder?: string) {
  const opts = Object.entries(labels).map(([value, label]) => ({ value, label: label as string }))
  if (placeholder) return [{ value: '', label: placeholder }, ...opts]
  return opts
}

export default function CafeForm({ initialData, editId }: CafeFormProps) {
  const [form, setForm] = useState({
    name:         initialData?.name ?? '',
    address:      initialData?.address ?? '',
    borough:      (initialData?.borough ?? '') as BoroughEnum | '',
    neighborhood: initialData?.neighborhood ?? '',
    lat:          initialData?.lat ?? 0,
    lng:          initialData?.lng ?? 0,
    wifi:         (initialData?.wifi ?? '') as WifiEnum | '',
    outlets:      (initialData?.outlets ?? '') as OutletsEnum | '',
    desk_size:    (initialData?.desk_size ?? '') as DeskSizeEnum | '',
    seats:        (initialData?.seats ?? '') as SeatsEnum | '',
    noise:        (initialData?.noise ?? '') as NoiseEnum | '',
    hours:        (initialData?.hours ?? null) as HoursJson,
    honeypot:     '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast]           = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleAddressSelect(result: GeoResult) {
    setForm(f => ({
      ...f,
      address:      result.display_name.slice(0, 300),
      lat:          result.lat,
      lng:          result.lng,
      borough:      result.borough ?? f.borough,
      neighborhood: result.neighborhood ?? f.neighborhood,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.borough || !form.wifi || !form.outlets || !form.desk_size) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' }); return
    }

    setSubmitting(true)
    const payload = {
      ...form,
      neighborhood: form.neighborhood || null,
      seats:        form.seats || null,
      noise:        form.noise || null,
    }

    const url    = editId ? `/api/cafes/${editId}` : '/api/cafes'
    const method = editId ? 'PATCH' : 'POST'

    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'Something went wrong.')
      setToast({ message: editId ? 'Café updated!' : 'Café added! Thank you.', type: 'success' })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Submission failed.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Section: Location */}
        <section className={styles.section}>
          <p className={styles.sectionTitle}>Location</p>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', marginBottom: 'var(--space-1)' }}>
              Search address
            </label>
            <AddressSearch
              onSelect={handleAddressSelect}
              defaultValue={initialData?.address}
            />
          </div>

          <Select
            label="Borough *"
            value={form.borough}
            onChange={e => set('borough', e.target.value as BoroughEnum | '')}
            options={toOptions(BOROUGH_LABELS, 'Select borough…')}
          />

          <Input
            label="Neighborhood"
            value={form.neighborhood}
            onChange={e => set('neighborhood', e.target.value)}
            placeholder="e.g. Williamsburg"
          />
        </section>

        {/* Section: Details */}
        <section className={styles.section}>
          <p className={styles.sectionTitle}>Details</p>

          <Input
            label="Café name *"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Blue Bottle Coffee"
            required
          />

          <div className={styles.row}>
            <Select
              label="WiFi *"
              value={form.wifi}
              onChange={e => set('wifi', e.target.value as WifiEnum | '')}
              options={toOptions(WIFI_LABELS, 'Select WiFi…')}
            />
            <Select
              label="Outlets *"
              value={form.outlets}
              onChange={e => set('outlets', e.target.value as OutletsEnum | '')}
              options={toOptions(OUTLETS_LABELS, 'Select outlets…')}
            />
          </div>

          <div className={styles.row}>
            <Select
              label="Desk size *"
              value={form.desk_size}
              onChange={e => set('desk_size', e.target.value as DeskSizeEnum | '')}
              options={toOptions(DESK_SIZE_LABELS, 'Select desk size…')}
            />
            <Select
              label="Seats (optional)"
              value={form.seats}
              onChange={e => set('seats', e.target.value as SeatsEnum | '')}
              options={toOptions(SEATS_LABELS, 'Select seats…')}
            />
          </div>

          <Select
            label="Noise level (optional)"
            value={form.noise}
            onChange={e => set('noise', e.target.value as NoiseEnum | '')}
            options={toOptions(NOISE_LABELS, 'Select noise level…')}
          />
        </section>

        {/* Section: Hours */}
        <section className={styles.section}>
          <p className={styles.sectionTitle}>Hours</p>
          <HoursPicker
            value={form.hours}
            onChange={hours => set('hours', hours)}
          />
        </section>

        {/* Anti-spam honeypot */}
        <input
          type="text"
          className={styles.honeypot}
          tabIndex={-1}
          aria-hidden="true"
          value={form.honeypot}
          onChange={e => set('honeypot', e.target.value)}
          autoComplete="off"
        />

        {/* Submit */}
        <div className={styles.submitRow}>
          <div className={styles.actions}>
            <Button type="submit" loading={submitting}>
              {editId ? 'Save changes' : 'Add café'}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
