import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import {
  deleteCvDocument,
  getAllCvDocumentsForAdmin,
  updateCvDocumentState,
  uploadAndReplaceCvDocument,
} from "@/lib/cv-service";

export async function GET() {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json(
      { error: error || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const documents = await getAllCvDocumentsForAdmin();
    const activeDocument = documents.find((doc) => doc.is_published) || null;
    return NextResponse.json({ documents, activeDocument });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load CV documents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
    const formData = await req.formData();
    const fileEntry = formData.get("file");

    if (!fileEntry || !(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: "Please select a valid PDF file to upload." },
        { status: 400 }
      );
    }

    const title = formData.get("title")?.toString() || "Kamrul Islam — Curriculum Vitae";
    const versionLabel = formData.get("versionLabel")?.toString() || null;
    const publishParam = formData.get("publishImmediately")?.toString();
    const publishImmediately = publishParam !== "false";

    const document = await uploadAndReplaceCvDocument({
      file: fileEntry,
      title,
      versionLabel,
      publishImmediately,
      uploadedBy: user.id,
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload CV document";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json(
      { error: error || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json({ error: "CV document ID is required." }, { status: 400 });
    }

    const document = await updateCvDocumentState(id, {
      is_published: typeof body.is_published === "boolean" ? body.is_published : undefined,
      title: typeof body.title === "string" ? body.title : undefined,
      version_label:
        body.version_label === null || typeof body.version_label === "string"
          ? body.version_label
          : undefined,
    });

    return NextResponse.json({ document });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update CV document";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json(
      { error: error || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id")?.trim() || "";

    if (!id) {
      try {
        const body = await req.json();
        if (typeof body.id === "string") id = body.id.trim();
      } catch {
        // ignore empty body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "CV document ID is required." }, { status: 400 });
    }

    await deleteCvDocument(id);
    return NextResponse.json({ deleted: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete CV document";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
