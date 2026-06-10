'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import styles from './ui.module.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className, ...rest }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={styles['select-wrapper']}>
        {label && (
          <label className={styles.label} htmlFor={selectId}>
            {label}
          </label>
        )}
        <select
          {...rest}
          ref={ref}
          id={selectId}
          className={[
            styles.select,
            error ? styles['select-error'] : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className={styles['error-text']} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
