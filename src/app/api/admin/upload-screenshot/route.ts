import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";

export const SCREENSHOT_BUCKET_NAME = "project-screenshots";
export const MAX_SCREENSHOT_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

function sanitizeImageFilename(rawName: string, ext: string): string {
  const baseName = rawName
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();

  const cleanStem = baseName
    .toLowerCase()
    .replace(/[^a-z0-9._\-\s]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${cleanStem || "homepage-screenshot"}.${ext}`;
}

function hasValidImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.byteLength < 12) return false;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // WebP: "RIFF" .... "WEBP"
  if (mimeType === "image/webp") {
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    return riff === "RIFF" && webp === "WEBP";
  }

  // AVIF: .... "ftyp"
  if (mimeType === "image/avif") {
    const ftyp = buffer.subarray(4, 8).toString("ascii");
    return ftyp === "ftyp";
  }

  return false;
}

export async function POST(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json(
      { error: error || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const fileEntry = formData.get("file");

    if (!fileEntry || !(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "Please select a valid screenshot image file." },
        { status: 400 }
      );
    }

    const mimeType = (fileEntry.type || "").toLowerCase();
    const ext = ALLOWED_IMAGE_MIME_TYPES[mimeType];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported image format. Please upload a PNG, JPG, WebP, or AVIF image." },
        { status: 400 }
      );
    }

    if (fileEntry.size <= 0) {
      return NextResponse.json(
        { error: "Uploaded image file is empty." },
        { status: 400 }
      );
    }

    if (fileEntry.size > MAX_SCREENSHOT_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Screenshot image exceeds the 8 MB maximum file size limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await fileEntry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!hasValidImageSignature(buffer, mimeType)) {
      return NextResponse.json(
        { error: "Invalid image binary signature. Please upload a genuine PNG, JPG, WebP, or AVIF screenshot." },
        { status: 400 }
      );
    }

    const sanitizedFileName = sanitizeImageFilename(fileEntry.name || "screenshot", ext);
    const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const storagePath = `web/${uniqueKey}-${sanitizedFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(SCREENSHOT_BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Failed to upload screenshot to storage: ${uploadError.message}` },
        { status: 400 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(SCREENSHOT_BUCKET_NAME)
      .getPublicUrl(storagePath);

    return NextResponse.json(
      {
        url: publicUrlData.publicUrl,
        storagePath,
        fileName: sanitizedFileName,
        fileSize: buffer.byteLength,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload screenshot";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
