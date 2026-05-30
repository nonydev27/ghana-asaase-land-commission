import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = 'https://okaqrgzosptxzlaesigv.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYXFyZ3pvc3B0eHpsYWVzaWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTE0MzcsImV4cCI6MjA2ODA4NzQzN30.wgNkfxTTyVTI-WNYGD9Vr2IGhYyF9xnA8-bfAqQbNrw'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
})
