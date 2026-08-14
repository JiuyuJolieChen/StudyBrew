'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // App Router page transitions aren't full page reloads, so autocapture
      // would miss/duplicate pageviews — fire them manually instead (see PostHogPageView).
      capture_pageview: false,
      // No login system on this app — without this, PostHog only builds a person
      // profile once a user is `identify`d, so retention/cohort analysis would
      // lose almost all anonymous visitors.
      person_profiles: 'always',
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
