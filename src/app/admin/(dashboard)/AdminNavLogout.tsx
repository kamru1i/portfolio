"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
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
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (typeof document !== "undefined") {
        document.cookie = "admin_ui_hint=; Path=/; Max-Age=0; SameSite=Lax";
      }
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
