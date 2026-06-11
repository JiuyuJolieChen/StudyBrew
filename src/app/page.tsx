import { getSupabaseServer } from '@/lib/supabase/server'
import HomeClient from './HomeClient'
import type { Cafe } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const db = getSupabaseServer()
  const { data } = await db
    .from('cafes')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })

  return <HomeClient initialCafes={(data as Cafe[]) ?? []} />
}
