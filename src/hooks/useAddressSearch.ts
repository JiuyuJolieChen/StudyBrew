import { useState, useEffect, useRef } from 'react'
import type { GeoResult } from '@/types'

export function useAddressSearch() {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<GeoResult[]>([])
  const [isLoading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.trim().length < 2) { setResults([]); return }

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
        const data = await r.json()
        setResults(Array.isArray(data) ? data : [])
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
