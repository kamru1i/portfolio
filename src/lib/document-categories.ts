import type { Database } from "@/types/database";

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
