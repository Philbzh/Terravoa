import 'server-only'

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Admin client with service role key — use ONLY in server-side code (API routes, server actions)
// Never import this file from client components. The `server-only` import
// above makes accidental client imports fail the build instead of silently
// leaking the service role key to the browser bundle.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
