import { notFound } from 'next/navigation'
import { getSupabaseServer } from '@/lib/supabase/server'
import CafeDetail from '@/components/cafe/CafeDetail'
import type { Cafe } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const db = getSupabaseServer()
  const { data } = await db.from('cafes').select('name').eq('id', params.id).single()
  return { title: data ? `${data.name} — StudyBrew NYC` : 'StudyBrew NYC' }
}

export default async function CafePage({ params }: Props) {
  const db = getSupabaseServer()
  const { data, error } = await db
    .from('cafes')
    .select('*')
    .eq('id', params.id)
    .eq('is_deleted', false)
    .single()

  if (error || !data) notFound()

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      <CafeDetail cafe={data as Cafe} />
    </main>
  )
}
