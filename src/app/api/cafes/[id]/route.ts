import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { CafePatchSchema } from '@/lib/validation/cafe'
import { verifyTurnstile } from '@/lib/turnstile'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  const db = getSupabaseServer()
  const { data, error } = await db
    .from('cafes')
    .select('*')
    .eq('id', params.id)
    .eq('is_deleted', false)
    .single()

  if (error || !data) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  const db = getSupabaseServer()
  const { data: existing, error: fetchError } = await db
    .from('cafes')
    .select('*')
    .eq('id', params.id)
    .eq('is_deleted', false)
    .single()

  if (fetchError || !existing) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = CafePatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input', issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data

  if (data.honeypot !== '') {
    return NextResponse.json({})
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? undefined
  const captchaOk = await verifyTurnstile(data.turnstile_token, ip)
  if (!captchaOk) {
    return NextResponse.json({ error: 'captcha_failed' }, { status: 400 })
  }

  const { turnstile_token: _, honeypot: __, ...patchFields } = data

  // Compute changed_fields diff
  const changedFields: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(patchFields)) {
    if (JSON.stringify(existing[key]) !== JSON.stringify(val)) {
      changedFields[key] = val
    }
  }

  const { data: updated, error: updateError } = await db
    .from('cafes')
    .update(patchFields)
    .eq('id', params.id)
    .select()
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  if (Object.keys(changedFields).length > 0) {
    await db.from('cafe_edits').insert({ cafe_id: params.id, changed_fields: changedFields })
  }

  return NextResponse.json({ data: updated })
}
