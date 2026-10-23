"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CvDocumentRecord } from "@/lib/cv-service";

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminCvManagementPage() {
  const [documents, setDocuments] = useState<CvDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("Kamrul Islam — Curriculum Vitae");
  const [versionLabel, setVersionLabel] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Action states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<CvDocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CvDocumentRecord | null>(null);

  const loadDocuments = async () => {
    try {
      const res = await fetch("/api/admin/cv", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to load CV documents");
      }
      setDocuments(data.documents || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to load CV documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/cv", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to load CV documents");
        }
        if (isMounted) {
          setDocuments(data.documents || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to load CV documents");
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

  const activeDocument = documents.find((d) => d.is_published) || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") {
      setErrorMsg("Only PDF files (.pdf, application/pdf) are allowed.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File exceeds the 10 MB maximum size limit.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please choose a PDF file to upload.");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title.trim() || "Kamrul Islam — Curriculum Vitae");
      if (versionLabel.trim()) {
        formData.append("versionLabel", versionLabel.trim());
      }
      formData.append("publishImmediately", String(publishImmediately));

      const res = await fetch("/api/admin/cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload CV PDF");
      }

      setSelectedFile(null);
      setVersionLabel("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMsg(
        publishImmediately
          ? "CV PDF uploaded and published live on /cv."
          : "CV PDF uploaded as a draft version."
      );
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleTogglePublish = async (doc: CvDocumentRecord) => {
    try {
      setUpdatingId(doc.id);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/cv", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: doc.id,
          is_published: !doc.is_published,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to update publish status");
      }

      setSuccessMsg(
        !doc.is_published
          ? `"${doc.file_name}" is now published as the active CV on /cv.`
          : `"${doc.file_name}" has been unpublished from /cv.`
      );
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update CV status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteDoc) return;
    try {
      setDeletingId(confirmDeleteDoc.id);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/admin/cv?id=${encodeURIComponent(confirmDeleteDoc.id)}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete CV document");
      }

      if (previewDoc?.id === confirmDeleteDoc.id) {
        setPreviewDoc(null);
      }
      setConfirmDeleteDoc(null);
      setSuccessMsg("CV document and storage file deleted permanently.");
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete CV");
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
            <span className="text-white">CV Management</span>
          </div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            Curriculum Vitae (PDF)
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            Upload, replace, preview, or unpublish the official PDF Curriculum Vitae served on <code className="text-white/90">/cv</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/cv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-all"
          >
            <span>View Public /cv Page</span>
            <span>↗</span>
          </Link>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs font-mono-custom">
          {successMsg}
        </div>
      )}

      {/* Main Grid: Active Status + Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Active Published CV Status */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#141416] border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-custom text-xs uppercase tracking-wider text-[#888]">
                Active Public CV Status
              </span>
              {activeDocument ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 font-mono-custom text-[11px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Published on /cv
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/50 border border-amber-800/50 text-amber-300 font-mono-custom text-[11px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  No Active PDF (HTML Summary Mode)
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-3" />
                <p className="font-mono-custom text-xs text-[#888]">Checking CV status...</p>
              </div>
            ) : activeDocument ? (
              <div className="space-y-4 pt-2">
                <div>
                  <h2 className="font-sans text-xl font-medium text-white">
                    {activeDocument.title}
                  </h2>
                  <p className="font-mono-custom text-xs text-[#888] mt-1 break-all">
                    File: <span className="text-white/90">{activeDocument.file_name}</span>
                    {activeDocument.version_label ? ` • Version: ${activeDocument.version_label}` : ""}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-mono-custom text-[10px] uppercase text-[#777] block">
                      File Size
                    </span>
                    <span className="font-mono-custom text-xs text-white mt-0.5 block">
                      {formatFileSize(activeDocument.file_size)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="font-mono-custom text-[10px] uppercase text-[#777] block">
                      Last Updated
                    </span>
                    <span className="font-mono-custom text-xs text-white mt-0.5 block">
                      {formatDateTime(activeDocument.updated_at)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="font-mono-custom text-[10px] uppercase text-[#777] block">
                      Download Filename
                    </span>
                    <span className="font-mono-custom text-xs text-emerald-300 mt-0.5 block truncate">
                      Kamrul-Islam-CV.pdf
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <p className="font-sans text-sm text-white/90">
                  No PDF file is currently published.
                </p>
                <p className="font-mono-custom text-xs text-[#888] leading-relaxed">
                  Visitors on <code className="text-white/80">/cv</code> currently see the structured HTML Curriculum Vitae overview and direct contact options without a broken embed. Upload a sanitized PDF on the right to enable inline PDF viewing and one-click download.
                </p>
              </div>
            )}
          </div>

          {activeDocument && (
            <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDoc(activeDocument)}
                className="px-4 py-2 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-colors"
              >
                Preview Active PDF
              </button>
              <a
                href="/api/cv/pdf?download=1"
                download="Kamrul-Islam-CV.pdf"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono-custom text-xs border border-white/10 transition-colors"
              >
                Download PDF
              </a>
              <button
                type="button"
                onClick={() => handleTogglePublish(activeDocument)}
                disabled={updatingId === activeDocument.id}
                className="px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 font-mono-custom text-xs border border-amber-800/40 transition-colors disabled:opacity-50"
              >
                {updatingId === activeDocument.id ? "Updating..." : "Unpublish"}
              </button>
            </div>
          )}
        </div>

        {/* Right 5 cols: Upload / Replace Form */}
        <form
          onSubmit={handleUploadSubmit}
          className="lg:col-span-5 p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-5"
        >
          <div>
            <h2 className="font-sans text-lg font-medium text-white">
              {activeDocument ? "Replace or Upload New CV PDF" : "Upload Official CV PDF"}
            </h2>
            <p className="font-mono-custom text-xs text-[#888] mt-1">
              Strict PDF validation: <code className="text-white/80">.pdf</code> extension, <code className="text-white/80">application/pdf</code> MIME, <code className="text-white/80">%PDF-</code> binary signature, max 10 MB.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-mono-custom text-[11px] uppercase tracking-wider text-[#aaa] mb-1.5">
                PDF File *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full text-xs font-mono-custom text-[#aaa] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono-custom file:bg-white/10 file:text-white hover:file:bg-white/15 cursor-pointer bg-black/40 border border-white/10 rounded-xl p-2"
              />
              {selectedFile && (
                <p className="font-mono-custom text-[11px] text-emerald-400 mt-1.5">
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cv-title-input"
                className="block font-mono-custom text-[11px] uppercase tracking-wider text-[#aaa] mb-1.5"
              >
                Document Title
              </label>
              <input
                id="cv-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Kamrul Islam — Curriculum Vitae"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono-custom focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label
                htmlFor="cv-version-input"
                className="block font-mono-custom text-[11px] uppercase tracking-wider text-[#aaa] mb-1.5"
              >
                Version Label (Optional)
              </label>
              <input
                id="cv-version-input"
                type="text"
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                placeholder="e.g. 2026 Creative-Tech Edition"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono-custom focus:outline-none focus:border-white/30"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="mt-0.5 rounded border-white/20 bg-black/40"
              />
              <span className="font-mono-custom text-xs text-[#ccc] leading-relaxed">
                Publish immediately as active CV (cleanly supersedes any currently published PDF)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full py-2.5 px-5 rounded-xl bg-white text-black font-sans font-medium text-xs hover:bg-neutral-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {uploading
              ? "Validating & Uploading PDF..."
              : publishImmediately
                ? "Upload & Publish CV PDF"
                : "Upload as Draft Version"}
          </button>
        </form>
      </div>

      {/* Inline Admin PDF Preview Panel */}
      {previewDoc && (
        <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-mono-custom text-[10px] uppercase tracking-wider text-emerald-400 block">
                Admin PDF Preview
              </span>
              <h3 className="font-sans text-base font-medium text-white">
                {previewDoc.title} ({previewDoc.file_name})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/cv/pdf?id=${encodeURIComponent(previewDoc.id)}&preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono-custom text-xs border border-white/10 transition-colors"
              >
                Open in New Tab ↗
              </a>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#aaa] hover:text-white font-mono-custom text-xs border border-white/10 transition-colors"
              >
                Close Preview ✕
              </button>
            </div>
          </div>

          <div className="w-full h-[640px] rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0e]">
            <iframe
              src={`/api/cv/pdf?id=${encodeURIComponent(previewDoc.id)}&preview=1#view=FitH`}
              title={`Preview ${previewDoc.title}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Version History & All Uploaded CV Records */}
      <div className="rounded-2xl bg-[#141416] border border-white/10 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-base font-medium text-white">
              Uploaded CV Versions ({documents.length})
            </h2>
            <p className="font-mono-custom text-xs text-[#888] mt-0.5">
              Only one CV version can be published at a time. Older inactive versions are automatically pruned beyond the 3 most recent backups.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center font-mono-custom text-xs text-[#888]">
            Loading versions...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-10 text-center font-mono-custom text-xs text-[#888]">
            No CV PDF files have been uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full border ${
                        doc.is_published
                          ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/50"
                          : "bg-white/5 text-[#888] border-white/10"
                      }`}
                    >
                      {doc.is_published ? "Active / Published" : "Archived / Draft"}
                    </span>
                    {doc.version_label && (
                      <span className="font-mono-custom text-[10px] uppercase px-2 py-0.5 rounded-full bg-sky-950/40 text-sky-300 border border-sky-800/40">
                        {doc.version_label}
                      </span>
                    )}
                    <span className="font-mono-custom text-xs text-[#777]">
                      {formatFileSize(doc.file_size)} • Updated {formatDateTime(doc.updated_at)}
                    </span>
                  </div>
                  <h3 className="font-sans text-sm font-medium text-white truncate">
                    {doc.title}
                  </h3>
                  <p className="font-mono-custom text-xs text-[#777] truncate">
                    {doc.file_name}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
                  >
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(doc)}
                    disabled={updatingId === doc.id}
                    className={`px-3 py-1.5 rounded-lg font-mono-custom text-xs border transition-colors ${
                      doc.is_published
                        ? "bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-800/40"
                        : "bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-800/40"
                    }`}
                  >
                    {updatingId === doc.id
                      ? "Saving..."
                      : doc.is_published
                        ? "Unpublish"
                        : "Make Active"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfirmDeleteDoc(doc)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-300 font-mono-custom text-xs border border-red-800/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#161618] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-sans font-medium text-lg text-white">
              Delete CV PDF?
            </h3>
            <p className="font-mono-custom text-xs text-[#aaa] leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">{confirmDeleteDoc.file_name}</strong>?
              {confirmDeleteDoc.is_published && (
                <span className="block mt-2 text-amber-300">
                  Warning: This is currently the active published CV on /cv. Deleting it will revert /cv to the HTML summary state until another PDF is published.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setConfirmDeleteDoc(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-custom text-xs border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deletingId === confirmDeleteDoc.id}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-custom text-xs font-medium transition-colors disabled:opacity-50"
              >
                {deletingId === confirmDeleteDoc.id ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
