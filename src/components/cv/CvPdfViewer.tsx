"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download, FileText, Loader2 } from "lucide-react";

export type ViewerDocumentCategory = "cv" | "resume" | "portfolio" | "cover-letter";

export interface PublishedDocumentItem {
  category: ViewerDocumentCategory;
  label: string;
  shortLabel: string;
  title: string;
  fileName: string;
  fileSize: number;
  versionLabel: string | null;
  updatedAtFormatted: string | null;
  downloadFilename: string;
  pdfUrl: string;
}

interface CvPdfViewerProps {
  hasPublishedPdf: boolean;
  title?: string;
  fileName?: string;
  fileSize?: number;
  versionLabel?: string | null;
  updatedAtFormatted?: string | null;
  publishedDocuments?: PublishedDocumentItem[];
  initialCategory?: ViewerDocumentCategory;
}

function formatFileSize(bytes?: number): string {
  if (!bytes || !Number.isFinite(bytes) || bytes <= 0) return "PDF Document";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CvPdfViewer({
  hasPublishedPdf,
  title = "Kamrul Islam — Curriculum Vitae",
  fileName = "Kamrul-Islam-CV.pdf",
  fileSize,
  versionLabel,
  updatedAtFormatted,
  publishedDocuments = [],
  initialCategory = "cv",
}: CvPdfViewerProps) {
  const defaultSelectedCategory: ViewerDocumentCategory =
    publishedDocuments.some((d) => d.category === initialCategory)
      ? initialCategory
      : publishedDocuments[0]?.category || "cv";

  const [selectedCategory, setSelectedCategory] = useState<ViewerDocumentCategory>(
    defaultSelectedCategory
  );
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [viewerError, setViewerError] = useState(false);

  const activeDoc: PublishedDocumentItem | null =
    publishedDocuments.find((d) => d.category === selectedCategory) ||
    publishedDocuments[0] ||
    (hasPublishedPdf
      ? {
          category: "cv",
          label: "Curriculum Vitae",
          shortLabel: "CV",
          title,
          fileName,
          fileSize: fileSize || 0,
          versionLabel: versionLabel || null,
          updatedAtFormatted: updatedAtFormatted || null,
          downloadFilename: "Kamrul-Islam-CV.pdf",
          pdfUrl: "/api/cv/pdf?type=cv",
        }
      : null);

  const handleSelectCategory = (category: ViewerDocumentCategory) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setViewerLoaded(false);
    setViewerError(false);
    if (typeof window !== "undefined") {
      const nextUrl = category === "cv" ? "/cv" : `/cv?doc=${category}`;
      window.history.replaceState(null, "", nextUrl);
    }
  };

  if (!hasPublishedPdf || !activeDoc) {
    return (
      <div className="w-full rounded-2xl bg-[#0e0e10] border border-white/10 p-6 sm:p-10 md:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/10 text-[#bbb] font-mono-custom text-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Interactive HTML Dossier Active • PDF Edition Ready for Request</span>
          </div>

          <h2 className="font-gambarino text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
            Official Curriculum Vitae Overview
          </h2>

          <p className="font-mono-custom text-xs sm:text-sm text-[#a1a1a1] leading-relaxed">
            The complete, verified curriculum vitae of Kamrul Islam is presented in structured format below—covering Video Editing &amp; Post-Production, AI-Assisted Content Creation, Web Development, IT Infrastructure, employment history, and academic credentials. For a tailored PDF copy or role-specific dossier, reach out directly.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:hello@kamrulislam.me?subject=Request%20for%20Official%20CV%20PDF%20%E2%80%94%20Kamrul%20Islam"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
            >
              <span>Request PDF Copy via Email</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
            >
              <span>Contact &amp; Inquiries</span>
            </Link>

            <a
              href="#cv-summary"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[#aaa] hover:text-white font-mono-custom text-xs uppercase tracking-wider transition-colors"
            >
              <span>Read Full CV Below</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const downloadUrl = `${activeDoc.pdfUrl}${activeDoc.pdfUrl.includes("?") ? "&" : "?"}download=1`;

  return (
    <div className="w-full rounded-2xl bg-[#0e0e10] border border-white/10 overflow-hidden shadow-2xl">
      {/* Multi-Document Switcher Tabs (shown when more than 1 document category is published) */}
      {publishedDocuments.length > 1 && (
        <div className="px-4 sm:px-6 py-3 bg-[#101012] border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <span className="font-mono-custom text-[11px] uppercase tracking-widest text-[#777]">
            Official Documents
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {publishedDocuments.map((docItem) => {
              const isSelected = docItem.category === activeDoc.category;
              return (
                <button
                  key={docItem.category}
                  type="button"
                  onClick={() => handleSelectCategory(docItem.category)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-mono-custom text-[11px] sm:text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-medium shadow-sm"
                      : "bg-white/5 hover:bg-white/10 text-[#aaa] hover:text-white border border-white/10"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{docItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Viewer Toolbar */}
      <div className="px-4 sm:px-6 py-4 bg-[#141416] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-custom text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Official {activeDoc.shortLabel} PDF
          </span>
          <span className="font-mono-custom text-xs text-white font-medium truncate max-w-full">
            {activeDoc.downloadFilename}
          </span>
          <span className="font-mono-custom text-xs text-[#777]">
            • {formatFileSize(activeDoc.fileSize)}
          </span>
          {activeDoc.versionLabel && (
            <span className="font-mono-custom text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#aaa]">
              {activeDoc.versionLabel}
            </span>
          )}
          {activeDoc.updatedAtFormatted && (
            <span className="font-mono-custom text-xs text-[#777] hidden md:inline">
              • Updated {activeDoc.updatedAtFormatted}
            </span>
          )}
        </div>

        <div className="hidden md:flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={activeDoc.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
          >
            <span>Open PDF in New Tab</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <a
            href={downloadUrl}
            download={activeDoc.downloadFilename}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
          >
            <span>Download {activeDoc.shortLabel}</span>
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Mobile / Touch Browser Notice + Direct Actions */}
      <div className="md:hidden p-4 sm:p-5 bg-[#111113] border-b border-white/10 space-y-3">
        <p className="font-mono-custom text-xs text-[#aaa] leading-relaxed">
          Some mobile browsers limit multi-page inline PDF scrolling. For the best reading experience on mobile, open the full PDF directly or download a copy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href={downloadUrl}
            download={activeDoc.downloadFilename}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-mono-custom text-xs uppercase tracking-wider font-medium"
          >
            <span>Download {activeDoc.shortLabel} (PDF)</span>
            <Download className="h-3.5 w-3.5 shrink-0" />
          </a>
          <a
            href={activeDoc.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10"
          >
            <span>Open Full Screen</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        </div>
      </div>

      {/* Embedded Responsive PDF Canvas */}
      {viewerError ? (
        <div className="p-8 sm:p-12 text-center space-y-4 bg-[#0b0b0d]">
          <p className="font-sans text-base text-white">
            Inline PDF preview is unavailable in your current browser configuration.
          </p>
          <p className="font-mono-custom text-xs text-[#888] max-w-md mx-auto">
            You can download the official PDF directly or open it in a dedicated browser tab.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={downloadUrl}
              download={activeDoc.downloadFilename}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono-custom text-xs uppercase tracking-wider font-medium"
            >
              <span>Download {activeDoc.downloadFilename}</span>
              <Download className="h-3.5 w-3.5" />
            </a>
            <a
              href={activeDoc.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/10 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10"
            >
              <span>Open PDF in New Tab</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[520px] sm:h-[680px] lg:h-[860px] bg-[#0b0b0d]">
          {!viewerLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b0d] z-10 pointer-events-none">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <span className="font-mono-custom text-xs text-[#888] uppercase tracking-wider">
                Loading {activeDoc.title}...
              </span>
            </div>
          )}

          <iframe
            key={activeDoc.category}
            src={`${activeDoc.pdfUrl}#view=FitH`}
            title={activeDoc.title}
            onLoad={() => setViewerLoaded(true)}
            onError={() => setViewerError(true)}
            className="w-full h-full border-0"
          />
        </div>
      )}
    </div>
  );
}
