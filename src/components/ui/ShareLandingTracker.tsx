'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import posthog from 'posthog-js'

function ShareLandingTrackerInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('ref') === 'share') {
      posthog.capture('shared_link_visited')
    }
  }, [searchParams])

  return null
}

export default function ShareLandingTracker() {
  return (
    <Suspense fallback={null}>
      <ShareLandingTrackerInner />
    </Suspense>
  )
}
