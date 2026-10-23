import { Database, ProjectType, VideoProvider, AspectRatio, WebPreviewMode } from "./database";
import { PORTFOLIO_DATA, PortfolioProject } from "@/lib/portfolio-data";

export type { ProjectType, VideoProvider, AspectRatio, WebPreviewMode };

export type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type VideoMetaStatus = "available" | "pending" | "unavailable" | "error";

export interface ResolvedVideoMeta {
  provider: VideoProvider;
  videoId: string | null;
  thumbnailUrl: string | null;
  aspectRatio: AspectRatio;
  title?: string | null;
  embedUrl: string | null;
  status: VideoMetaStatus;
  errorDetails?: string | null;
}

const CASE_STUDY_META_REGEX = /\n*\s*<!--CASE_STUDY_META:([\s\S]*?)-->\s*$/;

export interface ExtractedCaseStudyFields {
  description: string;
  role: string | null;
  overview: string | null;
  deliverables: string[];
}

/**
 * Extracts Case Study fields (`role`, `overview`, `deliverables`) from a ProjectRecord,
 * supporting both native PostgreSQL columns and transparent metadata encoding if the
 * remote database migration has not been applied yet.
 */
export function extractCaseStudyFromRecord(record: {
  description?: string | null;
  role?: string | null;
  overview?: string | null;
  deliverables?: string[] | null;
}): ExtractedCaseStudyFields {
  const rawDesc = record.description || "";
  const match = rawDesc.match(CASE_STUDY_META_REGEX);

  let parsedRole: string | null = null;
  let parsedOverview: string | null = null;
  let parsedDeliverables: string[] = [];
  let cleanDescription = rawDesc;

  if (match && match[1]) {
    cleanDescription = rawDesc.replace(CASE_STUDY_META_REGEX, "").trim();
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.role === "string" && parsed.role.trim()) {
          parsedRole = parsed.role.trim();
        }
        if (typeof parsed.overview === "string" && parsed.overview.trim()) {
          parsedOverview = parsed.overview.trim();
        }
        if (Array.isArray(parsed.deliverables)) {
          parsedDeliverables = parsed.deliverables.filter(
            (d: unknown): d is string => typeof d === "string" && Boolean(d.trim())
          );
        }
      }
    } catch {
      // Ignore malformed metadata comment
    }
  }

  return {
    description: cleanDescription,
    role: record.role?.trim() || parsedRole || null,
    overview: record.overview?.trim() || parsedOverview || null,
    deliverables:
      Array.isArray(record.deliverables) && record.deliverables.length > 0
        ? record.deliverables
        : parsedDeliverables,
  };
}

/**
 * Encodes Case Study fields into description as a fallback when the remote DB schema
 * has not yet added the `role`, `overview`, and `deliverables` columns.
 */
export function encodeCaseStudyIntoDescription(
  description: string,
  role?: string | null,
  overview?: string | null,
  deliverables?: string[] | null
): string {
  const cleanDesc = (description || "").replace(CASE_STUDY_META_REGEX, "").trim();
  const hasRole = Boolean(role && role.trim());
  const hasOverview = Boolean(overview && overview.trim());
  const hasDeliverables = Array.isArray(deliverables) && deliverables.length > 0;

  if (!hasRole && !hasOverview && !hasDeliverables) {
    return cleanDesc;
  }

  const metaJson = JSON.stringify({
    ...(hasRole ? { role: role!.trim() } : {}),
    ...(hasOverview ? { overview: overview!.trim() } : {}),
    ...(hasDeliverables ? { deliverables } : {}),
  });

  return `${cleanDesc}\n\n<!--CASE_STUDY_META:${metaJson}-->`;
}

/**
 * Adapter function that maps a database ProjectRecord to the UI PortfolioProject model,
 * ensuring 100% backward and visual compatibility with Video & Web project card components.
 */
export function mapProjectRecordToPortfolio(record: ProjectRecord): PortfolioProject {
  const isEmbed = record.preview_mode ? record.preview_mode === "iframe" : record.can_embed;
  const fallbackMatch = PORTFOLIO_DATA.showcaseProjects.find(
    (p) =>
      (record.slug && p.slug === record.slug) ||
      (record.live_url && p.liveUrl === record.live_url)
  );
  const defaultThumb =
    fallbackMatch?.thumbnail ||
    (record.type === "video" ? "/images/work-1-biqolpo.png" : "/images/web-projects/web-project-1.png");

  const extracted = extractCaseStudyFromRecord(record);
  const resolvedTags = record.tags || [];

  return {
    id: record.id,
    slug: record.slug || undefined,
    type: record.type,
    title: record.title,
    client: record.client_name || undefined,
    year: record.year || "",
    description: extracted.description,
    role: extracted.role || fallbackMatch?.role || undefined,
    overview: extracted.overview || fallbackMatch?.overview || undefined,
    deliverables:
      extracted.deliverables.length > 0
        ? extracted.deliverables
        : fallbackMatch?.deliverables || undefined,
    tools:
      resolvedTags.length > 0
        ? resolvedTags
        : fallbackMatch?.tools || undefined,
    thumbnail: record.preview_image_url || defaultThumb,
    previewImageUrl: record.preview_image_url || undefined,
    videoUrl: record.video_url || undefined,
    videoType: record.video_provider || "other",
    format: record.aspect_ratio,
    aspect: record.aspect_ratio === "9:16" ? "small" : "large",
    githubUrl: record.github_url || undefined,
    liveUrl: record.live_url || undefined,
    canEmbed: isEmbed,
    previewMode: (record.preview_mode as "iframe" | "fallback") || (isEmbed ? "iframe" : "fallback"),
    tags: resolvedTags,
    published: record.is_published,
    order: record.sort_order,
    manualPriority: record.manual_priority ?? (record.sort_order > 0 ? record.sort_order : null),
    publishedAt: record.published_at || undefined,
    createdAt: record.created_at || undefined,
  };
}

/**
 * Deterministic sorting comparator for portfolio projects:
 * 1. Published projects with explicit manual priority in ascending order (1, 2, 3...)
 * 2. Published projects with no priority ordered by newest publication date (published_at DESC, fallback created_at DESC)
 * 3. Stable tie-breaker: created_at DESC, id ASC.
 */
export function compareProjectsByPriorityAndRecency<T extends {
  id: string;
  manual_priority?: number | null;
  manualPriority?: number | null;
  sort_order?: number;
  order?: number;
  published_at?: string | null;
  publishedAt?: string;
  created_at?: string;
  createdAt?: string;
}>(a: T, b: T): number {
  const aPri = a.manual_priority !== undefined ? a.manual_priority : a.manualPriority;
  const bPri = b.manual_priority !== undefined ? b.manual_priority : b.manualPriority;

  const hasAPri = aPri !== null && aPri !== undefined && Number(aPri) > 0;
  const hasBPri = bPri !== null && bPri !== undefined && Number(bPri) > 0;

  if (hasAPri && hasBPri) {
    if (Number(aPri) !== Number(bPri)) return Number(aPri) - Number(bPri);
  } else if (hasAPri) {
    return -1; // a comes first
  } else if (hasBPri) {
    return 1; // b comes first
  }

  // Fallback to published_at DESC, fallback created_at DESC
  const aPub = a.published_at || a.publishedAt;
  const bPub = b.published_at || b.publishedAt;
  const aDate = aPub ? new Date(aPub).getTime() : (a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt!).getTime() : 0);
  const bDate = bPub ? new Date(bPub).getTime() : (b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt!).getTime() : 0);

  if (bDate !== aDate) return bDate - aDate;

  // Tie breaker 1: created_at DESC
  const aCreated = a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt!).getTime() : 0;
  const bCreated = b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt!).getTime() : 0;
  if (bCreated !== aCreated) return bCreated - aCreated;

  // Tie breaker 2: id ASC
  return (a.id || "").localeCompare(b.id || "");
}

