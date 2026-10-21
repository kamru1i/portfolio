import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import {
  downloadCvStorageBlob,
  getCvDocumentById,
  getPublishedCvDocument,
  PUBLIC_CV_DOWNLOAD_FILENAME,
} from "@/lib/cv-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "1" || searchParams.get("download") === "true";
    const isPreview = searchParams.get("preview") === "1";
    const requestedId = searchParams.get("id")?.trim() || "";

    let targetDoc = null;

    if (isPreview && requestedId) {
      const { user, isAdmin } = await verifyAdminSession();
      if (!user || !isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized: Admin session required to preview unpublished CV documents." },
          { status: 401, headers: { "Cache-Control": "no-store" } }
        );
      }
      targetDoc = await getCvDocumentById(requestedId);
    } else {
      targetDoc = await getPublishedCvDocument();
    }

    if (!targetDoc) {
      return NextResponse.json(
        { error: "No published Curriculum Vitae PDF is currently active." },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const blob = await downloadCvStorageBlob(targetDoc.storage_path);
    if (!blob) {
      return NextResponse.json(
        { error: "CV PDF file could not be retrieved from storage." },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const arrayBuffer = await blob.arrayBuffer();
    const dispositionType = isDownload ? "attachment" : "inline";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${PUBLIC_CV_DOWNLOAD_FILENAME}"`,
        "Content-Length": String(arrayBuffer.byteLength),
        "Cache-Control": isPreview
          ? "private, no-store"
          : "public, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to serve CV PDF at this time." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
