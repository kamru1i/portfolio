"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import {
  DOCUMENT_CATEGORIES,
  normalizeDocumentCategory,
} from "@/lib/document-categories";
import type { PublishedDocumentItem } from "./CvPdfViewer";

function resolveActiveDocItem(
  publishedDocuments: PublishedDocumentItem[],
  docParam: string | null
): PublishedDocumentItem | null {
  if (publishedDocuments.length === 0) return null;
  const requested = normalizeDocumentCategory(docParam);
  return (
    publishedDocuments.find((d) => d.category === requested) ||
    publishedDocuments.find((d) => d.category === "cv") ||
    publishedDocuments[0] ||
    null
  );
}

export function CvUpdatedBadge({
  publishedDocuments,
}: {
  publishedDocuments: PublishedDocumentItem[];
}) {
  const searchParams = useSearchParams();
  const docParam = searchParams.get("doc") || searchParams.get("type");
  const activeDoc = resolveActiveDocItem(publishedDocuments, docParam);

  if (!activeDoc?.updatedAtFormatted) {
    return null;
  }

  return (
    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#888] text-xs font-mono-custom">
      Updated {activeDoc.updatedAtFormatted}
    </div>
  );
}

export function CvHeaderActions({
  publishedDocuments,
}: {
  publishedDocuments: PublishedDocumentItem[];
}) {
  const searchParams = useSearchParams();
  const docParam = searchParams.get("doc") || searchParams.get("type");
  const activeDoc = resolveActiveDocItem(publishedDocuments, docParam);
  const categoryMeta = activeDoc
    ? DOCUMENT_CATEGORIES[activeDoc.category]
    : DOCUMENT_CATEGORIES.cv;

  return (
    <div className="flex flex-wrap items-center gap-3 shrink-0">
      {activeDoc ? (
        <>
          <a
            href={`/api/cv/pdf?type=${activeDoc.category}&download=1`}
            download={categoryMeta.downloadFilename}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
          >
            <span>Download {categoryMeta.shortLabel} (PDF)</span>
            <Download className="h-3.5 w-3.5" />
          </a>
          <a
            href={`/api/cv/pdf?type=${activeDoc.category}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/6 hover:bg-white/15 text-white font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
          >
            <span>Open PDF</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </>
      ) : (
        <a
          href="mailto:hello@kamrulislam.me?subject=Request%20for%20Official%20CV%20PDF%20%E2%80%94%20Kamrul%20Islam"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-mono-custom text-xs uppercase tracking-wider font-medium transition-all"
        >
          <span>Request PDF CV</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}

      <Link
        href="/contact-us"
        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/4 hover:bg-white/10 text-white/90 font-mono-custom text-xs uppercase tracking-wider border border-white/10 transition-all"
      >
        <span>Inquire / Hire</span>
      </Link>
    </div>
  );
}
