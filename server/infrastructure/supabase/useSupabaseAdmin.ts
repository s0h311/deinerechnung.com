import { SupabaseClient, createClient } from '@supabase/supabase-js'

export default function useSupabaseAdmin(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
}
