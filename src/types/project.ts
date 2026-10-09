import { Database, ProjectType, VideoProvider, AspectRatio } from "./database";
import { PortfolioProject } from "@/lib/portfolio-data";

export type { ProjectType, VideoProvider, AspectRatio };

export type ProjectRecord = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export interface ResolvedVideoMeta {
  provider: VideoProvider;
  videoId: string | null;
  thumbnailUrl: string | null;
  aspectRatio: AspectRatio;
  title?: string | null;
  embedUrl: string | null;
}

/**
 * Adapter function that maps a database ProjectRecord to the UI PortfolioProject model,
 * ensuring 100% backward and visual compatibility with Patrick Jane & Aurexa components.
 */
export function mapProjectRecordToPortfolio(record: ProjectRecord): PortfolioProject {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    client: record.client_name || undefined,
    year: record.year || "",
    description: record.description,
    thumbnail: record.preview_image_url || (record.type === "video" ? "/images/work-1-biqolpo.png" : "/images/aurexa/aurexa-project-1.png"),
    videoUrl: record.video_url || undefined,
    videoType: record.video_provider === "youtube" ? "youtube" : record.video_provider === "vimeo" ? "vimeo" : "local",
    format: record.aspect_ratio,
    aspect: record.aspect_ratio === "9:16" ? "small" : "large",
    githubUrl: record.github_url || undefined,
    liveUrl: record.live_url || undefined,
    canEmbed: record.can_embed,
    tags: record.tags || [],
    published: record.is_published,
    order: record.sort_order,
  };
}
