import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { getProjectById, updateProject, deleteProject, togglePublishProject } from "@/lib/projects-service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    const updated = await updateProject(id, body);
    return NextResponse.json({ project: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update project";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    if (typeof body.is_published === "boolean") {
      const updated = await updateProject(id, {
        is_published: body.is_published,
        published_at: body.is_published ? new Date().toISOString() : null,
      });
      return NextResponse.json({ project: updated });
    } else {
      const existing = await getProjectById(id);
      if (!existing) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      const updated = await togglePublishProject(id, existing.is_published);
      return NextResponse.json({ project: updated });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle publish";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return NextResponse.json({ error: error || "Unauthorized: Admin privileges required" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
