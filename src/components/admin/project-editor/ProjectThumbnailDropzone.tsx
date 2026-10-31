"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Loader2,
  Trash2,
  ClipboardPaste,
  RotateCcw,
  ImagePlus,
  Eye,
  X,
} from "lucide-react";
import { optimizeImageBeforeUpload } from "@/lib/image-optimizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ProjectThumbnailDropzoneProps {
  targetType: "video" | "web";
  label: string;
  imageUrl: string;
  fallbackPreviewUrl?: string | null;
  autoDetectedUrl?: string | null;
  isCustomOverride?: boolean;
  onImageUploaded: (url: string) => void;
  onRemoveImage: () => void;
  onRestoreAutoImage?: () => void;
  onUploadError: (error: string | null) => void;
}

export function ProjectThumbnailDropzone({
  targetType,
  label,
  imageUrl,
  fallbackPreviewUrl,
  autoDetectedUrl,
  isCustomOverride,
  onImageUploaded,
  onRemoveImage,
  onRestoreAutoImage,
  onUploadError,
}: ProjectThumbnailDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [optimizedLabel, setOptimizedLabel] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isVideo = targetType === "video";
  const displayPreviewUrl = imageUrl || fallbackPreviewUrl || "";

  const handleProcessAndUpload = useCallback(
    async (rawFile: File) => {
      setUploading(true);
      onUploadError(null);
      try {
        const prefix = isVideo ? "video-thumbnail" : "web-screenshot";
        const optimized = await optimizeImageBeforeUpload(rawFile, prefix);

        const formData = new FormData();
        formData.append("file", optimized.file);
        formData.append("folder", targetType);

        const res = await fetch("/api/admin/upload-screenshot", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error ||
              (isVideo
                ? "Failed to upload video thumbnail"
                : "Failed to upload screenshot")
          );
        }

        if (data.url) {
          onImageUploaded(data.url);
          const kb = Math.max(1, Math.round(optimized.optimizedBytes / 1024));
          setOptimizedLabel(
            optimized.width > 0
              ? `WebP • ${kb} KB`
              : `${kb} KB`
          );
        }
      } catch (err: unknown) {
        onUploadError(
          err instanceof Error ? err.message : "Failed to upload image"
        );
      } finally {
        setUploading(false);
      }
    },
    [isVideo, onImageUploaded, onUploadError, targetType]
  );

  // Global Clipboard Paste listener (Ctrl+V / Win+V image paste anywhere on the form)
  useEffect(() => {
    const onWindowPaste = (e: ClipboardEvent) => {
      if (uploading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            const ext = item.type.split("/")[1] || "png";
            const fileName = `${isVideo ? "video-thumbnail" : "web-screenshot"}-${Date.now()}.${ext}`;
            const imageFile = new File([blob], fileName, { type: item.type });
            void handleProcessAndUpload(imageFile);
            return;
          }
        }
      }
    };

    window.addEventListener("paste", onWindowPaste);
    return () => window.removeEventListener("paste", onWindowPaste);
  }, [handleProcessAndUpload, isVideo, uploading]);

  const handleClipboardButtonPaste = async () => {
    onUploadError(null);
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error(
          "Press Ctrl+V (or Win+V) directly on the page to paste your copied image."
        );
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const ext = imageType.split("/")[1] || "png";
          const fileName = `${isVideo ? "video-thumbnail" : "web-screenshot"}-${Date.now()}.${ext}`;
          const file = new File([blob], fileName, { type: imageType });
          await handleProcessAndUpload(file);
          return;
        }
      }
      throw new Error(
        "No copied image found in clipboard. Copy an image first, then press Ctrl+V or click Paste."
      );
    } catch (err: unknown) {
      onUploadError(
        err instanceof Error
          ? err.message
          : "Press Ctrl+V (or Win+V) directly on the page to paste your copied image."
      );
    }
  };

  const handleDropImage = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (uploading) return;

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        onUploadError("Please drop a valid image file (PNG, JPG, WebP, or AVIF).");
        return;
      }
      void handleProcessAndUpload(file);
    }
  };

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-1.5">
        <Label>{label}</Label>
        <div className="flex items-center gap-1.5">
          {optimizedLabel && imageUrl && (
            <span className="font-mono-custom text-[9px] text-emerald-400">
              {optimizedLabel}
            </span>
          )}
          {imageUrl && (
            <Badge
              variant={
                isVideo ? (isCustomOverride ? "success" : "info") : "success"
              }
              className="text-[9px] px-1.5 py-0"
            >
              {isVideo ? (isCustomOverride ? "Custom" : "Auto") : "Ready"}
            </Badge>
          )}
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDraggingOver) setIsDraggingOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingOver(false);
        }}
        onDrop={handleDropImage}
        className={`min-h-11 h-auto py-2 sm:py-0 sm:h-11 px-3 rounded-xl border border-dashed transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 ${
          isDraggingOver
            ? isVideo
              ? "bg-sky-500/10 border-sky-400 ring-2 ring-sky-400/25"
              : "bg-purple-500/10 border-purple-400 ring-2 ring-purple-400/25"
            : "bg-[#18181b] border-white/20 hover:border-white/40"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {displayPreviewUrl ? (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              title="Click to preview attached image"
              className="group/thumb relative w-12 h-8 rounded overflow-hidden bg-black shrink-0 border border-white/20 hover:border-white/60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Image
                src={displayPreviewUrl}
                alt="Uploaded preview"
                fill
                unoptimized
                className="object-cover object-top"
              />
              <span className="absolute inset-0 bg-black/55 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                <Eye className="h-3.5 w-3.5 text-white" aria-hidden="true" />
              </span>
            </button>
          ) : (
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                isVideo
                  ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                  : "bg-purple-500/10 border-purple-500/20 text-purple-400"
              }`}
            >
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            {displayPreviewUrl && !isDraggingOver ? (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="font-mono-custom text-[10px] text-[#bbb] hover:text-white truncate block text-left cursor-pointer transition-colors"
                title="Click to preview attached image"
              >
                Click thumbnail to preview
              </button>
            ) : (
              <p className="font-mono-custom text-[10px] text-[#aaa] truncate">
                {isDraggingOver
                  ? "Drop Image Here"
                  : "Drop, Paste (Ctrl+V), or Upload"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {autoDetectedUrl &&
            imageUrl !== autoDetectedUrl &&
            onRestoreAutoImage && (
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={() => {
                  setOptimizedLabel(null);
                  onRestoreAutoImage();
                }}
                title="Restore Auto-Detected Thumbnail"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>Auto</span>
              </Button>
            )}

          <Button
            type="button"
            variant="secondary"
            size="xs"
            disabled={uploading}
            onClick={handleClipboardButtonPaste}
            title="Paste copied image from clipboard (Ctrl+V)"
          >
            <ClipboardPaste className="h-3 w-3" aria-hidden="true" />
            <span>Paste</span>
          </Button>

          <label className="px-2.5 py-1 rounded-lg bg-white text-black hover:bg-neutral-200 font-sans font-medium text-xs cursor-pointer transition-all flex items-center gap-1 shrink-0 shadow-xs">
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="h-3 w-3" aria-hidden="true" />
            )}
            <span>{uploading ? "..." : "Upload"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void handleProcessAndUpload(file);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
          </label>

          {imageUrl && (
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={() => {
                setOptimizedLabel(null);
                onRemoveImage();
              }}
              title="Remove Image"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Full-Size Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-5xl p-0 overflow-hidden bg-[#121215] border-white/15"
        >
          {/* Preview Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-[#18181b]">
            <div className="flex items-center gap-2.5 min-w-0">
              <DialogTitle className="text-sm font-medium text-white truncate">
                {isVideo ? "Video Thumbnail Preview" : "Homepage Screenshot Preview"}
              </DialogTitle>
              {optimizedLabel && (
                <Badge variant="success" className="text-[10px]">
                  {optimizedLabel}
                </Badge>
              )}
            </div>

            <DialogClose
              aria-label="Close preview"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/12 text-[#999] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </DialogClose>
          </div>

          {/* Preview Image Stage */}
          <div className="relative w-full aspect-video max-h-[75dvh] bg-[#090a0d] flex items-center justify-center overflow-hidden">
            {displayPreviewUrl && (
              /* eslint-disable-next-line @next/next/no-img-element -- Full attached preview inside admin modal */
              <img
                src={displayPreviewUrl}
                alt="Attached project preview"
                className="w-full h-full object-contain block"
              />
            )}
          </div>

          {/* Preview Modal Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3 border-t border-white/10 bg-[#161619]">
            <span className="font-mono-custom text-[11px] text-[#888]">
              Full 16:9 preview — Close this dialog when ready to save the project.
            </span>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto justify-center"
                />
              }
            >
              Close Preview
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
