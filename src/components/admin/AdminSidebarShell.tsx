"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KamrulBrandWordmark } from "@/components/layout/KamrulBrandWordmark";
import { AdminNavLogout } from "@/app/admin/(dashboard)/AdminNavLogout";

interface AdminSidebarShellProps {
  userEmail: string;
  children: React.ReactNode;
}

type NavItemId =
  | "dashboard"
  | "all-projects"
  | "new-project"
  | "inquiries"
  | "cv";

interface NavItem {
  id: NavItemId;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    groupLabel: "PROJECT MANAGEMENT",
    items: [
      {
        id: "all-projects",
        label: "All Projects",
        href: "/admin#projects-manager",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <path d="M8 10v4" />
            <path d="M12 10v2" />
            <path d="M16 10v6" />
          </svg>
        ),
      },
      {
        id: "new-project",
        label: "New Project",
        href: "/admin/projects/new",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 10v6" />
            <path d="M9 13h6" />
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>
        ),
      },
    ],
  },
  {
    groupLabel: "INQUIRIES",
    items: [
      {
        id: "inquiries",
        label: "Client Inquiries",
        href: "/admin/inquiries",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        ),
      },
    ],
  },
  {
    groupLabel: "DOCUMENTS",
    items: [
      {
        id: "cv",
        label: "CV / Resume",
        href: "/admin/cv",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
        ),
      },
    ],
  },
];

function resolveActiveNavId(pathname: string, currentHash: string): NavItemId {
  if (pathname === "/admin/projects/new") return "new-project";
  if (pathname.startsWith("/admin/projects/")) return "all-projects";
  if (pathname.startsWith("/admin/inquiries")) return "inquiries";
  if (pathname.startsWith("/admin/cv")) return "cv";
  if (pathname === "/admin" && currentHash === "#projects-manager") {
    return "all-projects";
  }
  return "dashboard";
}

function resolveBreadcrumbTitle(pathname: string, activeId: NavItemId): string {
  if (pathname === "/admin/projects/new") return "New Project";
  if (pathname.startsWith("/admin/projects/")) return "Edit Project";
  if (pathname.startsWith("/admin/inquiries")) return "Client Inquiries";
  if (pathname.startsWith("/admin/cv")) return "CV / Resume";
  if (activeId === "all-projects") return "Manage Projects";
  return "Project Overview";
}

export function AdminSidebarShell({
  userEmail,
  children,
}: AdminSidebarShellProps) {
  const pathname = usePathname() || "/admin";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      setCurrentHash(window.location.hash || "");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  // Close mobile drawer on Escape key and lock background body scroll while open
  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  const activeNavId = resolveActiveNavId(pathname, currentHash);
  const breadcrumbTitle = resolveBreadcrumbTitle(pathname, activeNavId);

  const handleNavClick = (item: NavItem) => {
    setMobileDrawerOpen(false);
    if (item.id === "all-projects") {
      setCurrentHash("#projects-manager");
      if (pathname === "/admin") {
        const el = document.getElementById("projects-manager");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    } else if (item.id === "dashboard") {
      setCurrentHash("");
      if (pathname === "/admin") {
        window.history.replaceState(null, "", "/admin");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentHash("");
    }
  };

  const renderSidebarContent = () => (
    <>
      {/* Top Sidebar Branding */}
      <div className="shrink-0 h-16 px-5 border-b border-white/10 flex items-center justify-between gap-3">
        <Link
          href="/admin"
          onClick={() => {
            setMobileDrawerOpen(false);
            setCurrentHash("");
          }}
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
          aria-label="Kamrul Islam CMS Dashboard"
        >
          <KamrulBrandWordmark className="h-[21px] w-auto text-white shrink-0" />
          <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 tracking-wider">
            CMS
          </span>
        </Link>

        {/* Close Drawer button on mobile only */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(false)}
          aria-label="Close navigation drawer"
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-[#aaa] hover:text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Scrollable Navigation Groups (scrolls only when content exceeds 100dvh) */}
      <nav
        aria-label="Admin sidebar navigation"
        data-lenis-prevent
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-5 space-y-6"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.groupLabel} className="space-y-1.5">
            <div className="px-3 font-mono-custom text-[10px] uppercase tracking-[0.14em] text-[#6d6d75] select-none">
              {group.groupLabel}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeNavId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono-custom text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                      isActive
                        ? "bg-white/12 text-white font-medium border border-white/15 shadow-xs"
                        : "text-[#9ca3af] hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white"
                      />
                    )}
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#7c7c86] group-hover:text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Sidebar Footer: Admin Account Status + Sign Out */}
      <div className="shrink-0 p-4 border-t border-white/10 bg-[#0d0d10]/90 space-y-3">
        <div className="px-3 py-2.5 rounded-xl bg-white/3 border border-white/8 flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0" title="Admin Session Online">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block font-mono-custom text-[10px] uppercase tracking-wider text-emerald-400/90 leading-tight">
              Online • Admin
            </span>
            <span
              className="block font-mono-custom text-xs text-[#d4d4d8] truncate mt-0.5"
              title={userEmail}
            >
              {userEmail}
            </span>
          </div>
        </div>

        <AdminNavLogout fullWidth />
      </div>
    </>
  );

  return (
    <div className="min-h-screen min-h-dvh w-full bg-[#0c0c0e] text-[#ededed] font-sans flex overflow-x-clip">
      {/* Stationary Fixed Left Sidebar (Tablet & Desktop >= 768px) */}
      <aside
        aria-label="Primary admin sidebar"
        className="hidden md:flex fixed inset-y-0 left-0 z-40 md:w-[244px] lg:w-[264px] h-screen h-dvh flex-col bg-[#111114]/95 backdrop-blur-xl border-r border-white/10 select-none"
      >
        {renderSidebarContent()}
      </aside>

      {/* Accessible Mobile Off-Canvas Sidebar Drawer (< 768px) */}
      {mobileDrawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative z-10 w-[268px] max-w-[85vw] h-screen h-dvh flex flex-col bg-[#111114] border-r border-white/15 shadow-2xl select-none">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Flexible Full-Width Main Content Region */}
      <div className="flex-1 min-w-0 md:pl-[244px] lg:pl-[264px] min-h-screen min-h-dvh flex flex-col">
        {/* Minimal Main-Area Header (Breadcrumb, Mobile Drawer Toggle, Live Site Action) */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 w-full bg-[#0c0c0e]/85 backdrop-blur-md border-b border-white/8 px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileDrawerOpen}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Minimal Breadcrumb */}
            <div className="flex items-center gap-2 font-mono-custom text-xs text-[#888] truncate">
              <Link
                href="/admin"
                onClick={() => setCurrentHash("")}
                className="hover:text-white transition-colors"
              >
                Admin CMS
              </Link>
              <span className="text-[#555]">/</span>
              <span className="text-white font-medium truncate">
                {breadcrumbTitle}
              </span>
            </div>
          </div>

          {/* Right: Live Site Action Only (no duplicated nav items) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-mono-custom text-xs border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span>Live Site</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Full-Width Scrollable Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
          {children}
        </main>

        {/* Subtle Footer */}
        <footer className="w-full border-t border-white/5 py-4 px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-mono-custom text-[11px] text-[#555]">
            Kamrul Islam Portfolio Admin System • All rights reserved
          </p>
          <span className="font-mono-custom text-[11px] text-[#444]">
            CMS Workspace
          </span>
        </footer>
      </div>
    </div>
  );
}
