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

    // npm-imported posthog-js doesn't attach itself to `window` the way the
    // classic <script> snippet does — expose it so `posthog.debug()` works
    // from the browser console, and so PostHog's in-app Toolbar can find it.
    if (typeof window !== 'undefined') {
      ;(window as unknown as { posthog: typeof posthog }).posthog = posthog
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
