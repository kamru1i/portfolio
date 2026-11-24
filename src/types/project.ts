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

const LEGACY_ASSET_REWRITES: Record<string, string> = {
  "/images/Kamrul-I.png": "/images/Kamrul-I.webp",
  "/images/work-1-biqolpo.png": "/images/work-1-biqolpo.webp",
  "/images/web-projects/web-project-1.png": "/images/web-projects/web-project-1.webp",
  "/images/web-projects/web-project-2.png": "/images/web-projects/web-project-2.webp",
  "/images/web-projects/web-project-3.png": "/images/web-projects/web-project-3.webp",
  "/images/web-projects/web-project-4.png": "/images/web-projects/web-project-4.webp",
  "/images/web-projects/web-project-5.png": "/images/web-projects/web-project-5.webp",
  "/images/web-projects/web-project-6.png": "/images/web-projects/web-project-6.webp",
};

export function normalizeLegacyLocalAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  return LEGACY_ASSET_REWRITES[trimmed] || trimmed;
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
    (record.type === "video" ? "/images/work-1-biqolpo.webp" : "/images/web-projects/web-project-1.webp");

  const extracted = extractCaseStudyFromRecord(record);
  const resolvedTags = record.tags || [];
  const normalizedPreviewImage = normalizeLegacyLocalAssetUrl(record.preview_image_url);

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
    thumbnail: normalizedPreviewImage || defaultThumb,
    previewImageUrl: normalizedPreviewImage || undefined,
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

export { compareProjectsByPriorityAndRecency } from "@/lib/project-sort";

