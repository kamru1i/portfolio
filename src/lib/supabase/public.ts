import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookie-less public Supabase client for read-only public queries
 * (`projects` where `is_published = true`, published `cv_documents`).
 * Does NOT call `next/headers` `cookies()`, allowing Next.js Full Route Cache & ISR.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
