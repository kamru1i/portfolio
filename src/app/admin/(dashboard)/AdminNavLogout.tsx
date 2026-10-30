"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AdminNavLogoutProps {
  fullWidth?: boolean;
}

export function AdminNavLogout({ fullWidth = false }: AdminNavLogoutProps) {
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
      className={`${
        fullWidth ? "w-full justify-center py-2.5 px-3.5" : "px-3 py-1.5"
      } inline-flex items-center gap-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 font-mono-custom text-xs border border-red-800/30 hover:border-red-700/50 transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
