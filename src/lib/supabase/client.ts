import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://uilbqehatpncchadwjza.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbGJxZWhhdHBuY2NoYWR3anphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NTU4MjgsImV4cCI6MjEwNzEzMTgyOH0.XjgR3JQ4dAhm3B693WJjWqKUDyeiC8m7md6xtFnnRVg";

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
