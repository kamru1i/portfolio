"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function AdminFloatingPill() {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (isMounted) {
          setIsAdminLoggedIn(!!session?.user);
        }
      } catch {
        if (isMounted) setIsAdminLoggedIn(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAdminLoggedIn(!!session?.user);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Never show inside the admin area, and never show if not logged in
  if (!isAdminLoggedIn || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed bottom-6 right-6 z-50 select-none"
      >
        <Link
          href="/admin"
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#141416]/90 hover:bg-[#1a1a1e] text-white border border-white/20 hover:border-white/40 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          title="Open Admin CMS Dashboard"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono-custom text-xs uppercase tracking-wider text-white/90">
            CMS Dashboard
          </span>
          <span className="font-mono-custom text-xs text-white/40 group-hover:text-white transition-colors">
            ↗
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
