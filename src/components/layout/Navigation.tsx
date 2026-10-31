"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";
import { useDhakaClock } from "@/hooks/useDhakaClock";
import { createClient } from "@/lib/supabase/client";
import { KamrulBrandWordmark } from "./KamrulBrandWordmark";
import { FullScreenMenu } from "./FullScreenMenu";

interface NavigationProps {
  isRevealed?: boolean;
}

function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia("(min-width: 1024px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}
function getServerDesktopSnapshot() {
  return true;
}

export function Navigation({ isRevealed = true }: NavigationProps) {
  const timeStr = useDhakaClock("7:00 PM (GMT +6)");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    let isMounted = true;
    const supabase = createClient();

    const checkAdminStatus = async (userId?: string) => {
      if (!userId) {
        if (isMounted) setIsAdmin(false);
        return;
      }
      const { data: adminRecord } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      if (isMounted) {
        setIsAdmin(Boolean(adminRecord));
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminStatus(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAdminStatus(session?.user?.id);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot
  );

  // Continuous scroll interpolation
  const { scrollY } = useScroll();

  // Scroll interpolation range: 0px -> 160px for full compaction
  const rawProgress = useTransform(scrollY, [0, 160], [0, 1], { clamp: true });
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 280,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  // Physical container dimensions for zero ghost-layout height
  // Aspect ratio is 440:78 (~5.641)
  // Desktop: 52px high (293px wide) down to 28px high (158px wide)
  // Mobile: 36px high (203px wide) down to 24px high (135px wide)
  const logoHeightDesktop = useTransform(smoothProgress, [0, 1], ["52px", "28px"]);
  const logoWidthDesktop = useTransform(smoothProgress, [0, 1], ["293px", "158px"]);

  const logoHeightMobile = useTransform(smoothProgress, [0, 1], ["36px", "24px"]);
  const logoWidthMobile = useTransform(smoothProgress, [0, 1], ["203px", "135px"]);

  const activeLogoHeight = isDesktop ? logoHeightDesktop : logoHeightMobile;
  const activeLogoWidth = isDesktop ? logoWidthDesktop : logoWidthMobile;

  // Header vertical padding:
  // Initial: 16px top & bottom (84px total bar height)
  // Scrolled: 10px top & bottom (exact symmetric vertical centering, 48px total bar height)
  const paddingYDesktop = useTransform(smoothProgress, [0, 1], ["16px", "10px"]);
  const paddingYMobile = useTransform(smoothProgress, [0, 1], ["14px", "8px"]);
  const activePaddingY = isDesktop ? paddingYDesktop : paddingYMobile;

  // Glassmorphic background and border interpolation
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 0.85]);
  const borderOpacity = useTransform(smoothProgress, [0, 1], [0, 0.1]);
  const blurPx = useTransform(smoothProgress, [0, 1], [0, 24]);
  const shadowOpacity = useTransform(smoothProgress, [0, 1], [0, 0.5]);

  const rawBgColor = useTransform(
    bgOpacity,
    (v) => `rgba(8, 8, 8, ${v.toFixed(3)})`
  );
  const rawBorderColor = useTransform(
    borderOpacity,
    (v) => `rgba(255, 255, 255, ${v.toFixed(3)})`
  );
  const rawBackdropFilter = useTransform(
    blurPx,
    (v) => `blur(${v.toFixed(1)}px)`
  );
  const rawBoxShadow = useTransform(
    shadowOpacity,
    (v) =>
      v > 0.01
        ? `0 10px 30px -10px rgba(0, 0, 0, ${(v * 0.8).toFixed(2)})`
        : "none"
  );

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{
          opacity: isRevealed ? 1 : 0,
          y: isRevealed ? 0 : -24,
        }}
        transition={{
          duration: 0.7,
          ease: [0.25, 1, 0.5, 1],
          delay: 0.15,
        }}
        style={{
          backgroundColor: isMenuOpen ? "transparent" : rawBgColor,
          borderBottom: "1px solid",
          borderBottomColor: isMenuOpen ? "transparent" : rawBorderColor,
          backdropFilter: isMenuOpen ? "none" : rawBackdropFilter,
          WebkitBackdropFilter: isMenuOpen ? "none" : rawBackdropFilter,
          boxShadow: isMenuOpen ? "none" : rawBoxShadow,
          paddingTop: activePaddingY,
          paddingBottom: activePaddingY,
        }}
        className="fixed top-0 left-0 right-0 z-50 w-full px-5 sm:px-8 md:px-12 lg:px-16 pointer-events-auto transition-colors duration-200"
      >
        <nav className="w-full max-w-[1648px] mx-auto flex items-center justify-between text-white">
          {/* BRAND / LOGO: Oversized Brutalist Wordmark -> Compact Nav Transformation */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              aria-label={`${PORTFOLIO_DATA.brand.displayName} Homepage`}
              className="group inline-flex items-center select-none"
            >
              <motion.div
                style={{
                  width: activeLogoWidth,
                  height: activeLogoHeight,
                }}
                className="flex items-center justify-start will-change-[width,height]"
              >
                <KamrulBrandWordmark className="w-full h-full text-white group-hover:text-white/85 transition-colors" />
              </motion.div>
            </Link>
          </div>

          {/* RIGHT CLUSTER: Status Beacon, Live Time, and Menu Toggle Pill */}
          <div className="flex items-center gap-5 sm:gap-7 md:gap-8">
            {/* Status & Availability Beacon */}
            <div className="hidden lg:flex items-center gap-2.5 font-mono-custom text-[13px] text-[#b3b3b3]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">Available for Projects</span>
            </div>

            {/* Live Asia/Dhaka Time */}
            <div className="hidden md:flex items-center font-mono-custom text-[13px] text-[#b3b3b3] tracking-wide">
              <span>{timeStr}</span>
            </div>

            {/* Conditional Admin Dashboard Icon + Menu / Close Button */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  title="Admin Dashboard"
                  aria-label="Open Admin Dashboard"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <LayoutDashboard className="h-4 w-4 text-white" aria-hidden="true" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {isMenuOpen ? (
                  <>
                    <X className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    <span>CLOSE</span>
                  </>
                ) : (
                  <>
                    <Menu className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    <span>MENU</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Full-Screen Navigation Menu Overlay */}
      <FullScreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
