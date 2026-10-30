import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { AdminSidebarShell } from "@/components/admin/AdminSidebarShell";

export const metadata: Metadata = {
  title: "Admin Portal",
  robots: {
    index: false,
    follow: false,
  },
};

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
    <AdminSidebarShell userEmail={user.email || "admin@kamrulislam.me"}>
      {children}
    </AdminSidebarShell>
  );
}
