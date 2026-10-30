"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Zap,
  Check,
  Mail,
  Archive,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { ContactInquiryRecord } from "@/lib/inquiries-service";
import { InquiryStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            Client Inquiries Inbox
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            Backup archive of all contact form submissions — works alongside Resend email notifications.
          </p>
        </div>

        <Link
          href="/admin"
          className={buttonVariants({
            variant: "secondary",
            size: "default",
            className: "self-start sm:self-center",
          })}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Notice if SQL migration has not been run yet */}
      {tableMissing && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono-custom space-y-2">
          <div className="font-semibold text-amber-300 flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Runtime Backup Active (Database Migration Pending)</span>
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
        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-[#888] uppercase tracking-wider block mb-1">
            Total Inquiries
          </span>
          <span className="font-sans text-2xl font-semibold text-white">
            {stats.total}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-amber-400/80 uppercase tracking-wider block mb-1">
            Unread
          </span>
          <span className="font-sans text-2xl font-semibold text-amber-400">
            {stats.unread}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-emerald-400/80 uppercase tracking-wider block mb-1">
            Replied
          </span>
          <span className="font-sans text-2xl font-semibold text-emerald-400">
            {stats.replied}
          </span>
        </Card>

        <Card className="p-4 rounded-xl">
          <span className="font-mono-custom text-[11px] text-sky-400/80 uppercase tracking-wider block mb-1">
            Archived
          </span>
          <span className="font-sans text-2xl font-semibold text-sky-400">
            {stats.archived}
          </span>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter inquiries by status"
          className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#141416] border border-white/10"
        >
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
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
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
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666]"
          />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search client inquiries"
            placeholder="Search client, email, brief..."
            className="pl-9 pr-4 py-2 h-9 bg-[#141416] text-xs font-mono-custom"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMsg}
        </div>
      )}

      {/* Inquiries List */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="w-7 h-7 text-white animate-spin mx-auto mb-3" aria-hidden="true" />
          <p className="font-mono-custom text-xs text-[#888]">
            Loading client inquiries...
          </p>
        </Card>
      ) : filteredInquiries.length === 0 ? (
        <Card className="p-16 text-center">
          <p className="font-mono-custom text-sm text-[#888]">
            No client inquiries found for this filter.
          </p>
        </Card>
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
              <Card
                key={inquiry.id}
                className={`p-5 sm:p-6 transition-all space-y-4 ${
                  isUnread
                    ? "bg-[#17171b] border-amber-500/30"
                    : "bg-[#141416] border-white/10"
                }`}
              >
                {/* Top Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        inquiry.status === "unread"
                          ? "warning"
                          : inquiry.status === "replied"
                          ? "success"
                          : inquiry.status === "archived"
                          ? "muted"
                          : "info"
                      }
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{inquiry.status}</span>
                    </Badge>

                    <Badge variant="default">
                      {inquiry.project_type}
                    </Badge>

                    <Badge variant={inquiry.email_delivered ? "success" : "warning"}>
                      {inquiry.email_delivered ? (
                        <>
                          <Check className="h-3 w-3" aria-hidden="true" />
                          <span>Provider Accepted</span>
                        </>
                      ) : (
                        <span>Saved in Inbox Backup</span>
                      )}
                    </Badge>

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
                      className={buttonVariants({
                        variant: "default",
                        size: "sm",
                        className: "font-mono-custom",
                      })}
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reply via Email</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>

                    {inquiry.status === "unread" ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={updatingId === inquiry.id}
                        onClick={() => handleStatusChange(inquiry.id, "read")}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Mark Read</span>
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={updatingId === inquiry.id}
                        onClick={() => handleStatusChange(inquiry.id, "unread")}
                        className="text-[#aaa]"
                      >
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Mark Unread</span>
                      </Button>
                    )}

                    {inquiry.status !== "archived" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={updatingId === inquiry.id}
                        onClick={() =>
                          handleStatusChange(inquiry.id, "archived")
                        }
                        className="text-[#aaa]"
                      >
                        <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Archive</span>
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === inquiry.id}
                      onClick={() => handleDelete(inquiry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete</span>
                    </Button>
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
                    <span className="text-[#666] block">Company &amp; Budget</span>
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
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
