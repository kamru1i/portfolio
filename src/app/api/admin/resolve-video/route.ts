import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { resolveVideoMetadata, isSafePublicUrl } from "@/lib/video-metadata";

export async function POST(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  try {
    const { url, title } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid video URL is required" }, { status: 400 });
    }

    if (!isSafePublicUrl(url)) {
      return NextResponse.json({ error: "Invalid or restricted URL format" }, { status: 400 });
    }

    const meta = await resolveVideoMetadata(url, title || "");
    return NextResponse.json({ meta });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resolve video metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
