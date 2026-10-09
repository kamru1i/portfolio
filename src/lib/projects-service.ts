import { createClient } from "./supabase/server";
import { PORTFOLIO_DATA, PortfolioProject } from "./portfolio-data";
import { ProjectInsert, ProjectRecord, ProjectUpdate, mapProjectRecordToPortfolio, compareProjectsByPriorityAndRecency } from "@/types/project";
import { resolveVideoMetadata } from "./video-metadata";
import { revalidatePath, revalidateTag } from "next/cache";

export { compareProjectsByPriorityAndRecency };

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
      return [...PORTFOLIO_DATA.showcaseProjects].sort(compareProjectsByPriorityAndRecency);
    }

    // Try query with manual_priority column first
    let { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("manual_priority", { ascending: true, nullsFirst: false })
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    // Fallback if manual_priority column is not yet present on remote DB
    if (error) {
      const fallback = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      data = fallback.data;
      error = fallback.error;
    }

    if (error || !data || data.length === 0) {
      return [...PORTFOLIO_DATA.showcaseProjects].sort(compareProjectsByPriorityAndRecency);
    }

    const projects = (data as ProjectRecord[]).map(mapProjectRecordToPortfolio);
    return projects.sort(compareProjectsByPriorityAndRecency);
  } catch {
    return [...PORTFOLIO_DATA.showcaseProjects].sort(compareProjectsByPriorityAndRecency);
  }
}

export interface AdminProjectsQueryOptions {
  page?: number;
  pageSize?: number;
  type?: "all" | "video" | "web";
  status?: "all" | "published" | "draft";
  search?: string;
  sortBy?: "priority" | "newest" | "title";
}

export interface AdminProjectsResult {
  projects: ProjectRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Retrieves projects (published & drafts) for the Admin Dashboard with search, filter, and pagination.
 */
export async function getAllProjectsForAdmin(
  options: AdminProjectsQueryOptions = {}
): Promise<AdminProjectsResult> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    page = 1,
    pageSize = 25,
    type = "all",
    status = "all",
    search = "",
    sortBy = "priority",
  } = options;

  let query = supabase.from("projects").select("*", { count: "exact" });

  if (type === "video") {
    query = query.eq("type", "video");
  } else if (type === "web") {
    query = query.eq("type", "web");
  }

  if (status === "published") {
    query = query.eq("is_published", true);
  } else if (status === "draft") {
    query = query.eq("is_published", false);
  }

  if (search && search.trim()) {
    const q = `%${search.trim()}%`;
    query = query.or(`title.ilike.${q},client_name.ilike.${q},description.ilike.${q}`);
  }

  // Apply default sorting
  if (sortBy === "title") {
    query = query.order("title", { ascending: true });
  } else if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    // Default to priority ranking
    query = query
      .order("manual_priority", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
  }

  // Apply pagination range if requested
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  let { data, error, count } = await query;

  // Fallback query if manual_priority column query errors
  if (error && error.message.includes("manual_priority")) {
    let fallbackQuery = supabase.from("projects").select("*", { count: "exact" });
    if (type === "video") fallbackQuery = fallbackQuery.eq("type", "video");
    else if (type === "web") fallbackQuery = fallbackQuery.eq("type", "web");
    if (status === "published") fallbackQuery = fallbackQuery.eq("is_published", true);
    else if (status === "draft") fallbackQuery = fallbackQuery.eq("is_published", false);
    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      fallbackQuery = fallbackQuery.or(`title.ilike.${q},client_name.ilike.${q},description.ilike.${q}`);
    }
    fallbackQuery = fallbackQuery.order("created_at", { ascending: false }).range(from, to);
    const fbRes = await fallbackQuery;
    data = fbRes.data;
    error = fbRes.error;
    count = fbRes.count;
  }

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  const rawProjects = (data as ProjectRecord[]) || [];
  const total = count || rawProjects.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Deterministically sort in memory as safeguard when sortBy === 'priority'
  const sortedProjects = sortBy === "priority" 
    ? [...rawProjects].sort(compareProjectsByPriorityAndRecency)
    : rawProjects;

  return {
    projects: sortedProjects,
    total,
    page,
    pageSize,
    totalPages,
  };
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

  // Parse manual priority (positive integer or null)
  const manualPriority = input.manual_priority && Number(input.manual_priority) > 0 
    ? Number(input.manual_priority) 
    : null;

  // Normalize preview mode & embeddability for web projects
  const previewMode = input.preview_mode || (input.can_embed === false ? "fallback" : "iframe");
  const canEmbed = input.type === "web" ? previewMode === "iframe" : (input.can_embed ?? false);

  const insertData: ProjectInsert = {
    ...input,
    slug,
    preview_image_url: previewImageUrl,
    video_provider: videoProvider,
    video_id: videoId,
    aspect_ratio: aspectRatio,
    manual_priority: manualPriority,
    preview_mode: input.type === "web" ? previewMode : null,
    can_embed: canEmbed,
    sort_order: manualPriority ?? (input.sort_order ?? 0),
    published_at: input.is_published ? (input.published_at || now) : null,
  };

  let { data, error } = await supabase
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  // Gracefully retry without preview_mode if column is not yet present on remote DB
  if (error && error.message && error.message.includes("preview_mode")) {
    const { preview_mode: _, ...fallbackInsert } = insertData;
    const retry = await supabase
      .from("projects")
      .insert(fallbackInsert)
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

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
    const existing = await getProjectById(id);
    if (existing && !existing.published_at) {
      updatePayload.published_at = new Date().toISOString();
    }
  }

  // If manual priority is specified, normalize and mirror to sort_order
  if (updates.manual_priority !== undefined) {
    const manualPriority = updates.manual_priority && Number(updates.manual_priority) > 0
      ? Number(updates.manual_priority)
      : null;
    updatePayload.manual_priority = manualPriority;
    updatePayload.sort_order = manualPriority ?? 0;
  }

  // Synchronize preview_mode and can_embed
  if (updates.preview_mode !== undefined) {
    updatePayload.preview_mode = updates.preview_mode;
    updatePayload.can_embed = updates.preview_mode === "iframe";
  } else if (updates.can_embed !== undefined) {
    updatePayload.preview_mode = updates.can_embed ? "iframe" : "fallback";
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

  let { data, error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  // Gracefully retry without preview_mode if column is not yet present on remote DB
  if (error && error.message && error.message.includes("preview_mode")) {
    const { preview_mode: _, ...fallbackPayload } = updatePayload;
    const retry = await supabase
      .from("projects")
      .update(fallbackPayload)
      .eq("id", id)
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

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

