import { createBrowserClient } from '@supabase/ssr';

/**
 * Client-side Supabase instance.
 * Automatically injects the session from the browser's cookies.
 * Falls back to null dynamically if env vars are intentionally omitted for offline dev isolation.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
}
