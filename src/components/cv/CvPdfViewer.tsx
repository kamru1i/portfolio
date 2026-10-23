"use client";

import { useState } from "react";
import Link from "next/link";

interface CvPdfViewerProps {
  hasPublishedPdf: boolean;
  title?: string;
  fileName?: string;
  fileSize?: number;
  versionLabel?: string | null;
  updatedAtFormatted?: string | null;
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
  fileSize,
  versionLabel,
  updatedAtFormatted,
}: CvPdfViewerProps) {
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [viewerError, setViewerError] = useState(false);

  if (!hasPublishedPdf) {
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
              <span>↗</span>
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
              <span>Read Full CV Below ↓</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-[#0e0e10] border border-white/10 overflow-hidden shadow-2xl">
      {/* Top Viewer Toolbar */}
      <div className="px-4 sm:px-6 py-4 bg-[#141416] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-custom text-[11px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Official PDF
          </span>
          <span className="font-mono-custom text-xs text-white font-medium truncate">
            Kamrul-Islam-CV.pdf
          </span>
          <span className="font-mono-custom text-xs text-[#777]">
            • {formatFileSize(fileSize)}
          </span>
          {versionLabel && (
            <span className="font-mono-custom text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#aaa]">
              {versionLabel}
            </span>
          )}
          {updatedAtFormatted && (
            <span className="font-mono-custom text-xs text-[#777] hidden md:inline">
              • Updated {updatedAtFormatted}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/api/cv/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
          >
            <span>Open PDF in New Tab</span>
            <span>↗</span>
          </a>

          <a
            href="/api/cv/pdf?download=1"
            download="Kamrul-Islam-CV.pdf"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
          >
            <span>Download CV</span>
            <span>↓</span>
          </a>
        </div>
      </div>

      {/* Mobile / Touch Browser Notice + Direct Actions */}
      <div className="md:hidden p-5 bg-[#111113] border-b border-white/10 space-y-3">
        <p className="font-mono-custom text-xs text-[#aaa] leading-relaxed">
          Some mobile browsers limit multi-page inline PDF scrolling. For the best reading experience on mobile, open the full PDF directly or download a copy.
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/cv/pdf?download=1"
            download="Kamrul-Islam-CV.pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-mono-custom text-xs uppercase tracking-wider font-medium"
          >
            <span>Download CV (PDF) ↓</span>
          </a>
          <a
            href="/api/cv/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10"
          >
            <span>Open Full Screen ↗</span>
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
              href="/api/cv/pdf?download=1"
              download="Kamrul-Islam-CV.pdf"
              className="px-5 py-2.5 rounded-full bg-white text-black font-mono-custom text-xs uppercase tracking-wider font-medium"
            >
              Download Kamrul-Islam-CV.pdf ↓
            </a>
            <a
              href="/api/cv/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-white/10 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10"
            >
              Open PDF in New Tab ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[520px] sm:h-[680px] lg:h-[860px] bg-[#0b0b0d]">
          {!viewerLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0b0d] z-10 pointer-events-none">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <span className="font-mono-custom text-xs text-[#888] uppercase tracking-wider">
                Loading {title}...
              </span>
            </div>
          )}

          <iframe
            src="/api/cv/pdf#view=FitH"
            title={title}
            onLoad={() => setViewerLoaded(true)}
            onError={() => setViewerError(true)}
            className="w-full h-full border-0"
          />
        </div>
      )}
    </div>
  );
}
