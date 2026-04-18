import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[supabase] SUPABASE_URL or SUPABASE_ANON_KEY not set — live queries will be unavailable.');
}

/**
 * Server-only Supabase client.
 * Uses service-level env vars (no NEXT_PUBLIC_ prefix).
 * Must only be imported in Server Components, API routes, or server actions.
 */
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;
