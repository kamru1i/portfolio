import { createClient } from "./supabase/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export type CvDocumentRecord = Database["public"]["Tables"]["cv_documents"]["Row"];
export type CvDocumentInsert = Database["public"]["Tables"]["cv_documents"]["Insert"];
export type CvDocumentUpdate = Database["public"]["Tables"]["cv_documents"]["Update"];

export type DocumentCategory = "cv" | "resume" | "portfolio" | "cover-letter";

export interface DocumentCategoryMeta {
  id: DocumentCategory;
  label: string;
  shortLabel: string;
  heading: string;
  defaultTitle: string;
  downloadFilename: string;
  storagePrefix: string;
}

export const DOCUMENT_CATEGORIES: Record<DocumentCategory, DocumentCategoryMeta> = {
  cv: {
    id: "cv",
    label: "Curriculum Vitae",
    shortLabel: "CV",
    heading: "Curriculum Vitae (PDF)",
    defaultTitle: "Kamrul Islam — Curriculum Vitae",
    downloadFilename: "Kamrul-Islam-CV.pdf",
    storagePrefix: "cv/cv-",
  },
  resume: {
    id: "resume",
    label: "Resume",
    shortLabel: "Resume",
    heading: "Resume (PDF)",
    defaultTitle: "Kamrul Islam — Resume",
    downloadFilename: "Kamrul-Islam-Resume.pdf",
    storagePrefix: "cv/resume-",
  },
  portfolio: {
    id: "portfolio",
    label: "Portfolio",
    shortLabel: "Portfolio",
    heading: "Portfolio (PDF)",
    defaultTitle: "Kamrul Islam — Portfolio",
    downloadFilename: "Kamrul-Islam-Portfolio.pdf",
    storagePrefix: "cv/portfolio-",
  },
  "cover-letter": {
    id: "cover-letter",
    label: "Cover Letter",
    shortLabel: "Cover Letter",
    heading: "Cover Letter (PDF)",
    defaultTitle: "Kamrul Islam — Cover Letter",
    downloadFilename: "Kamrul-Islam-Cover-Letter.pdf",
    storagePrefix: "cv/cover-letter-",
  },
};

export function normalizeDocumentCategory(value?: string | null): DocumentCategory {
  if (value === "resume" || value === "portfolio" || value === "cover-letter") {
    return value;
  }
  return "cv";
}

export function getDocumentCategory(
  doc: Pick<CvDocumentRecord, "storage_path" | "file_url">
): DocumentCategory {
  const sp = (doc.storage_path || "").toLowerCase();
  const fu = (doc.file_url || "").toLowerCase();
  if (sp.startsWith("cv/resume-") || fu.includes("type=resume")) return "resume";
  if (sp.startsWith("cv/portfolio-") || fu.includes("type=portfolio")) return "portfolio";
  if (sp.startsWith("cv/cover-letter-") || fu.includes("type=cover-letter")) {
    return "cover-letter";
  }
  return "cv";
}

export function isDocumentPublishedRecord(
  doc: Pick<CvDocumentRecord, "is_published" | "file_url">
): boolean {
  return Boolean(doc.is_published) || (doc.file_url || "").includes("active=1");
}

function buildFileUrl(category: DocumentCategory, fallbackActive = false): string {
  const base = `/api/cv/pdf?type=${category}`;
  return fallbackActive ? `${base}&active=1` : base;
}

function normalizeRecord(doc: CvDocumentRecord): CvDocumentRecord {
  return {
    ...doc,
    is_published: isDocumentPublishedRecord(doc),
  };
}

export const CV_BUCKET_NAME = "cv-documents";
export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const PUBLIC_CV_DOWNLOAD_FILENAME = "Kamrul-Islam-CV.pdf";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Sanitizes an uploaded PDF filename to prevent path traversal, control chars, or unsafe characters.
 */
export function sanitizeCvFilename(rawName: string): string {
  const baseName = rawName
    .replace(/^.*[\\/]/, "") // strip any directory paths
    .replace(/[\u0000-\u001f\u007f]/g, "") // strip control chars
    .trim();

  const withoutExt = baseName.replace(/\.pdf$/i, "");
  const cleanStem = withoutExt
    .replace(/[^a-zA-Z0-9._\-\s]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${cleanStem || "Kamrul-Islam-CV"}.pdf`;
}

/**
 * Performs strict server-side validation of an uploaded PDF file:
 * 1. Verifies .pdf extension
 * 2. Verifies application/pdf MIME type
 * 3. Enforces > 0 bytes and <= 10 MB size limit
 * 4. Inspects the binary header for the %PDF- magic byte signature
 */
export async function validateAndReadPdfBuffer(file: File): Promise<{
  buffer: Buffer;
  sanitizedFileName: string;
  fileSize: number;
}> {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No valid file was provided.");
  }

  const rawName = file.name || "";
  if (!rawName.toLowerCase().endsWith(".pdf")) {
    throw new Error("Invalid file extension. Only .pdf files are permitted.");
  }

  const allowedMimeTypes = ["application/pdf", "application/x-pdf"];
  if (!allowedMimeTypes.includes((file.type || "").toLowerCase())) {
    throw new Error("Invalid MIME type. File must be application/pdf.");
  }

  if (file.size <= 0) {
    throw new Error("Uploaded PDF file is empty.");
  }

  if (file.size > MAX_CV_FILE_SIZE_BYTES) {
    throw new Error("PDF file exceeds the 10 MB maximum size limit.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.byteLength < 8) {
    throw new Error("Uploaded file is too small to be a valid PDF document.");
  }

  // Check %PDF- magic header bytes (0x25 0x50 0x44 0x46 0x2D)
  const headerAscii = buffer.subarray(0, 5).toString("ascii");
  if (headerAscii !== "%PDF-") {
    throw new Error("Invalid file signature. Uploaded file does not have a valid %PDF- binary header.");
  }

  const sanitizedFileName = sanitizeCvFilename(rawName);

  return {
    buffer,
    sanitizedFileName,
    fileSize: buffer.byteLength,
  };
}

/**
 * Retrieves the currently published document for a given category (defaults to "cv").
 * Returns null safely if none is published or if the database is unreachable.
 */
export async function getPublishedCvDocument(
  category: DocumentCategory = "cv"
): Promise<CvDocumentRecord | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("cv_documents")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !data) {
      return null;
    }

    const rows = (data as CvDocumentRecord[]).map(normalizeRecord);
    return (
      rows.find(
        (doc) => getDocumentCategory(doc) === category && doc.is_published
      ) || null
    );
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently published documents across all 4 categories.
 */
export async function getPublishedDocumentsByCategory(): Promise<
  Record<DocumentCategory, CvDocumentRecord | null>
> {
  const result: Record<DocumentCategory, CvDocumentRecord | null> = {
    cv: null,
    resume: null,
    portfolio: null,
    "cover-letter": null,
  };

  try {
    const supabase = await createClient();
    if (!supabase) return result;

    const { data, error } = await supabase
      .from("cv_documents")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !data) return result;

    for (const raw of data as CvDocumentRecord[]) {
      const doc = normalizeRecord(raw);
      if (!doc.is_published) continue;
      const cat = getDocumentCategory(doc);
      if (!result[cat]) {
        result[cat] = doc;
      }
    }
    return result;
  } catch {
    return result;
  }
}

/**
 * Retrieves all document records (optionally filtered by category) for the Admin Dashboard.
 */
export async function getAllCvDocumentsForAdmin(
  category?: DocumentCategory
): Promise<CvDocumentRecord[]> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("cv_documents")
    .select("*")
    .order("is_published", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  const all = ((data as CvDocumentRecord[]) || []).map(normalizeRecord);
  const filtered = category
    ? all.filter((doc) => getDocumentCategory(doc) === category)
    : all;

  return filtered.sort((a, b) => {
    if (a.is_published !== b.is_published) return a.is_published ? -1 : 1;
    return (
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });
}

/**
 * Retrieves a single document record by ID (used by admin routes or preview).
 */
export async function getCvDocumentById(id: string): Promise<CvDocumentRecord | null> {
  const cleanId = id.trim();
  if (!UUID_REGEX.test(cleanId)) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("cv_documents")
    .select("*")
    .eq("id", cleanId)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeRecord(data as CvDocumentRecord);
}

/**
 * Downloads the raw PDF Blob from the controlled cv-documents bucket for a given storage path.
 */
export async function downloadCvStorageBlob(storagePath: string): Promise<Blob | null> {
  if (!storagePath || storagePath.includes("..") || !storagePath.startsWith("cv/")) {
    return null;
  }
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(CV_BUCKET_NAME)
    .download(storagePath);

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Uploads a new PDF document to Supabase Storage and safely updates public.cv_documents.
 */
export async function uploadAndReplaceCvDocument(params: {
  file: File;
  category?: DocumentCategory;
  title?: string;
  versionLabel?: string | null;
  publishImmediately?: boolean;
  uploadedBy: string;
}): Promise<CvDocumentRecord> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const category: DocumentCategory = params.category || "cv";
  const categoryMeta = DOCUMENT_CATEGORIES[category];

  const { buffer, sanitizedFileName, fileSize } = await validateAndReadPdfBuffer(params.file);
  const publishImmediately = params.publishImmediately !== false;
  const nowIso = new Date().toISOString();
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `${categoryMeta.storagePrefix}${uniquePrefix}-${sanitizedFileName.toLowerCase()}`;

  // Step 1: Upload to private/controlled storage bucket first
  const { error: uploadError } = await supabase.storage
    .from(CV_BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Keep reference to currently published document of the SAME category in case we need to roll back
  let previousPublishedDoc: CvDocumentRecord | null = null;
  if (publishImmediately) {
    const existingCategoryDocs = await getAllCvDocumentsForAdmin(category);
    const currentActive = existingCategoryDocs.find((d) => d.is_published) || null;

    if (currentActive) {
      previousPublishedDoc = currentActive;
      const { error: demoteError } = await supabase
        .from("cv_documents")
        .update({
          is_published: false,
          file_url: buildFileUrl(category, false),
        })
        .eq("id", currentActive.id);

      if (demoteError) {
        await supabase.storage.from(CV_BUCKET_NAME).remove([storagePath]);
        throw new Error(`Failed to transition existing active document: ${demoteError.message}`);
      }
    }
  }

  // Step 2: Insert new document metadata record
  const cleanTitle = (params.title || categoryMeta.defaultTitle).trim().slice(0, 140);
  const cleanVersion = params.versionLabel ? params.versionLabel.trim().slice(0, 60) : null;

  const insertPayload: CvDocumentInsert = {
    title: cleanTitle || categoryMeta.defaultTitle,
    file_name: sanitizedFileName,
    storage_path: storagePath,
    file_url: buildFileUrl(category, false),
    file_size: fileSize,
    mime_type: "application/pdf",
    version_label: cleanVersion,
    is_published: publishImmediately,
    published_at: publishImmediately ? nowIso : null,
    uploaded_by: params.uploadedBy,
  };

  let { data: inserted, error: insertError } = await supabase
    .from("cv_documents")
    .insert(insertPayload)
    .select("*")
    .single();

  // Fallback if DB still has legacy single-row idx_cv_documents_single_published unique index
  if (
    insertError &&
    publishImmediately &&
    category !== "cv" &&
    insertError.message.includes("idx_cv_documents_single_published")
  ) {
    const fallbackPayload: CvDocumentInsert = {
      ...insertPayload,
      is_published: false,
      file_url: buildFileUrl(category, true),
    };
    const retry = await supabase
      .from("cv_documents")
      .insert(fallbackPayload)
      .select("*")
      .single();
    inserted = retry.data;
    insertError = retry.error;
  }

  if (insertError || !inserted) {
    await supabase.storage.from(CV_BUCKET_NAME).remove([storagePath]);
    if (previousPublishedDoc) {
      await supabase
        .from("cv_documents")
        .update({
          is_published: previousPublishedDoc.is_published,
          file_url: previousPublishedDoc.file_url,
        })
        .eq("id", previousPublishedDoc.id);
    }
    throw new Error(`Failed to save document metadata: ${insertError?.message || "Unknown database error"}`);
  }

  // Step 3: Clean up older archived versions of the same category beyond the 3 most recent inactive records
  try {
    const categoryDocs = await getAllCvDocumentsForAdmin(category);
    const inactiveRows = categoryDocs.filter((d) => !d.is_published);

    if (inactiveRows.length > 3) {
      const rowsToPrune = inactiveRows.slice(3);
      const pathsToRemove = rowsToPrune.map((r) => r.storage_path).filter(Boolean);
      const idsToRemove = rowsToPrune.map((r) => r.id);

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(CV_BUCKET_NAME).remove(pathsToRemove);
      }
      if (idsToRemove.length > 0) {
        await supabase.from("cv_documents").delete().in("id", idsToRemove);
      }
    }
  } catch {
    // Non-fatal archive cleanup error
  }

  revalidatePath("/cv");
  revalidatePath("/sitemap.xml");

  return normalizeRecord(inserted as CvDocumentRecord);
}

/**
 * Publishes or unpublishes a specific document, ensuring at most one document per category is active.
 */
export async function updateCvDocumentState(
  id: string,
  updates: {
    is_published?: boolean;
    title?: string;
    version_label?: string | null;
  }
): Promise<CvDocumentRecord> {
  const cleanId = id.trim();
  if (!UUID_REGEX.test(cleanId)) {
    throw new Error("Invalid document ID format.");
  }
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const target = await getCvDocumentById(cleanId);
  if (!target) {
    throw new Error("Document not found.");
  }

  const category = getDocumentCategory(target);
  const categoryMeta = DOCUMENT_CATEGORIES[category];

  if (updates.is_published === true && !target.is_published) {
    // Demote any other currently published document of the SAME category first
    const categoryDocs = await getAllCvDocumentsForAdmin(category);
    const otherActiveIds = categoryDocs
      .filter((d) => d.id !== cleanId && d.is_published)
      .map((d) => d.id);

    if (otherActiveIds.length > 0) {
      await supabase
        .from("cv_documents")
        .update({
          is_published: false,
          file_url: buildFileUrl(category, false),
        })
        .in("id", otherActiveIds);
    }
  }

  const updatePayload: CvDocumentUpdate = {};
  if (updates.is_published !== undefined) {
    updatePayload.is_published = updates.is_published;
    updatePayload.file_url = buildFileUrl(category, false);
    updatePayload.published_at = updates.is_published
      ? target.published_at || new Date().toISOString()
      : target.published_at;
  }
  if (updates.title !== undefined) {
    updatePayload.title = updates.title.trim().slice(0, 140) || categoryMeta.defaultTitle;
  }
  if (updates.version_label !== undefined) {
    updatePayload.version_label = updates.version_label ? updates.version_label.trim().slice(0, 60) : null;
  }

  let { data, error } = await supabase
    .from("cv_documents")
    .update(updatePayload)
    .eq("id", cleanId)
    .select("*")
    .single();

  if (
    error &&
    updates.is_published === true &&
    category !== "cv" &&
    error.message.includes("idx_cv_documents_single_published")
  ) {
    const retry = await supabase
      .from("cv_documents")
      .update({
        ...updatePayload,
        is_published: false,
        file_url: buildFileUrl(category, true),
      })
      .eq("id", cleanId)
      .select("*")
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error || !data) {
    throw new Error(`Failed to update document: ${error?.message || "Unknown error"}`);
  }

  revalidatePath("/cv");
  revalidatePath("/sitemap.xml");

  return normalizeRecord(data as CvDocumentRecord);
}

/**
 * Deletes a document and its underlying PDF file in Supabase Storage.
 */
export async function deleteCvDocument(id: string): Promise<boolean> {
  const cleanId = id.trim();
  if (!UUID_REGEX.test(cleanId)) {
    throw new Error("Invalid document ID format.");
  }
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const target = await getCvDocumentById(cleanId);
  if (!target) {
    throw new Error("Document not found.");
  }

  if (target.storage_path) {
    await supabase.storage.from(CV_BUCKET_NAME).remove([target.storage_path]);
  }

  const { error } = await supabase.from("cv_documents").delete().eq("id", cleanId);
  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }

  revalidatePath("/cv");
  revalidatePath("/sitemap.xml");

  return true;
}
