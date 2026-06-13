import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function getSupabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        // Opt out of Next.js 14 fetch cache so every request reads fresh data
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  )
}
