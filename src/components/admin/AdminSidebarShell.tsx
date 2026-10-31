"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FolderPlus,
  Film,
  Globe,
  ChevronDown,
  Inbox,
  FileText,
  Menu,
  X,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { ProjectType } from "@/types/project";
import { KamrulBrandWordmark } from "@/components/layout/KamrulBrandWordmark";
import { AdminNavLogout } from "@/app/admin/(dashboard)/AdminNavLogout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

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
  icon: LucideIcon;
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
        icon: LayoutDashboard,
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
        icon: FolderKanban,
      },
      {
        id: "new-project",
        label: "New Project",
        href: "/admin/projects/new",
        icon: FolderPlus,
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
        icon: Inbox,
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
        icon: FileText,
      },
    ],
  },
];

function resolveRouteNavId(
  pathname: string,
  isAllProjectsMode: boolean
): NavItemId {
  if (pathname === "/admin/projects/new") return "new-project";
  if (pathname.startsWith("/admin/projects/")) return "all-projects";
  if (pathname.startsWith("/admin/inquiries")) return "inquiries";
  if (pathname.startsWith("/admin/cv")) return "cv";
  if (pathname === "/admin" && isAllProjectsMode) {
    return "all-projects";
  }
  return "dashboard";
}

function resolveBreadcrumbTitle(
  pathname: string,
  activeId: NavItemId,
  newProjectDiscipline: ProjectType
): string {
  if (pathname === "/admin/projects/new" || activeId === "new-project") {
    return newProjectDiscipline === "web"
      ? "New Web Project"
      : "New Video Project";
  }
  if (pathname.startsWith("/admin/projects/")) return "Edit Project";
  if (pathname.startsWith("/admin/inquiries") || activeId === "inquiries") {
    return "Client Inquiries";
  }
  if (pathname.startsWith("/admin/cv") || activeId === "cv") {
    return "CV / Resume";
  }
  if (activeId === "all-projects") return "Manage Projects";
  return "Project Overview";
}

export function AdminSidebarShell({
  userEmail,
  children,
}: AdminSidebarShellProps) {
  const pathname = usePathname() || "/admin";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Tracks whether the "/admin" route is currently in "All Projects" sub-view mode
  const [isAllProjectsMode, setIsAllProjectsMode] = useState(false);

  // Collapsible state for "New Project" submenu ("Video Project" / "Web Project")
  const [newProjectExpanded, setNewProjectExpanded] = useState<boolean>(
    pathname === "/admin/projects/new"
  );
  const [newProjectDiscipline, setNewProjectDiscipline] =
    useState<ProjectType>("video");

  // Holds the clicked item ID while Next.js asynchronously transitions from `fromPathname` to the new route,
  // preventing the selector from momentarily falling back to "dashboard" mid-navigation.
  const [navOverride, setNavOverride] = useState<{
    fromPathname: string;
    targetId: NavItemId;
  } | null>(null);

  useEffect(() => {
    const syncLocationState = () => {
      if (window.location.hash === "#projects-manager") {
        setIsAllProjectsMode(true);
      } else {
        try {
          const raw = window.sessionStorage.getItem("admin_projects_return_state");
          if (raw) {
            const parsed = JSON.parse(raw) as { isAllProjectsMode?: boolean };
            if (parsed.isAllProjectsMode) {
              setIsAllProjectsMode(true);
            }
          }
        } catch {
          // Ignore storage read errors
        }
      }
      const params = new URLSearchParams(window.location.search);
      const t = params.get("type");
      if (t === "web" || t === "video") {
        setNewProjectDiscipline(t);
      }
      if (pathname === "/admin/projects/new") {
        setNewProjectExpanded(true);
      }
    };
    syncLocationState();
    window.addEventListener("hashchange", syncLocationState);
    window.addEventListener("popstate", syncLocationState);
    return () => {
      window.removeEventListener("hashchange", syncLocationState);
      window.removeEventListener("popstate", syncLocationState);
    };
  }, [pathname]);

  // When arriving on /admin in All Projects mode, ensure #projects-manager is scrolled into view
  // UNLESS returning from editing a project with saved scroll/row restoration pending
  useEffect(() => {
    if (pathname === "/admin" && isAllProjectsMode) {
      try {
        const raw = window.sessionStorage.getItem("admin_projects_return_state");
        if (raw) {
          const parsed = JSON.parse(raw) as { shouldRestoreScroll?: boolean };
          if (parsed.shouldRestoreScroll) {
            return;
          }
        }
      } catch {
        // Ignore storage read errors
      }
      const el = document.getElementById("projects-manager");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [pathname, isAllProjectsMode]);

  const activeNavId: NavItemId =
    navOverride && navOverride.fromPathname === pathname
      ? navOverride.targetId
      : resolveRouteNavId(pathname, isAllProjectsMode);

  const isNewProjectMenuOpen = newProjectExpanded;

  const breadcrumbTitle = resolveBreadcrumbTitle(
    pathname,
    activeNavId,
    newProjectDiscipline
  );

  const handleNavClick = (item: NavItem) => {
    setMobileDrawerOpen(false);

    if (item.id === "all-projects") {
      setIsAllProjectsMode(true);
      setNewProjectExpanded(false);
      if (pathname === "/admin") {
        setNavOverride(null);
        const el = document.getElementById("projects-manager");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        setNavOverride({ fromPathname: pathname, targetId: "all-projects" });
      }
      return;
    }

    if (item.id === "dashboard") {
      setIsAllProjectsMode(false);
      setNewProjectExpanded(false);
      try {
        window.sessionStorage.removeItem("admin_projects_return_state");
      } catch {
        // Ignore storage errors
      }
      if (pathname === "/admin") {
        setNavOverride(null);
        window.history.replaceState(null, "", `/admin${window.location.search}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setNavOverride({ fromPathname: pathname, targetId: "dashboard" });
      }
      return;
    }

    // Navigating to a dedicated route (/admin/inquiries, /admin/cv):
    // Keep the clicked item active immediately while pathname transitions away from /admin.
    setIsAllProjectsMode(false);
    setNewProjectExpanded(false);
    setNavOverride({ fromPathname: pathname, targetId: item.id });
  };

  const handleSelectNewProjectDiscipline = (discipline: ProjectType) => {
    setMobileDrawerOpen(false);
    setIsAllProjectsMode(false);
    setNewProjectExpanded(true);
    setNewProjectDiscipline(discipline);
    if (pathname !== "/admin/projects/new") {
      setNavOverride({ fromPathname: pathname, targetId: "new-project" });
    } else {
      setNavOverride(null);
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
            setIsAllProjectsMode(false);
            if (pathname === "/admin") {
              setNavOverride(null);
              window.history.replaceState(null, "", "/admin");
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setNavOverride({ fromPathname: pathname, targetId: "dashboard" });
            }
          }}
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg"
          aria-label="Kamrul Islam CMS Dashboard"
        >
          <KamrulBrandWordmark className="h-[21px] w-auto text-white shrink-0" />
          <Badge variant="default" className="px-2 py-0.5 text-[10px]">
            CMS
          </Badge>
        </Link>

        {/* Close Drawer button on mobile only */}
        <Button
          variant="secondary"
          size="icon-sm"
          onClick={() => setMobileDrawerOpen(false)}
          aria-label="Close navigation drawer"
          className="md:hidden text-[#aaa] hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
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
                const Icon = item.icon;

                if (item.id === "new-project") {
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setNewProjectExpanded((prev) => !prev)}
                        aria-expanded={isNewProjectMenuOpen}
                        className={`w-full group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl font-mono-custom text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
                        <span className="flex items-center gap-3 min-w-0">
                          <Icon
                            aria-hidden="true"
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-white"
                                : "text-[#7c7c86] group-hover:text-white"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 shrink-0 text-[#7c7c86] group-hover:text-white transition-transform duration-200 ${
                            isNewProjectMenuOpen ? "rotate-180 text-white" : ""
                          }`}
                        />
                      </button>

                      {isNewProjectMenuOpen && (
                        <div className="ml-5 pl-2.5 border-l border-white/10 space-y-1 pt-0.5">
                          <Link
                            href="/admin/projects/new?type=video"
                            onClick={() => handleSelectNewProjectDiscipline("video")}
                            aria-current={
                              isActive && newProjectDiscipline === "video"
                                ? "page"
                                : undefined
                            }
                            className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono-custom text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                              isActive && newProjectDiscipline === "video"
                                ? "bg-sky-500/15 text-sky-300 font-medium border border-sky-500/30"
                                : "text-[#8e8e98] hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <Film
                              aria-hidden="true"
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isActive && newProjectDiscipline === "video"
                                  ? "text-sky-400"
                                  : "text-[#7c7c86] group-hover:text-sky-400"
                              }`}
                            />
                            <span className="truncate">Video Project</span>
                          </Link>

                          <Link
                            href="/admin/projects/new?type=web"
                            onClick={() => handleSelectNewProjectDiscipline("web")}
                            aria-current={
                              isActive && newProjectDiscipline === "web"
                                ? "page"
                                : undefined
                            }
                            className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono-custom text-[11px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                              isActive && newProjectDiscipline === "web"
                                ? "bg-purple-500/15 text-purple-300 font-medium border border-purple-500/30"
                                : "text-[#8e8e98] hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                          >
                            <Globe
                              aria-hidden="true"
                              className={`h-3.5 w-3.5 shrink-0 ${
                                isActive && newProjectDiscipline === "web"
                                  ? "text-purple-400"
                                  : "text-[#7c7c86] group-hover:text-purple-400"
                              }`}
                            />
                            <span className="truncate">Web Project</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

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
                    <Icon
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#7c7c86] group-hover:text-white"
                      }`}
                    />
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

      {/* Accessible Mobile Off-Canvas Sidebar Drawer (< 768px) via shadcn Sheet */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="md:hidden">
          <SheetTitle className="sr-only">Admin Navigation Drawer</SheetTitle>
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>

      {/* Flexible Full-Width Main Content Region */}
      <div className="flex-1 min-w-0 md:pl-[244px] lg:pl-[264px] min-h-screen min-h-dvh flex flex-col">
        {/* Minimal Main-Area Header (Breadcrumb, Mobile Drawer Toggle, Live Site Action) */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 w-full bg-[#0c0c0e]/85 backdrop-blur-md border-b border-white/8 px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileDrawerOpen}
              className="md:hidden shrink-0"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            </Button>

            {/* Minimal Breadcrumb */}
            <div className="flex items-center gap-2 font-mono-custom text-xs text-[#888] truncate">
              <Link
                href="/admin"
                onClick={() => {
                  setIsAllProjectsMode(false);
                  if (pathname === "/admin") {
                    setNavOverride(null);
                    window.history.replaceState(null, "", "/admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    setNavOverride({ fromPathname: pathname, targetId: "dashboard" });
                  }
                }}
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
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
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
