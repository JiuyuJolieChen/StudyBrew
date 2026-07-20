'use client'

import { CHECKBOX_ICONS } from '@/lib/constants'
import styles from './ui.module.css'

interface CheckboxOption {
  value: string
  label: string
}

interface CheckboxOptionGroupProps {
  label: string
  icon?: string
  options: CheckboxOption[]
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
}

export default function CheckboxOptionGroup({
  label,
  icon,
  options,
  value,
  onChange,
  readOnly = false,
}: CheckboxOptionGroupProps) {
  return (
    <div className={styles['checkbox-group']}>
      <span className={styles['checkbox-group-label']}>
        {icon && <img src={icon} alt="" className={styles['checkbox-group-icon']} />}
        {label}
      </span>
      <div className={styles['checkbox-options']}>
        {options.map((opt) => {
          const checked = value === opt.value
          const optionIcon = (
            <span className={styles['checkbox-icon-wrap']}>
              <img src={CHECKBOX_ICONS.unchecked} alt="" className={styles['checkbox-icon-base']} />
              {checked && (
                <img src={CHECKBOX_ICONS.checked} alt="" className={styles['checkbox-icon-check']} />
              )}
            </span>
          )

          if (readOnly) {
            return (
              <span key={opt.value} className={styles['checkbox-option']}>
                {optionIcon}
                {opt.label}
              </span>
            )
          }

          return (
            <button
              key={opt.value}
              type="button"
              className={styles['checkbox-option']}
              aria-pressed={checked}
              onClick={() => onChange?.(checked ? '' : opt.value)}
            >
              {optionIcon}
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
