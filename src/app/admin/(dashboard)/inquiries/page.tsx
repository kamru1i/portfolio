"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ContactInquiryRecord } from "@/lib/inquiries-service";
import { InquiryStatus } from "@/types/database";

type FilterTab = "all" | InquiryStatus;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiryRecord[]>([]);
  const [tableMissing, setTableMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/inquiries");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load inquiries");
        }
        if (isMounted) {
          setInquiries(data.inquiries || []);
          setTableMissing(Boolean(data.tableMissing));
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg(
            err instanceof Error ? err.message : "Error loading inquiries"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = inquiries.length;
    const unread = inquiries.filter((i) => i.status === "unread").length;
    const replied = inquiries.filter((i) => i.status === "replied").length;
    const archived = inquiries.filter((i) => i.status === "archived").length;
    return { total, unread, replied, archived };
  }, [inquiries]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      if (activeTab !== "all" && item.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.company?.toLowerCase().includes(q) ?? false) ||
          item.project_type.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [inquiries, activeTab, searchQuery]);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? data.inquiry : item))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete inquiry");
      }
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono-custom text-xs text-[#888] mb-2">
            <Link href="/admin" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white">Client Inquiries</span>
          </div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            Client Inquiries Inbox
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            Backup archive of all contact form submissions — works alongside Resend email notifications.
          </p>
        </div>

        <Link
          href="/admin"
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
        >
          ← Back to Projects
        </Link>
      </div>

      {/* Notice if SQL migration has not been run yet */}
      {tableMissing && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom space-y-2">
          <div className="font-semibold text-amber-300">
            ⚡ Runtime Backup Active (Database Migration Pending)
          </div>
          <p className="text-amber-200/80 leading-relaxed">
            Inquiries are currently being captured in server runtime memory. To enable permanent PostgreSQL storage across deployments, run the migration file{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/40 text-white">
              supabase/migrations/20261024000000_add_case_study_fields_and_inquiries.sql
            </code>{" "}
            in your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-[#888] uppercase tracking-wider block mb-1">
            Total Inquiries
          </span>
          <span className="font-sans text-2xl font-semibold text-white">
            {stats.total}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-amber-400/80 uppercase tracking-wider block mb-1">
            Unread
          </span>
          <span className="font-sans text-2xl font-semibold text-amber-400">
            {stats.unread}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-emerald-400/80 uppercase tracking-wider block mb-1">
            Replied
          </span>
          <span className="font-sans text-2xl font-semibold text-emerald-400">
            {stats.replied}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141416] border border-white/10">
          <span className="font-mono-custom text-[11px] text-sky-400/80 uppercase tracking-wider block mb-1">
            Archived
          </span>
          <span className="font-sans text-2xl font-semibold text-sky-400">
            {stats.archived}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#141416] border border-white/10">
          {(
            [
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "read", label: "Read" },
              { id: "replied", label: "Replied" },
              { id: "archived", label: "Archived" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-white/15 text-white font-medium"
                  : "text-[#888] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, email, brief..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#141416] border border-white/10 text-white placeholder-white/20 text-xs font-mono-custom focus:outline-none focus:border-white/30"
          />
          <span className="absolute left-3 top-2.5 text-[#666] text-xs">🔍</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMsg}
        </div>
      )}

      {/* Inquiries List */}
      {loading ? (
        <div className="p-16 text-center rounded-2xl bg-[#141416] border border-white/10">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-3" />
          <p className="font-mono-custom text-xs text-[#888]">
            Loading client inquiries...
          </p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#141416] border border-white/10">
          <p className="font-mono-custom text-sm text-[#888]">
            No client inquiries found for this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => {
            const isUnread = inquiry.status === "unread";
            const formattedDate = new Date(inquiry.created_at).toLocaleString(
              "en-US",
              {
                dateStyle: "medium",
                timeStyle: "short",
              }
            );

            return (
              <div
                key={inquiry.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all space-y-4 ${
                  isUnread
                    ? "bg-[#17171b] border-amber-500/30"
                    : "bg-[#141416] border-white/10"
                }`}
              >
                {/* Top Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-mono-custom text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${
                        inquiry.status === "unread"
                          ? "bg-amber-950/60 text-amber-300 border-amber-700/50"
                          : inquiry.status === "replied"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/50"
                          : inquiry.status === "archived"
                          ? "bg-white/5 text-[#777] border-white/10"
                          : "bg-sky-950/50 text-sky-300 border-sky-800/40"
                      }`}
                    >
                      ● {inquiry.status}
                    </span>

                    <span className="font-mono-custom text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-white/8 text-white/90 border border-white/10">
                      {inquiry.project_type}
                    </span>

                    <span
                      className={`font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                        inquiry.email_delivered
                          ? "bg-emerald-950/30 text-emerald-400 border-emerald-800/30"
                          : "bg-amber-950/30 text-amber-400 border-amber-800/30"
                      }`}
                    >
                      {inquiry.email_delivered
                        ? "Email Delivered ✓"
                        : "Saved in Inbox Backup"}
                    </span>

                    <span className="font-mono-custom text-xs text-[#777]">
                      • {formattedDate}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                        `Re: ${inquiry.project_type} Enquiry — Kamrul Islam`
                      )}`}
                      onClick={() => {
                        if (inquiry.status !== "replied") {
                          handleStatusChange(inquiry.id, "replied");
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs font-medium transition-colors"
                    >
                      Reply via Email ↗
                    </a>

                    {inquiry.status === "unread" ? (
                      <button
                        type="button"
                        disabled={updatingId === inquiry.id}
                        onClick={() => handleStatusChange(inquiry.id, "read")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={updatingId === inquiry.id}
                        onClick={() => handleStatusChange(inquiry.id, "unread")}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#aaa] font-mono-custom text-xs border border-white/10 transition-colors"
                      >
                        Mark Unread
                      </button>
                    )}

                    {inquiry.status !== "archived" && (
                      <button
                        type="button"
                        disabled={updatingId === inquiry.id}
                        onClick={() =>
                          handleStatusChange(inquiry.id, "archived")
                        }
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#aaa] font-mono-custom text-xs border border-white/10 transition-colors"
                      >
                        Archive
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={deletingId === inquiry.id}
                      onClick={() => handleDelete(inquiry.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-300 font-mono-custom text-xs border border-red-800/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs font-mono-custom">
                  <div>
                    <span className="text-[#666] block">Client Name</span>
                    <span className="text-white font-sans font-medium text-sm">
                      {inquiry.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666] block">Email</span>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-sky-400 hover:underline break-all"
                    >
                      {inquiry.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[#666] block">Company & Budget</span>
                    <span className="text-white/90">
                      {inquiry.company || "Independent"} •{" "}
                      {inquiry.budget_range || "Not specified"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666] block">Timeline</span>
                    <span className="text-white/90">
                      {inquiry.timeline || "Not specified"}
                    </span>
                  </div>
                </div>

                {/* Brief Message */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/8 font-sans text-sm text-white/90 whitespace-pre-wrap leading-relaxed select-text">
                  {inquiry.details}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
