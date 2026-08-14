'use client'
import { useState } from 'react'
import posthog from 'posthog-js'
import styles from './CafeCard.module.css'

export default function CopyAddress({ address, cafeId, className }: { address: string; cafeId: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      posthog.capture('copy_address', { cafe_id: cafeId, source: 'detail_page' })
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
