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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);
    const type = (searchParams.get("type") || "all") as "all" | "video" | "web";
    const status = (searchParams.get("status") || "all") as "all" | "published" | "draft";
    const search = searchParams.get("q") || "";
    const sortBy = (searchParams.get("sort") || "priority") as "priority" | "newest" | "title";

    const result = await getAllProjectsForAdmin({
      page: isNaN(page) ? 1 : page,
      pageSize: isNaN(pageSize) ? 50 : pageSize,
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
