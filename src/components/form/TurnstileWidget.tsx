'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface Props {
  onVerify: (token: string) => void
  onExpire?: () => void
}

export default function TurnstileWidget({ onVerify, onExpire }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef    = useRef<string | null>(null)

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey || !containerRef.current) return

    function mount() {
      if (!containerRef.current || !window.turnstile) return
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey:  siteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        theme: 'light',
      })
    }

    if (window.turnstile) {
      mount()
    } else {
      // Turnstile script loads async — poll until ready
      const interval = setInterval(() => {
        if (window.turnstile) { clearInterval(interval); mount() }
      }, 100)
      return () => clearInterval(interval)
    }

    return () => {
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current)
      }
    }
  }, [onVerify, onExpire])

  return <div ref={containerRef} />
}
