"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="destructive"
      size="sm"
      onClick={handleLogout}
      disabled={loggingOut}
      className={fullWidth ? "w-full justify-center py-2.5 px-3.5 h-auto" : "px-3 py-1.5"}
    >
      {loggingOut ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
    </Button>
  );
}
