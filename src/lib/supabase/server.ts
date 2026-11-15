import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const cookieStore = await cookies();

  const isProd = process.env.NODE_ENV === "production";

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookieOptions: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: isProd,
              sameSite: options?.sameSite ?? "lax",
              path: options?.path ?? "/",
            });
          });
        } catch {
          // Can be safely ignored if called from a Server Component
        }
      },
    },
  });
}
