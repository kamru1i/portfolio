import { createClient } from "./supabase/server";
import { Database } from "@/types/database";
import { revalidatePath } from "next/cache";

export type CvDocumentRecord = Database["public"]["Tables"]["cv_documents"]["Row"];
export type CvDocumentInsert = Database["public"]["Tables"]["cv_documents"]["Insert"];
export type CvDocumentUpdate = Database["public"]["Tables"]["cv_documents"]["Update"];

export const CV_BUCKET_NAME = "cv-documents";
export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const PUBLIC_CV_DOWNLOAD_FILENAME = "Kamrul-Islam-CV.pdf";

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
 * Retrieves the currently published CV document for the public /cv page.
 * Returns null safely if no CV is published or if the database is unreachable.
 */
export async function getPublishedCvDocument(): Promise<CvDocumentRecord | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("cv_documents")
      .select("*")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as CvDocumentRecord;
  } catch {
    return null;
  }
}

/**
 * Retrieves all CV records (published and archived/unpublished) for the Admin Dashboard.
 */
export async function getAllCvDocumentsForAdmin(): Promise<CvDocumentRecord[]> {
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
    throw new Error(`Failed to fetch CV documents: ${error.message}`);
  }

  return (data as CvDocumentRecord[]) || [];
}

/**
 * Retrieves a single CV record by ID (used by admin routes or preview).
 */
export async function getCvDocumentById(id: string): Promise<CvDocumentRecord | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("cv_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as CvDocumentRecord;
}

/**
 * Downloads the raw PDF Blob from the controlled cv-documents bucket for a given storage path.
 */
export async function downloadCvStorageBlob(storagePath: string): Promise<Blob | null> {
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
 * Uploads a new PDF CV to Supabase Storage and safely updates public.cv_documents.
 * Guarantees atomic replacement semantics:
 * 1. Uploads binary to storage first under a unique timestamped key.
 * 2. Only demotes the previously active CV after the new binary is verified in storage.
 * 3. Rolls back storage upload and restores previous active state if database insert fails.
 */
export async function uploadAndReplaceCvDocument(params: {
  file: File;
  title?: string;
  versionLabel?: string | null;
  publishImmediately?: boolean;
  uploadedBy: string;
}): Promise<CvDocumentRecord> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { buffer, sanitizedFileName, fileSize } = await validateAndReadPdfBuffer(params.file);
  const publishImmediately = params.publishImmediately !== false;
  const nowIso = new Date().toISOString();
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const storagePath = `cv/${uniquePrefix}-${sanitizedFileName.toLowerCase()}`;

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

  // Keep reference to currently published CV in case we need to roll back
  let previousPublishedId: string | null = null;
  if (publishImmediately) {
    const { data: currentActive } = await supabase
      .from("cv_documents")
      .select("id")
      .eq("is_published", true)
      .maybeSingle();

    if (currentActive?.id) {
      previousPublishedId = currentActive.id;
      const { error: demoteError } = await supabase
        .from("cv_documents")
        .update({ is_published: false })
        .eq("id", previousPublishedId);

      if (demoteError) {
        // Clean up uploaded file before aborting
        await supabase.storage.from(CV_BUCKET_NAME).remove([storagePath]);
        throw new Error(`Failed to transition existing active CV: ${demoteError.message}`);
      }
    }
  }

  // Step 2: Insert new CV metadata record
  const cleanTitle = (params.title || "Kamrul Islam — Curriculum Vitae").trim().slice(0, 140);
  const cleanVersion = params.versionLabel ? params.versionLabel.trim().slice(0, 60) : null;

  const insertPayload: CvDocumentInsert = {
    title: cleanTitle || "Kamrul Islam — Curriculum Vitae",
    file_name: sanitizedFileName,
    storage_path: storagePath,
    file_url: "/api/cv/pdf",
    file_size: fileSize,
    mime_type: "application/pdf",
    version_label: cleanVersion,
    is_published: publishImmediately,
    published_at: publishImmediately ? nowIso : null,
    uploaded_by: params.uploadedBy,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("cv_documents")
    .insert(insertPayload)
    .select("*")
    .single();

  if (insertError || !inserted) {
    // Roll back storage upload and restore previous active CV if applicable
    await supabase.storage.from(CV_BUCKET_NAME).remove([storagePath]);
    if (previousPublishedId) {
      await supabase
        .from("cv_documents")
        .update({ is_published: true })
        .eq("id", previousPublishedId);
    }
    throw new Error(`Failed to save CV metadata: ${insertError?.message || "Unknown database error"}`);
  }

  // Step 3: Clean up older archived CV versions beyond the 3 most recent inactive records
  try {
    const { data: inactiveRows } = await supabase
      .from("cv_documents")
      .select("id, storage_path")
      .eq("is_published", false)
      .order("updated_at", { ascending: false });

    if (inactiveRows && inactiveRows.length > 3) {
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

  return inserted as CvDocumentRecord;
}

/**
 * Publishes or unpublishes a specific CV document, ensuring at most one CV is active.
 */
export async function updateCvDocumentState(
  id: string,
  updates: {
    is_published?: boolean;
    title?: string;
    version_label?: string | null;
  }
): Promise<CvDocumentRecord> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const target = await getCvDocumentById(id);
  if (!target) {
    throw new Error("CV document not found.");
  }

  if (updates.is_published === true && !target.is_published) {
    // Demote any other currently published CV first
    await supabase
      .from("cv_documents")
      .update({ is_published: false })
      .neq("id", id)
      .eq("is_published", true);
  }

  const updatePayload: CvDocumentUpdate = {};
  if (updates.is_published !== undefined) {
    updatePayload.is_published = updates.is_published;
    updatePayload.published_at = updates.is_published
      ? target.published_at || new Date().toISOString()
      : target.published_at;
  }
  if (updates.title !== undefined) {
    updatePayload.title = updates.title.trim().slice(0, 140) || "Kamrul Islam — Curriculum Vitae";
  }
  if (updates.version_label !== undefined) {
    updatePayload.version_label = updates.version_label ? updates.version_label.trim().slice(0, 60) : null;
  }

  const { data, error } = await supabase
    .from("cv_documents")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(`Failed to update CV document: ${error?.message || "Unknown error"}`);
  }

  revalidatePath("/cv");
  revalidatePath("/sitemap.xml");

  return data as CvDocumentRecord;
}

/**
 * Deletes a CV document and its underlying PDF file in Supabase Storage.
 */
export async function deleteCvDocument(id: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const target = await getCvDocumentById(id);
  if (!target) {
    throw new Error("CV document not found.");
  }

  if (target.storage_path) {
    await supabase.storage.from(CV_BUCKET_NAME).remove([target.storage_path]);
  }

  const { error } = await supabase.from("cv_documents").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete CV document: ${error.message}`);
  }

  revalidatePath("/cv");
  revalidatePath("/sitemap.xml");

  return true;
}
