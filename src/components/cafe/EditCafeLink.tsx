'use client'

import Link from 'next/link'
import posthog from 'posthog-js'

// CafeDetail.tsx is a Server Component, so this link needs its own client
// boundary to carry an onClick handler (event handlers can't be passed as
// props to Client Components from a Server Component) — same pattern as
// ShareLandingTracker.tsx elsewhere in the app.
export default function EditCafeLink({ cafeId, className }: { cafeId: string; className?: string }) {
  return (
    <Link
      href={`/add?edit=${cafeId}`}
      className={className}
      onClick={() => posthog.capture('edit_cafe_started', { cafe_id: cafeId })}
    >
      Edit this listing
    </Link>
  )
}
