import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client using the service role key.
// Bypasses RLS — use only in API routes and webhooks, never on the client.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(url, serviceRoleKey)
}
