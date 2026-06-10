'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './ui.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...rest }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={styles['input-wrapper']}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={ref}
          id={inputId}
          className={[
            styles.input,
            error ? styles['input-error'] : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {error && (
          <span className={styles['error-text']} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
