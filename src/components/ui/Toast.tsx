'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './ui.module.css'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onDismiss: () => void
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={[styles.toast, type === 'success' ? styles['toast-success'] : styles['toast-error']]
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles['toast-message']}>{message}</span>
      <button
        className={styles['toast-close']}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
