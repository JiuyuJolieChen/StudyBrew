import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { getPostHogServer } from '@/lib/posthog-server'
import { verifyTurnstile } from '@/lib/turnstile'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { CafeCreateSchema } from '@/lib/validation/cafe'
import type { BoroughEnum, WifiEnum } from '@/types'

// Safety cap — the map renders every result at once, so this isn't pagination,
// just a ceiling to stop a single request from pulling an unbounded table.
const MAX_RESULTS = 2000

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const borough = searchParams.get('borough') as BoroughEnum | null
  const wifi    = searchParams.get('wifi') as WifiEnum | null

  const db = getSupabaseServer()
  let query = db.from('cafes').select('*').eq('is_deleted', false).order('created_at', { ascending: false }).limit(MAX_RESULTS)
  if (borough) query = query.eq('borough', borough)
  if (wifi)    query = query.eq('wifi', wifi)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`cafes:post:${ip}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = CafeCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input', issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data

  // Honeypot — silently succeed without inserting
  if (data.honeypot !== '') {
    return NextResponse.json({})
  }

  const captchaOk = await verifyTurnstile(data.turnstile_token, ip)
  if (!captchaOk) {
    return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
  }

  const { turnstile_token: _token, honeypot: _honeypot, ...insertPayload } = data

  const db = getSupabaseServer()

  // Duplicate check — reject if an active café already exists within ~10 metres
  const TOLERANCE = 0.0001 // ~11 metres in decimal degrees
  const { data: existing } = await db
    .from('cafes')
    .select('id, name')
    .eq('is_deleted', false)
    .gte('lat', insertPayload.lat - TOLERANCE)
    .lte('lat', insertPayload.lat + TOLERANCE)
    .gte('lng', insertPayload.lng - TOLERANCE)
    .lte('lng', insertPayload.lng + TOLERANCE)
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: `"${existing[0].name}" is already listed at this location.` },
      { status: 409 },
    )
  }

  const { data: newCafe, error: insertError } = await db
    .from('cafes')
    .insert(insertPayload)
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  await db.from('cafe_edits').insert({ cafe_id: newCafe.id, changed_fields: insertPayload })

  // Server-side capture — carry the request's distinct_id so this ties back to the same browser user
  const ph = getPostHogServer()
  const distinctId = request.headers.get('x-ph-distinct-id') ?? newCafe.id
  ph.capture({ distinctId, event: 'cafe_added_server', properties: { cafe_id: newCafe.id } })
  await ph.flush()

  return NextResponse.json({ data: newCafe }, { status: 201 })
}
