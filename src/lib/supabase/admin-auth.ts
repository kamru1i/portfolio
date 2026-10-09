import { createClient } from "./server";
import { User } from "@supabase/supabase-js";

export interface AdminAuthResult {
  user: User | null;
  isAdmin: boolean;
  error?: string;
}

/**
 * Verifies that the current request has an authenticated session AND that the
 * user's UUID is in the admin_users allowlist table.
 * Uses supabase.auth.getUser() on the server to prevent spoofed/client JWT manipulation.
 */
export async function verifyAdminSession(): Promise<AdminAuthResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      user: null,
      isAdmin: false,
      error: "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and publishable key.",
    };
  }

  // Always use getUser() to securely validate with the Supabase Auth server
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      user: null,
      isAdmin: false,
      error: authError?.message || "Not authenticated",
    };
  }

  // Check admin_users table
  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return {
      user,
      isAdmin: false,
      error: "User is authenticated but not authorized in the admin allowlist.",
    };
  }

  return {
    user,
    isAdmin: true,
  };
}
