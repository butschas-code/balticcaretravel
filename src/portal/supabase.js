import { createClient } from '@supabase/supabase-js';

var client;

/**
 * Lazy Supabase browser client. Returns null if env vars are missing (UI shows setup hint).
 */
export function getSupabase() {
  if (client) return client;
  var url = import.meta.env.VITE_SUPABASE_URL;
  var key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('YOUR_PROJECT')) return null;
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function isConfigured() {
  return getSupabase() != null;
}
