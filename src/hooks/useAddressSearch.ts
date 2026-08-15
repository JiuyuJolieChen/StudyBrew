import { useState, useEffect, useRef } from 'react'
import posthog from 'posthog-js'
import type { GeoResult } from '@/types'

export function useAddressSearch(initialQuery = '') {
  const [query, setQuery]       = useState(initialQuery)
  const [results, setResults]   = useState<GeoResult[]>([])
  const [isLoading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Skips searching for the pristine prefilled value — when `initialQuery` comes
  // from an edit-café prefill, that's not a real search and shouldn't hit the
  // geocode API or fire an analytics event just because the form opened.
  // Compared against `query` itself (not a one-time flip flag) because React 18
  // Strict Mode double-invokes effects on mount in dev — a flip-once ref would
  // get flipped by the first synthetic run and then wrongly fire a real search
  // on the second one; comparing values is idempotent across both runs.
  const initialQueryRef = useRef(initialQuery)
  // Only the first genuine search per hook instance (i.e. per form open) gets
  // captured — otherwise every typing pause while composing one address fires
  // its own event and inflates the count.
  const hasCapturedSearch = useRef(false)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (query === initialQueryRef.current) return

    if (query.trim().length < 2) { setResults([]); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
        const data = await r.json()
        const results = Array.isArray(data) ? data : []
        setResults(results)
        if (!hasCapturedSearch.current) {
          hasCapturedSearch.current = true
          posthog.capture('add_cafe_address_searched', { has_results: results.length > 0 })
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query])

  return { query, setQuery, results, setResults, isLoading }
}
