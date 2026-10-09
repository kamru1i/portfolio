"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminNavLogout() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-300 font-mono-custom text-xs border border-red-800/30 transition-colors disabled:opacity-50"
    >
      {loggingOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}
