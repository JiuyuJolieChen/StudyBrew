import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase/server'
import CafeForm from '@/components/form/CafeForm'
import WatercolorSurface from '@/components/ui/WatercolorSurface'
import type { Cafe } from '@/types'
import type { Metadata } from 'next'
import formStyles from '@/components/form/CafeForm.module.css'
import uiStyles from '@/components/ui/ui.module.css'

export const metadata: Metadata = { title: 'Add a Café — StudyBrew NYC' }

interface Props {
  searchParams: { edit?: string }
}

export default async function AddPage({ searchParams }: Props) {
  let initialData: Cafe | undefined

  if (searchParams.edit) {
    const db = getSupabaseServer()
    const { data } = await db
      .from('cafes')
      .select('*')
      .eq('id', searchParams.edit)
      .eq('is_deleted', false)
      .single()
    initialData = (data as Cafe) ?? undefined
  }

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <span className={uiStyles.chevronLeft} aria-hidden="true" />
        Back to map
      </Link>
      <div className={formStyles['add-card']}>
        <WatercolorSurface seed={2} />
        <div className={formStyles['add-content']}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-8)' }}>
            {searchParams.edit ? 'Edit café' : 'Add a café'}
          </h1>
          <CafeForm initialData={initialData} editId={searchParams.edit} />
        </div>
      </div>
    </main>
  )
}
