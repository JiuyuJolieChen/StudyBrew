'use client'
import { useState } from 'react'
import styles from './CafeCard.module.css'

export default function CopyAddress({ address, className }: { address: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore — clipboard API unavailable */ }
  }

  return (
    <button
      className={`${styles['copy-address']} ${className ?? ''}`}
      onClick={handleCopy}
      title="Click to copy address"
      type="button"
    >
      {copied ? '✓ Copied' : address}
    </button>
  )
}
