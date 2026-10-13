import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { getAllProjectsForAdmin, createProject } from "@/lib/projects-service";

export async function GET(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const rawPageSize = parseInt(searchParams.get("pageSize") || "50", 10);
    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const pageSize = Number.isFinite(rawPageSize) ? Math.min(100, Math.max(1, rawPageSize)) : 50;
    const rawType = searchParams.get("type") || "all";
    const type: "all" | "video" | "web" =
      rawType === "video" || rawType === "web" ? rawType : "all";
    const rawStatus = searchParams.get("status") || "all";
    const status: "all" | "published" | "draft" =
      rawStatus === "published" || rawStatus === "draft" ? rawStatus : "all";
    const search = (searchParams.get("q") || "").slice(0, 100);
    const rawSort = searchParams.get("sort") || "priority";
    const sortBy: "priority" | "newest" | "title" =
      rawSort === "newest" || rawSort === "title" ? rawSort : "priority";

    const result = await getAllProjectsForAdmin({
      page,
      pageSize,
      type,
      status,
      search,
      sortBy,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const project = await createProject(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
