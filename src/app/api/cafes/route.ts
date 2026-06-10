import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { CafeCreateSchema } from '@/lib/validation/cafe'
import { verifyTurnstile } from '@/lib/turnstile'
import type { BoroughEnum, WifiEnum } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const borough = searchParams.get('borough') as BoroughEnum | null
  const wifi    = searchParams.get('wifi') as WifiEnum | null

  const db = getSupabaseServer()
  let query = db.from('cafes').select('*').eq('is_deleted', false).order('created_at', { ascending: false })
  if (borough) query = query.eq('borough', borough)
  if (wifi)    query = query.eq('wifi', wifi)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
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

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined
  const captchaOk = await verifyTurnstile(data.turnstile_token, ip)
  if (!captchaOk) {
    return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
  }

  const { turnstile_token: _, honeypot: __, ...insertPayload } = data

  const db = getSupabaseServer()
  const { data: newCafe, error: insertError } = await db
    .from('cafes')
    .insert(insertPayload)
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  await db.from('cafe_edits').insert({ cafe_id: newCafe.id, changed_fields: insertPayload })

  return NextResponse.json({ data: newCafe }, { status: 201 })
}
