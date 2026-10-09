import { createClient } from "./supabase/server";
import { PORTFOLIO_DATA, PortfolioProject } from "./portfolio-data";
import { ProjectInsert, ProjectRecord, ProjectUpdate, mapProjectRecordToPortfolio } from "@/types/project";
import { resolveVideoMetadata } from "./video-metadata";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Generates a clean URL slug from a project title.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Retrieves all published projects for the public website.
 * Falls back safely to PORTFOLIO_DATA.showcaseProjects if Supabase is unconfigured or empty.
 */
export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return PORTFOLIO_DATA.showcaseProjects;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return PORTFOLIO_DATA.showcaseProjects;
    }

    return (data as ProjectRecord[]).map(mapProjectRecordToPortfolio);
  } catch {
    return PORTFOLIO_DATA.showcaseProjects;
  }
}

/**
 * Retrieves all projects (published & drafts) for the Admin Dashboard.
 */
export async function getAllProjectsForAdmin(): Promise<ProjectRecord[]> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return (data as ProjectRecord[]) || [];
}

/**
 * Retrieves a single project by ID.
 */
export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as ProjectRecord;
}

/**
 * Creates a new project in the database and triggers cache revalidation.
 */
export async function createProject(input: ProjectInsert): Promise<ProjectRecord> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (!input.title || !input.title.trim()) {
    throw new Error("Project title is required.");
  }

  if (!input.type || !["video", "web"].includes(input.type)) {
    throw new Error("Project type must be either 'video' or 'web'.");
  }

  const slug = input.slug?.trim() || generateSlug(input.title) || `project-${Date.now()}`;
  const now = new Date().toISOString();

  let previewImageUrl = input.preview_image_url || null;
  let videoProvider = input.video_provider || null;
  let videoId = input.video_id || null;
  let aspectRatio = input.aspect_ratio || "16:9";

  // If it's a video project, auto-resolve metadata if not already filled
  if (input.type === "video" && input.video_url) {
    const meta = await resolveVideoMetadata(input.video_url, input.title);
    videoProvider = meta.provider;
    videoId = meta.videoId;
    aspectRatio = input.aspect_ratio || meta.aspectRatio;
    if (!previewImageUrl) {
      previewImageUrl = meta.thumbnailUrl;
    }
  }

  const insertData: ProjectInsert = {
    ...input,
    slug,
    preview_image_url: previewImageUrl,
    video_provider: videoProvider,
    video_id: videoId,
    aspect_ratio: aspectRatio,
    published_at: input.is_published ? (input.published_at || now) : null,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  // Trigger immediate cache revalidation across public website routes
  revalidatePath("/");
  revalidatePath("/projects");
  try {
    revalidateTag("projects", "default");
  } catch {
    // tag revalidation fallback
  }

  return data as ProjectRecord;
}

/**
 * Updates an existing project and triggers cache revalidation.
 */
export async function updateProject(id: string, updates: ProjectUpdate): Promise<ProjectRecord> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  // If publishing for the first time, set published_at
  const updatePayload: ProjectUpdate = { ...updates };
  if (updates.is_published === true && !updates.published_at) {
    // Check if it already had published_at
    const existing = await getProjectById(id);
    if (existing && !existing.published_at) {
      updatePayload.published_at = new Date().toISOString();
    }
  }

  // If updating video_url, re-resolve metadata if needed
  if (updates.type === "video" && updates.video_url) {
    const meta = await resolveVideoMetadata(updates.video_url, updates.title || "");
    updatePayload.video_provider = meta.provider;
    updatePayload.video_id = meta.videoId;
    if (!updates.preview_image_url) {
      updatePayload.preview_image_url = meta.thumbnailUrl;
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  try {
    revalidateTag("projects", "default");
  } catch {
    // fallback
  }

  return data as ProjectRecord;
}

/**
 * Deletes a project.
 */
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  try {
    revalidateTag("projects", "default");
  } catch {
    // fallback
  }

  return true;
}

/**
 * Toggles a project's published state.
 */
export async function togglePublishProject(id: string, currentState: boolean): Promise<ProjectRecord> {
  const newState = !currentState;
  return updateProject(id, {
    is_published: newState,
    published_at: newState ? new Date().toISOString() : null,
  });
}
