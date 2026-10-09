import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Return a dummy client if unconfigured so components don't crash
    return createBrowserClient<Database>(
      "https://placeholder-project.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
