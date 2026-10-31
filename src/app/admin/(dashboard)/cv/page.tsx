"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  X,
  Upload,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  CvDocumentRecord,
  DOCUMENT_CATEGORIES,
  DocumentCategory,
  getDocumentCategory,
  normalizeDocumentCategory,
} from "@/lib/cv-service";
import {
  ADMIN_DOC_EVENT,
  AdminDocEventDetail,
} from "@/components/admin/AdminSidebarShell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>("cv");
  const [documents, setDocuments] = useState<CvDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);

  // Upload form state (Title starts empty as requested so admin types it on upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Action states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<CvDocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CvDocumentRecord | null>(null);

  const categoryMeta = DOCUMENT_CATEGORIES[activeCategory];

  const loadDocuments = async () => {
    try {
      const res = await fetch("/api/admin/cv", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to load documents");
      }
      setDocuments(data.documents || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const nextCat = normalizeDocumentCategory(params.get("type"));
      setActiveCategory(nextCat);
      setErrorMsg(null);
      setSuccessMsg(null);
      setFileWarning(null);
      setPreviewDoc(null);
    };

    const handleDocEvent = (e: Event) => {
      const custom = e as CustomEvent<AdminDocEventDetail>;
      if (custom.detail?.category) {
        setActiveCategory(custom.detail.category);
        setErrorMsg(null);
        setSuccessMsg(null);
        setFileWarning(null);
        setPreviewDoc(null);
      }
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener(ADMIN_DOC_EVENT, handleDocEvent);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener(ADMIN_DOC_EVENT, handleDocEvent);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/cv", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to load documents");
        }
        if (isMounted) {
          setDocuments(data.documents || []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMsg(err instanceof Error ? err.message : "Unable to load documents");
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

  const categoryDocuments = useMemo(
    () => documents.filter((d) => getDocumentCategory(d) === activeCategory),
    [documents, activeCategory]
  );

  const activeDocument = useMemo(
    () => categoryDocuments.find((d) => d.is_published) || null,
    [categoryDocuments]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFileWarning(null);
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") {
      setFileWarning(
        "Only valid PDF files (.pdf, application/pdf) are allowed."
      );
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileWarning("File exceeds the 10 MB maximum size limit.");
      e.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileWarning("Please attach a PDF file (max 10 MB) before uploading.");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setFileWarning(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", activeCategory);
      formData.append("title", title.trim() || categoryMeta.defaultTitle);
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
        throw new Error(data.error || `Failed to upload ${categoryMeta.shortLabel} PDF`);
      }

      setSelectedFile(null);
      setTitle("");
      setVersionLabel("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMsg(
        publishImmediately
          ? `${categoryMeta.label} PDF uploaded and published.`
          : `${categoryMeta.label} PDF uploaded as a draft version.`
      );
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload document");
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
          ? `"${doc.file_name}" is now published as the active ${categoryMeta.label}.`
          : `"${doc.file_name}" has been unpublished.`
      );
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update status");
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
        throw new Error(data.error || "Failed to delete document");
      }

      if (previewDoc?.id === confirmDeleteDoc.id) {
        setPreviewDoc(null);
      }
      setConfirmDeleteDoc(null);
      setSuccessMsg(`${categoryMeta.label} document deleted permanently.`);
      await loadDocuments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const publicPreviewHref =
    activeCategory === "cv" ? "/cv" : `/cv?doc=${activeCategory}`;

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-gambarino text-3xl sm:text-4xl text-white font-normal tracking-tight uppercase">
            {categoryMeta.heading}
          </h1>
          <p className="font-mono-custom text-xs text-[#888] mt-1">
            Upload, replace, preview, or unpublish your official {categoryMeta.label} PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={publicPreviewHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", size: "default" })}
          >
            <span>View Public Page</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs font-mono-custom flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Active Status + Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Active Published Document Status */}
        <Card className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-custom text-xs uppercase tracking-wider text-[#888]">
                Active {categoryMeta.label} Status
              </span>
              {activeDocument ? (
                <Badge variant="success" className="px-2.5 py-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Published</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="px-2.5 py-1 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>No Active PDF</span>
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="w-7 h-7 text-white animate-spin mx-auto mb-3" aria-hidden="true" />
                <p className="font-mono-custom text-xs text-[#888]">Checking document status...</p>
              </div>
            ) : activeDocument ? (
              <div className="space-y-4 pt-2">
                <div>
                  <h2 className="font-sans text-lg sm:text-xl font-medium text-white flex items-start sm:items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                    <span className="min-w-0 break-words">{activeDocument.title}</span>
                  </h2>
                  <div className="font-mono-custom text-xs text-[#888] mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="break-all">
                      File: <span className="text-white/90">{activeDocument.file_name}</span>
                    </span>
                    {activeDocument.version_label && (
                      <span className="inline-flex items-center gap-1.5 text-[#999]">
                        <span aria-hidden="true">•</span>
                        <span>
                          Version: <span className="text-white/85">{activeDocument.version_label}</span>
                        </span>
                      </span>
                    )}
                  </div>
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
                      Download Filename
                    </span>
                    <span className="font-mono-custom text-xs text-emerald-300 mt-0.5 block truncate">
                      {categoryMeta.downloadFilename}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                    <span className="font-mono-custom text-[10px] uppercase text-[#777] block">
                      Last Updated
                    </span>
                    <span className="font-mono-custom text-xs text-white mt-0.5 block">
                      {formatDateTime(activeDocument.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <p className="font-sans text-sm text-white/90">
                  No {categoryMeta.label} PDF is currently published.
                </p>
                <p className="font-mono-custom text-xs text-[#888]">
                  Attach and upload a PDF on the right to publish it.
                </p>
              </div>
            )}
          </div>

          {activeDocument && (
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 pt-4 border-t border-white/10">
              <Button
                variant="default"
                onClick={() => setPreviewDoc(activeDocument)}
                className="col-span-2 sm:col-span-1 w-full sm:w-auto justify-center"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Preview Active PDF</span>
              </Button>
              <a
                href={`/api/cv/pdf?type=${activeCategory}&download=1`}
                download={categoryMeta.downloadFilename}
                className={buttonVariants({
                  variant: "secondary",
                  size: "default",
                  className: "w-full sm:w-auto justify-center",
                })}
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Download PDF</span>
              </a>
              <Button
                variant="warning"
                onClick={() => handleTogglePublish(activeDocument)}
                disabled={updatingId === activeDocument.id}
                className="w-full sm:w-auto justify-center"
              >
                {updatingId === activeDocument.id ? "Updating..." : "Unpublish"}
              </Button>
            </div>
          )}
        </Card>

        {/* Right 5 cols: Clean Upload / Replace Form */}
        <Card className="lg:col-span-5 p-4 sm:p-6">
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div>
              <h2 className="font-sans text-lg font-medium text-white">
                {activeDocument
                  ? `Replace or Upload New ${categoryMeta.shortLabel} PDF`
                  : `Upload Official ${categoryMeta.shortLabel} PDF`}
              </h2>
            </div>

            {fileWarning && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 text-amber-200 text-xs font-mono-custom flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{fileWarning}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="cv-file-input" className="text-[11px] mb-1.5">
                  PDF File *
                </Label>
                <input
                  id="cv-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-xs font-mono-custom text-[#aaa] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono-custom file:bg-white/10 file:text-white hover:file:bg-white/15 cursor-pointer bg-black/40 border border-white/10 rounded-xl p-2"
                />
                {selectedFile && (
                  <p className="font-mono-custom text-[11px] text-emerald-400 mt-1.5 break-all">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cv-title-input" className="text-[11px] mb-1.5">
                  Document Title
                </Label>
                <Input
                  id="cv-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. ${categoryMeta.defaultTitle}`}
                  className="px-3.5 py-2 h-9 bg-black/40 text-xs font-mono-custom"
                />
              </div>

              <div>
                <Label htmlFor="cv-version-input" className="text-[11px] mb-1.5">
                  Version Label (Optional)
                </Label>
                <Input
                  id="cv-version-input"
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. 2026 Creative-Tech Edition"
                  className="px-3.5 py-2 h-9 bg-black/40 text-xs font-mono-custom"
                />
              </div>

              <label
                htmlFor="cv-publish-immediately"
                className="flex items-center gap-2.5 cursor-pointer pt-1"
              >
                <Checkbox
                  id="cv-publish-immediately"
                  checked={publishImmediately}
                  onCheckedChange={setPublishImmediately}
                />
                <span className="font-mono-custom text-xs text-[#ccc]">
                  Publish immediately as active {categoryMeta.shortLabel}
                </span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full py-2.5 h-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Uploading PDF...</span>
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {publishImmediately
                      ? `Upload & Publish ${categoryMeta.shortLabel} PDF`
                      : "Upload as Draft Version"}
                  </span>
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Inline Admin PDF Preview Panel */}
      {previewDoc && (
        <Card className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono-custom text-[10px] uppercase tracking-wider text-emerald-400 block">
                Admin PDF Preview
              </span>
              <h3 className="font-sans text-base font-medium text-white break-words">
                {previewDoc.title}{" "}
                <span className="text-white/60 text-xs font-mono-custom break-all">
                  ({previewDoc.file_name})
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href={`/api/cv/pdf?id=${encodeURIComponent(previewDoc.id)}&preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  className: "w-full sm:w-auto justify-center",
                })}
              >
                <span>Open in New Tab</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewDoc(null)}
                className="w-full sm:w-auto justify-center text-[#aaa] hover:text-white"
              >
                <span>Close Preview</span>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="w-full h-[420px] sm:h-[640px] rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0e]">
            <iframe
              src={`/api/cv/pdf?id=${encodeURIComponent(previewDoc.id)}&preview=1#view=FitH`}
              title={`Preview ${previewDoc.title}`}
              className="w-full h-full border-0"
            />
          </div>
        </Card>
      )}

      {/* Version History & All Uploaded Records for Active Category */}
      <Card className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-sans text-base font-medium text-white">
              Uploaded {categoryMeta.shortLabel} Versions ({categoryDocuments.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center font-mono-custom text-xs text-[#888]">
            Loading versions...
          </div>
        ) : categoryDocuments.length === 0 ? (
          <div className="p-10 text-center font-mono-custom text-xs text-[#888]">
            No {categoryMeta.label} PDF files have been uploaded yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categoryDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-colors"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={doc.is_published ? "success" : "muted"}>
                      {doc.is_published ? "Active / Published" : "Archived / Draft"}
                    </Badge>
                    {doc.version_label && (
                      <Badge variant="info">
                        {doc.version_label}
                      </Badge>
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

                <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t border-white/5 sm:border-0 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewDoc(doc)}
                    className="w-full sm:w-auto justify-center px-2.5 sm:px-3"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Preview</span>
                  </Button>

                  <Button
                    variant={doc.is_published ? "warning" : "success"}
                    size="sm"
                    onClick={() => handleTogglePublish(doc)}
                    disabled={updatingId === doc.id}
                    className="w-full sm:w-auto justify-center px-2.5 sm:px-3"
                  >
                    {updatingId === doc.id
                      ? "Saving..."
                      : doc.is_published
                        ? "Unpublish"
                        : "Make Active"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmDeleteDoc(doc)}
                    className="w-full sm:w-auto justify-center px-2.5 sm:px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal via shadcn Dialog */}
      <Dialog
        open={Boolean(confirmDeleteDoc)}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteDoc(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {categoryMeta.shortLabel} PDF?</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">{confirmDeleteDoc?.file_name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteDoc(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructiveSolid"
              onClick={handleDeleteConfirm}
              disabled={Boolean(
                confirmDeleteDoc && deletingId === confirmDeleteDoc.id
              )}
            >
              {confirmDeleteDoc && deletingId === confirmDeleteDoc.id ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Confirm Delete</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
