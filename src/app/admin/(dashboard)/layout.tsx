import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import Link from "next/link";
import { AdminNavLogout } from "./AdminNavLogout";
import { KamrulBrandWordmark } from "@/components/layout/KamrulBrandWordmark";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await verifyAdminSession();

  if (!user || !isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen w-full bg-[#0c0c0e] text-[#ededed] font-sans flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand / CMS Title */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
              aria-label="Kamrul Islam CMS"
            >
              <KamrulBrandWordmark className="h-[22px] sm:h-[24px] w-auto text-white flex-shrink-0" />
              <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 tracking-wider">
                CMS
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-1 font-mono-custom text-xs">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects/new"
                className="px-3 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                + New Project
              </Link>
            </nav>
          </div>

          {/* Right: User Email + Live Site Link + Logout */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-mono-custom text-xs border border-white/10 transition-colors"
            >
              <span>Live Site</span>
              <span>↗</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono-custom text-xs text-[#888]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[180px]">{user.email}</span>
            </div>

            <AdminNavLogout />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 px-4 sm:px-6 text-center">
        <p className="font-mono-custom text-xs text-[#555]">
          Kamrul Islam Portfolio Admin System • All rights reserved
        </p>
      </footer>
    </div>
  );
}
