import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { getAllProjectsForAdmin, createProject } from "@/lib/projects-service";

export async function GET() {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  try {
    const projects = await getAllProjectsForAdmin();
    return NextResponse.json({ projects });
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
