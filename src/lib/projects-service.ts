import { createClient } from "./supabase/server";
import { PORTFOLIO_DATA, PortfolioProject } from "./portfolio-data";
import {
  ProjectInsert,
  ProjectRecord,
  ProjectUpdate,
  mapProjectRecordToPortfolio,
  compareProjectsByPriorityAndRecency,
  extractCaseStudyFromRecord,
  encodeCaseStudyIntoDescription,
} from "@/types/project";
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

    const projects = (data as ProjectRecord[])
      .map(normalizeProjectRecord)
      .map(mapProjectRecordToPortfolio);
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
const VALID_ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:3", "5:4"] as const;

/**
 * Validates and normalizes project URL fields to prevent unsafe URI schemes (e.g. javascript:, data:, vbscript:).
 * Allows http://, https://, site-relative paths (/...), and internal SVG data URIs when explicitly permitted.
 */
function sanitizeProjectUrl(
  url: string | null | undefined,
  fieldName: string,
  allowInternalSvgDataUri = false
): string | null {
  if (url === undefined || url === null) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  if (allowInternalSvgDataUri && trimmed.startsWith("data:image/svg+xml;utf8,")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`${fieldName} must use http:// or https:// protocol.`);
    }
    return trimmed;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("protocol")) {
      throw err;
    }
    throw new Error(`Invalid URL provided for ${fieldName}.`);
  }
}

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

  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 25)));
  // Strip PostgREST filter delimiters to prevent filter syntax injection in .or()
  const cleanSearch = search
    ? search.trim().replace(/[(),\\"%_]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100)
    : "";

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

  if (cleanSearch) {
    const q = `%${cleanSearch}%`;
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
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;
  query = query.range(from, to);

  let { data, error, count } = await query;

  // Fallback query if manual_priority column query errors
  if (error && error.message.includes("manual_priority")) {
    let fallbackQuery = supabase.from("projects").select("*", { count: "exact" });
    if (type === "video") fallbackQuery = fallbackQuery.eq("type", "video");
    else if (type === "web") fallbackQuery = fallbackQuery.eq("type", "web");
    if (status === "published") fallbackQuery = fallbackQuery.eq("is_published", true);
    else if (status === "draft") fallbackQuery = fallbackQuery.eq("is_published", false);
    if (cleanSearch) {
      const q = `%${cleanSearch}%`;
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

  const rawProjects = ((data as ProjectRecord[]) || []).map(normalizeProjectRecord);
  const total = count || rawProjects.length;
  const totalPages = Math.ceil(total / safePageSize) || 1;

  // Deterministically sort in memory as safeguard when sortBy === 'priority'
  const sortedProjects = sortBy === "priority" 
    ? [...rawProjects].sort(compareProjectsByPriorityAndRecency)
    : rawProjects;

  return {
    projects: sortedProjects,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizeTagsArray(rawTags: unknown, maxItemLen = 50, maxItems = 20): string[] {
  if (!Array.isArray(rawTags)) return [];
  return rawTags
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.replace(/[\r\n\0]+/g, " ").trim().slice(0, maxItemLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeProjectRecord(record: ProjectRecord): ProjectRecord {
  const extracted = extractCaseStudyFromRecord(record);
  const recordSlug = (record.slug || "").toLowerCase();
  const recordTitle = (record.title || "").toLowerCase();
  const fallbackMatch = PORTFOLIO_DATA.showcaseProjects.find(
    (p) =>
      (p.slug && p.slug.toLowerCase() === recordSlug) ||
      p.title.toLowerCase() === recordTitle ||
      generateSlug(p.title) === recordSlug
  );

  return {
    ...record,
    description: extracted.description,
    role: extracted.role || fallbackMatch?.role || null,
    overview: extracted.overview || fallbackMatch?.overview || null,
    deliverables:
      extracted.deliverables.length > 0
        ? extracted.deliverables
        : fallbackMatch?.deliverables || [],
  };
}

/**
 * Retrieves a single project by ID.
 */
export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  if (!UUID_REGEX.test(id.trim())) return null;
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id.trim())
    .single();

  if (error || !data) return null;
  return normalizeProjectRecord(data as ProjectRecord);
}

/**
 * Retrieves a single published project by its slug, ID, or fallback title slug.
 * Checks remote database first, then falls back to static PORTFOLIO_DATA.showcaseProjects.
 */
export async function getProjectBySlugOrId(slugOrId: string): Promise<PortfolioProject | null> {
  const normalizedKey = slugOrId.trim().toLowerCase();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(normalizedKey);

  // Find in local showcase projects (matches slug, id, or generated slug)
  const fallbackProject = PORTFOLIO_DATA.showcaseProjects.find((p) => {
    const pSlug = (p.slug || "").toLowerCase();
    const pId = p.id.toLowerCase();
    const generatedSlug = generateSlug(p.title);
    return (
      pSlug === normalizedKey ||
      pId === normalizedKey ||
      generatedSlug === normalizedKey ||
      (normalizedKey.includes("audi-q5") && (pSlug.includes("audi-q5") || pId.includes("youtube-video-5"))) ||
      (normalizedKey.includes("kamrul") && (pSlug.includes("kamrul") || pId.includes("kamrul")))
    );
  });

  try {
    const supabase = await createClient();
    if (supabase) {
      // 1. Query remote DB by either UUID or slug
      let query = supabase.from("projects").select("*").eq("is_published", true);
      if (isUuid) {
        query = query.eq("id", normalizedKey);
      } else {
        query = query.ilike("slug", normalizedKey);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        const mapped = mapProjectRecordToPortfolio(data as ProjectRecord);
        // Enrich with local structured data if available
        if (fallbackProject) {
          return {
            ...fallbackProject,
            ...mapped,
            role: mapped.role || fallbackProject.role,
            tools: mapped.tools && mapped.tools.length > 0 ? mapped.tools : fallbackProject.tools,
            deliverables: mapped.deliverables && mapped.deliverables.length > 0 ? mapped.deliverables : fallbackProject.deliverables,
            overview: mapped.overview || fallbackProject.overview,
          };
        }
        return mapped;
      }

      // 2. If fallbackProject has a different slug or title in DB, try matching by fallbackProject.slug
      if (fallbackProject?.slug && fallbackProject.slug.toLowerCase() !== normalizedKey) {
        const { data: slugMatch } = await supabase
          .from("projects")
          .select("*")
          .eq("is_published", true)
          .ilike("slug", fallbackProject.slug.toLowerCase())
          .maybeSingle();

        if (slugMatch) {
          const mapped = mapProjectRecordToPortfolio(slugMatch as ProjectRecord);
          return {
            ...fallbackProject,
            ...mapped,
            role: mapped.role || fallbackProject.role,
            tools: mapped.tools && mapped.tools.length > 0 ? mapped.tools : fallbackProject.tools,
            deliverables: mapped.deliverables && mapped.deliverables.length > 0 ? mapped.deliverables : fallbackProject.deliverables,
            overview: mapped.overview || fallbackProject.overview,
          };
        }
      }
    }
  } catch {
    // Database query failed, continue to fallback
  }

  return fallbackProject || null;
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

  const cleanVideoUrl = sanitizeProjectUrl(input.video_url, "Video URL");
  const cleanLiveUrl = sanitizeProjectUrl(input.live_url, "Live URL");
  const cleanGithubUrl = sanitizeProjectUrl(input.github_url, "GitHub URL");
  let previewImageUrl = sanitizeProjectUrl(input.preview_image_url, "Preview Image URL", true);
  let videoProvider = input.video_provider || null;
  let videoId = input.video_id || null;
  let aspectRatio =
    input.aspect_ratio && (VALID_ASPECT_RATIOS as readonly string[]).includes(input.aspect_ratio)
      ? input.aspect_ratio
      : "16:9";

  // If it's a video project, auto-resolve metadata if not already filled
  if (input.type === "video" && cleanVideoUrl) {
    const meta = await resolveVideoMetadata(cleanVideoUrl, input.title);
    videoProvider = meta.provider;
    videoId = meta.videoId;
    aspectRatio =
      input.aspect_ratio && (VALID_ASPECT_RATIOS as readonly string[]).includes(input.aspect_ratio)
        ? input.aspect_ratio
        : meta.aspectRatio;
    if (!previewImageUrl) {
      previewImageUrl = meta.thumbnailUrl;
    }
  }

  // Parse manual priority (positive integer or null)
  const manualPriority = input.manual_priority && Number(input.manual_priority) > 0 
    ? Number(input.manual_priority) 
    : null;

  // Normalize preview mode & embeddability for web projects
  const previewMode = input.preview_mode === "fallback" || input.can_embed === false ? "fallback" : "iframe";
  const canEmbed = input.type === "web" ? previewMode === "iframe" : (input.can_embed ?? false);

  const cleanDescription = (input.description || "").trim().slice(0, 5000);
  const cleanRole = input.role ? String(input.role).replace(/[\r\n\0]+/g, " ").trim().slice(0, 150) : null;
  const cleanOverview = input.overview ? String(input.overview).replace(/\0/g, "").trim().slice(0, 8000) : null;
  const cleanDeliverables = sanitizeTagsArray(input.deliverables, 120, 20);

  // Explicitly whitelist allowed columns & bound string lengths to prevent mass-assignment
  const insertData: ProjectInsert = {
    type: input.type,
    title: input.title.trim().slice(0, 200),
    slug: slug.slice(0, 200),
    description: cleanDescription,
    client_name: input.client_name ? String(input.client_name).trim().slice(0, 120) : null,
    year: input.year ? String(input.year).trim().slice(0, 20) : null,
    role: cleanRole,
    overview: cleanOverview,
    deliverables: cleanDeliverables,
    video_url: cleanVideoUrl,
    live_url: cleanLiveUrl,
    github_url: cleanGithubUrl,
    preview_image_url: previewImageUrl,
    video_provider: videoProvider,
    video_id: videoId ? String(videoId).trim().slice(0, 100) : null,
    aspect_ratio: aspectRatio,
    tags: sanitizeTagsArray(input.tags),
    manual_priority: manualPriority,
    preview_mode: input.type === "web" ? previewMode : null,
    can_embed: canEmbed,
    is_published: Boolean(input.is_published),
    sort_order: manualPriority ?? (Number(input.sort_order) || 0),
    published_at: input.is_published ? (input.published_at || now) : null,
  };

  let { data, error } = await supabase
    .from("projects")
    .insert(insertData)
    .select()
    .single();

  // Gracefully retry if case-study or preview_mode columns are not yet present on remote DB
  if (
    error &&
    error.message &&
    (error.message.includes("role") ||
      error.message.includes("overview") ||
      error.message.includes("deliverables") ||
      error.message.includes("preview_mode"))
  ) {
    const {
      role: _r,
      overview: _o,
      deliverables: _d,
      preview_mode: _p,
      ...fallbackInsert
    } = insertData;
    fallbackInsert.description = encodeCaseStudyIntoDescription(
      cleanDescription,
      cleanRole,
      cleanOverview,
      cleanDeliverables
    );
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

  return normalizeProjectRecord(data as ProjectRecord);
}

/**
 * Updates an existing project and triggers cache revalidation.
 */
export async function updateProject(id: string, updates: ProjectUpdate): Promise<ProjectRecord> {
  if (!UUID_REGEX.test(id.trim())) {
    throw new Error("Invalid project ID format.");
  }
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  // Explicitly whitelist allowed update fields to prevent mass-assignment of id or created_at
  const updatePayload: ProjectUpdate = {};

  if (updates.type !== undefined) {
    if (!["video", "web"].includes(updates.type)) {
      throw new Error("Project type must be either 'video' or 'web'.");
    }
    updatePayload.type = updates.type;
  }
  if (updates.title !== undefined) {
    const cleanTitle = String(updates.title).trim().slice(0, 200);
    if (!cleanTitle) throw new Error("Project title cannot be empty.");
    updatePayload.title = cleanTitle;
  }
  if (updates.slug !== undefined) {
    const cleanSlug = generateSlug(String(updates.slug));
    if (cleanSlug) updatePayload.slug = cleanSlug.slice(0, 200);
  }
  if (updates.description !== undefined) {
    updatePayload.description = String(updates.description).trim().slice(0, 5000);
  }
  if (updates.client_name !== undefined) {
    updatePayload.client_name = updates.client_name
      ? String(updates.client_name).trim().slice(0, 120)
      : null;
  }
  if (updates.year !== undefined) {
    updatePayload.year = updates.year ? String(updates.year).trim().slice(0, 20) : null;
  }
  if (updates.role !== undefined) {
    updatePayload.role = updates.role
      ? String(updates.role).replace(/[\r\n\0]+/g, " ").trim().slice(0, 150)
      : null;
  }
  if (updates.overview !== undefined) {
    updatePayload.overview = updates.overview
      ? String(updates.overview).replace(/\0/g, "").trim().slice(0, 8000)
      : null;
  }
  if (updates.deliverables !== undefined) {
    updatePayload.deliverables = sanitizeTagsArray(updates.deliverables, 120, 20);
  }
  if (updates.tags !== undefined) {
    updatePayload.tags = sanitizeTagsArray(updates.tags);
  }
  if (updates.is_published !== undefined) {
    updatePayload.is_published = Boolean(updates.is_published);
  }
  if (updates.published_at !== undefined) {
    updatePayload.published_at = updates.published_at;
  }
  if (updates.sort_order !== undefined) {
    updatePayload.sort_order = Number(updates.sort_order) || 0;
  }
  if (updates.video_provider !== undefined) {
    updatePayload.video_provider = updates.video_provider;
  }
  if (updates.video_id !== undefined) {
    updatePayload.video_id = updates.video_id ? String(updates.video_id).trim().slice(0, 100) : null;
  }
  if (updates.aspect_ratio !== undefined) {
    if (!(VALID_ASPECT_RATIOS as readonly string[]).includes(updates.aspect_ratio)) {
      throw new Error("Invalid aspect ratio format.");
    }
    updatePayload.aspect_ratio = updates.aspect_ratio;
  }

  if (updates.video_url !== undefined) {
    updatePayload.video_url = sanitizeProjectUrl(updates.video_url, "Video URL");
  }
  if (updates.live_url !== undefined) {
    updatePayload.live_url = sanitizeProjectUrl(updates.live_url, "Live URL");
  }
  if (updates.github_url !== undefined) {
    updatePayload.github_url = sanitizeProjectUrl(updates.github_url, "GitHub URL");
  }
  if (updates.preview_image_url !== undefined) {
    updatePayload.preview_image_url = sanitizeProjectUrl(
      updates.preview_image_url,
      "Preview Image URL",
      true
    );
  }

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
    const mode = updates.preview_mode === "fallback" ? "fallback" : "iframe";
    updatePayload.preview_mode = mode;
    updatePayload.can_embed = mode === "iframe";
  } else if (updates.can_embed !== undefined) {
    updatePayload.preview_mode = updates.can_embed ? "iframe" : "fallback";
  }

  // If updating video_url, re-resolve metadata if needed
  if (updates.type === "video" && updatePayload.video_url) {
    const meta = await resolveVideoMetadata(updatePayload.video_url, updates.title || "");
    updatePayload.video_provider = meta.provider;
    updatePayload.video_id = meta.videoId;
    if (!updatePayload.preview_image_url) {
      updatePayload.preview_image_url = meta.thumbnailUrl;
    }
  }

  let { data, error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  // Gracefully retry if case-study or preview_mode columns are not yet present on remote DB
  if (
    error &&
    error.message &&
    (error.message.includes("role") ||
      error.message.includes("overview") ||
      error.message.includes("deliverables") ||
      error.message.includes("preview_mode"))
  ) {
    const {
      role: _r,
      overview: _o,
      deliverables: _d,
      preview_mode: _p,
      ...fallbackPayload
    } = updatePayload;
    if (
      updatePayload.description !== undefined ||
      updatePayload.role !== undefined ||
      updatePayload.overview !== undefined ||
      updatePayload.deliverables !== undefined
    ) {
      const existing = await getProjectById(id);
      const baseDesc =
        updatePayload.description !== undefined
          ? updatePayload.description
          : existing?.description || "";
      const roleVal =
        updatePayload.role !== undefined ? updatePayload.role : existing?.role || null;
      const overviewVal =
        updatePayload.overview !== undefined
          ? updatePayload.overview
          : existing?.overview || null;
      const delivVal =
        updatePayload.deliverables !== undefined
          ? updatePayload.deliverables
          : existing?.deliverables || [];
      fallbackPayload.description = encodeCaseStudyIntoDescription(
        baseDesc,
        roleVal,
        overviewVal,
        delivVal
      );
    }
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

  return normalizeProjectRecord(data as ProjectRecord);
}

/**
 * Deletes a project.
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (!UUID_REGEX.test(id.trim())) {
    throw new Error("Invalid project ID format.");
  }
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id.trim());
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

