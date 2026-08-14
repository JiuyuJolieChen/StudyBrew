import { NextRequest, NextResponse } from 'next/server'
import { inferBorough, inferNeighborhood } from '@/lib/geocoding'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import type { GeoResult } from '@/types'

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`geocode:${ip}`, 20, 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const q = new URL(request.url).searchParams.get('q')
  if (!q || q.trim().length < 2) {
    return NextResponse.json([], { status: 200 })
  }

  const params = new URLSearchParams({
    q:              `${q.trim()}, New York City`,
    format:         'json',
    addressdetails: '1',
    limit:          '5',
    viewbox:        '-74.27,40.95,-73.68,40.4',
    bounded:        '1',
  })

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'User-Agent': 'StudyBrewNYC/1.0 (studybrew.nyc)' },
    next: { revalidate: 3600 },
  })

  if (!res.ok) return NextResponse.json([], { status: 200 })

  const raw = await res.json()
  const results: GeoResult[] = raw.map((r: { display_name: string; name?: string; lat: string; lon: string; address: Record<string, string> }) => ({
    display_name: r.display_name,
    name:         r.name ?? null,
    lat:          parseFloat(r.lat),
    lng:          parseFloat(r.lon),
    borough:      inferBorough(r.address),
    neighborhood: inferNeighborhood(r.address),
  }))

  return NextResponse.json(results)
}
