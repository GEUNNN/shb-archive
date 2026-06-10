// supabase.ts — shared Supabase client (anon key, read-only via RLS).
// Holds only the public anon key, so it's safe to import anywhere; the
// archive is fetched in Server Components and passed down to Client ones.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabase = createClient(url, anonKey);
