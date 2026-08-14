'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import posthog from 'posthog-js'
import Button from './Button'
import Toast from './Toast'

export default function ShareButton({ className }: { className?: string }) {
  const [showToast, setShowToast] = useState(false)

  async function handleShare() {
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('ref', 'share')
      await navigator.clipboard.writeText(url.toString())
      posthog.capture('share_button_clicked', { share_method: 'copy_link' })
      setShowToast(true)
    } catch {
      /* ignore — clipboard API unavailable */
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" className={className} onClick={handleShare} type="button">
        <Share2 size={16} />
        Share
      </Button>
      {showToast && (
        <Toast
          message="Link copied to clipboard!"
          type="success"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </>
  )
}
