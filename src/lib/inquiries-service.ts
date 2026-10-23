import { createClient } from "./supabase/server";
import { Database, InquiryStatus } from "@/types/database";

export type ContactInquiryRecord =
  Database["public"]["Tables"]["contact_inquiries"]["Row"];
export type ContactInquiryInsert =
  Database["public"]["Tables"]["contact_inquiries"]["Insert"];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_STATUSES: readonly InquiryStatus[] = [
  "unread",
  "read",
  "replied",
  "archived",
];

// In-memory runtime fallback store in case the remote Supabase migration
// (`public.contact_inquiries`) has not been executed yet.
const runtimeFallbackInquiries: ContactInquiryRecord[] = [];

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    msg.includes("contact_inquiries") ||
    msg.includes("does not exist") ||
    msg.includes("schema cache")
  );
}

/**
 * Persists a contact form submission into `public.contact_inquiries` as a reliable backup
 * alongside email notifications. Uses INSERT without SELECT so anonymous visitors can
 * submit under strict RLS without having SELECT access to other inquiries.
 */
export async function saveContactInquiry(input: {
  name: string;
  email: string;
  company?: string | null;
  project_type: string;
  budget_range?: string | null;
  timeline?: string | null;
  details: string;
  email_delivered: boolean;
}): Promise<{ saved: boolean; source: "supabase" | "memory" | "none" }> {
  const now = new Date().toISOString();
  const payload: ContactInquiryInsert = {
    name: input.name.trim().slice(0, 100),
    email: input.email.trim().slice(0, 120),
    company: input.company ? input.company.trim().slice(0, 100) : null,
    project_type: input.project_type.trim().slice(0, 100),
    budget_range: input.budget_range ? input.budget_range.trim().slice(0, 60) : null,
    timeline: input.timeline ? input.timeline.trim().slice(0, 60) : null,
    details: input.details.trim().slice(0, 5000),
    status: "unread",
    email_delivered: Boolean(input.email_delivered),
  };

  try {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.from("contact_inquiries").insert(payload);
      if (!error) {
        return { saved: true, source: "supabase" };
      }
      if (!isMissingTableError(error)) {
        console.warn("[Inquiries Backup Warning]:", error.message);
      }
    }
  } catch (err: unknown) {
    console.warn("[Inquiries Backup Exception]:", err);
  }

  // Fallback to runtime memory if Supabase table is not migrated yet
  const fallbackRecord: ContactInquiryRecord = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    company: payload.company ?? null,
    project_type: payload.project_type,
    budget_range: payload.budget_range ?? null,
    timeline: payload.timeline ?? null,
    details: payload.details,
    status: "unread",
    email_delivered: Boolean(payload.email_delivered),
    created_at: now,
    updated_at: now,
  };
  runtimeFallbackInquiries.unshift(fallbackRecord);
  if (runtimeFallbackInquiries.length > 200) {
    runtimeFallbackInquiries.pop();
  }
  return { saved: true, source: "memory" };
}

/**
 * Retrieves all contact inquiries for the Admin Dashboard Inbox.
 */
export async function getAllInquiriesForAdmin(): Promise<{
  inquiries: ContactInquiryRecord[];
  tableMissing: boolean;
}> {
  const supabase = await createClient();
  if (!supabase) {
    return { inquiries: runtimeFallbackInquiries, tableMissing: false };
  }

  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    if (isMissingTableError(error)) {
      return {
        inquiries: runtimeFallbackInquiries,
        tableMissing: true,
      };
    }
    throw new Error(`Failed to load inquiries: ${error.message}`);
  }

  return {
    inquiries: (data as ContactInquiryRecord[]) || [],
    tableMissing: false,
  };
}

/**
 * Updates the status ('unread' | 'read' | 'replied' | 'archived') of an inquiry.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus
): Promise<ContactInquiryRecord> {
  const cleanId = id.trim();
  if (!UUID_REGEX.test(cleanId)) {
    throw new Error("Invalid inquiry ID format.");
  }
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid inquiry status value.");
  }

  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .update({ status })
      .eq("id", cleanId)
      .select()
      .single();

    if (!error && data) {
      return data as ContactInquiryRecord;
    }

    if (error && !isMissingTableError(error)) {
      throw new Error(`Failed to update inquiry: ${error.message}`);
    }
  }

  const idx = runtimeFallbackInquiries.findIndex((item) => item.id === cleanId);
  if (idx === -1) {
    throw new Error("Inquiry not found.");
  }
  runtimeFallbackInquiries[idx] = {
    ...runtimeFallbackInquiries[idx],
    status,
    updated_at: new Date().toISOString(),
  };
  return runtimeFallbackInquiries[idx];
}

/**
 * Permanently deletes a contact inquiry.
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  const cleanId = id.trim();
  if (!UUID_REGEX.test(cleanId)) {
    throw new Error("Invalid inquiry ID format.");
  }

  const supabase = await createClient();
  if (supabase) {
    const { error } = await supabase
      .from("contact_inquiries")
      .delete()
      .eq("id", cleanId);

    if (!error) {
      return true;
    }

    if (!isMissingTableError(error)) {
      throw new Error(`Failed to delete inquiry: ${error.message}`);
    }
  }

  const idx = runtimeFallbackInquiries.findIndex((item) => item.id === cleanId);
  if (idx !== -1) {
    runtimeFallbackInquiries.splice(idx, 1);
  }
  return true;
}
