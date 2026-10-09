import { Database, ProjectType, VideoProvider, AspectRatio, WebPreviewMode } from "./database";
import { PortfolioProject } from "@/lib/portfolio-data";

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

/**
 * Adapter function that maps a database ProjectRecord to the UI PortfolioProject model,
 * ensuring 100% backward and visual compatibility with Patrick Jane & Aurexa components.
 */
export function mapProjectRecordToPortfolio(record: ProjectRecord): PortfolioProject {
  const isEmbed = record.preview_mode ? record.preview_mode === "iframe" : record.can_embed;
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    client: record.client_name || undefined,
    year: record.year || "",
    description: record.description,
    thumbnail: record.preview_image_url || (record.type === "video" ? "/images/work-1-biqolpo.png" : "/images/aurexa/aurexa-project-1.png"),
    previewImageUrl: record.preview_image_url || undefined,
    videoUrl: record.video_url || undefined,
    videoType: record.video_provider || "other",
    format: record.aspect_ratio,
    aspect: record.aspect_ratio === "9:16" ? "small" : "large",
    githubUrl: record.github_url || undefined,
    liveUrl: record.live_url || undefined,
    canEmbed: isEmbed,
    previewMode: (record.preview_mode as "iframe" | "fallback") || (isEmbed ? "iframe" : "fallback"),
    tags: record.tags || [],
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

