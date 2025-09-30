import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  // Prefer service role for writes (bypasses RLS). If absent, gracefully fall back to anon key.
  if (serviceKey && serviceKey.length > 0) {
    return createClient(url, serviceKey)
  }

  if (anonKey && anonKey.length > 0) {
    // Fallback: will depend on RLS allowing the needed inserts/upserts.
    return createClient(url, anonKey)
  }

  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}
