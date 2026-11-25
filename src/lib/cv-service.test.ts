import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: (fn: unknown) => fn,
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

import {
  getDocumentCategory,
  isDocumentPublishedRecord,
  MAX_CV_FILE_SIZE_BYTES,
  normalizeDocumentCategory,
  sanitizeCvFilename,
  validateAndReadPdfBuffer,
} from "./cv-service";

describe("cv-service", () => {
  describe("sanitizeCvFilename", () => {
    it("strips directory traversal paths, control characters, and special characters", () => {
      expect(sanitizeCvFilename("../../etc/passwd.pdf")).toBe("passwd.pdf");
      expect(sanitizeCvFilename("C:\\Users\\secret\\My Resume (2026)!.pdf")).toBe(
        "My-Resume-2026.pdf"
      );
      expect(sanitizeCvFilename("bad\u0000name\n.pdf")).toBe("badname.pdf");
    });

    it("uses fallback stem when empty and caps filename stem to 80 chars", () => {
      expect(sanitizeCvFilename("!!!.pdf")).toBe("Kamrul-Islam-CV.pdf");
      const longName = `${"a".repeat(120)}.pdf`;
      expect(sanitizeCvFilename(longName)).toBe(`${"a".repeat(80)}.pdf`);
    });
  });

  describe("validateAndReadPdfBuffer", () => {
    it("accepts a valid PDF with %PDF- magic bytes and returns sanitized metadata", async () => {
      const bytes = Buffer.from("%PDF-1.7\n1 0 obj\n<<>>\nendobj\n", "ascii");
      const file = new File([bytes], "../Kamrul CV 2026.pdf", {
        type: "application/pdf",
      });

      const result = await validateAndReadPdfBuffer(file);
      expect(result.sanitizedFileName).toBe("Kamrul-CV-2026.pdf");
      expect(result.fileSize).toBe(bytes.byteLength);
      expect(result.buffer.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    });

    it("rejects wrong extension, wrong MIME type, empty, oversized, and spoofed files", async () => {
      const nonPdfExt = new File([Buffer.from("%PDF-1.7\n0000")], "resume.docx", {
        type: "application/pdf",
      });
      await expect(validateAndReadPdfBuffer(nonPdfExt)).rejects.toThrow(/Invalid file extension/);

      const wrongMime = new File([Buffer.from("%PDF-1.7\n0000")], "resume.pdf", {
        type: "text/plain",
      });
      await expect(validateAndReadPdfBuffer(wrongMime)).rejects.toThrow(/Invalid MIME type/);

      const emptyFile = new File([], "empty.pdf", { type: "application/pdf" });
      await expect(validateAndReadPdfBuffer(emptyFile)).rejects.toThrow(/empty/i);

      const tinyFile = new File([Buffer.from("%PDF-")], "tiny.pdf", {
        type: "application/pdf",
      });
      await expect(validateAndReadPdfBuffer(tinyFile)).rejects.toThrow(/too small/i);

      const oversizedMock = {
        name: "huge.pdf",
        type: "application/pdf",
        size: MAX_CV_FILE_SIZE_BYTES + 1,
        arrayBuffer: async () => new ArrayBuffer(16),
      } as unknown as File;
      await expect(validateAndReadPdfBuffer(oversizedMock)).rejects.toThrow(/10 MB maximum/);

      const spoofedHeader = new File([Buffer.from("MZ9000123456")], "spoofed.pdf", {
        type: "application/pdf",
      });
      await expect(validateAndReadPdfBuffer(spoofedHeader)).rejects.toThrow(/%PDF- binary header/);
    });
  });

  describe("document categories & published helper", () => {
    it("normalizes categories safely and falls back to cv", () => {
      expect(normalizeDocumentCategory("resume")).toBe("resume");
      expect(normalizeDocumentCategory("portfolio")).toBe("portfolio");
      expect(normalizeDocumentCategory("cover-letter")).toBe("cover-letter");
      expect(normalizeDocumentCategory("unknown")).toBe("cv");
      expect(normalizeDocumentCategory(undefined)).toBe("cv");
    });

    it("infers document category from storage path or file URL", () => {
      expect(
        getDocumentCategory({
          storage_path: "cv/portfolio-123.pdf",
          file_url: "/api/cv/pdf",
        })
      ).toBe("portfolio");
      expect(
        getDocumentCategory({
          storage_path: "cv/custom.pdf",
          file_url: "/api/cv/pdf?type=cover-letter",
        })
      ).toBe("cover-letter");
      expect(
        getDocumentCategory({
          storage_path: "cv/resume-1.pdf",
          file_url: "/api/cv/pdf",
        })
      ).toBe("resume");
    });

    it("evaluates published flag or active=1 marker accurately", () => {
      expect(
        isDocumentPublishedRecord({
          is_published: false,
          file_url: "/api/cv/pdf?type=cv&active=1",
        })
      ).toBe(true);
      expect(
        isDocumentPublishedRecord({
          is_published: false,
          file_url: "/api/cv/pdf?type=cv",
        })
      ).toBe(false);
    });
  });
});
