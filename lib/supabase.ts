import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client — safe to use in 'use client' components
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
