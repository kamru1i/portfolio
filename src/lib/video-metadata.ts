import { AspectRatio, VideoProvider } from "@/types/database";
import { ResolvedVideoMeta } from "@/types/project";

/**
 * Checks whether a URL is a safe public HTTP/HTTPS URL and not an internal/private IP (SSRF guard).
 */
export function isSafePublicUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    // Block localhost, private IPs, loopbacks
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts YouTube Video ID from common URL formats (watch, youtu.be, shorts, embed).
 */
export function extractYouTubeId(urlStr: string): { videoId: string | null; isShort: boolean } {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace("www.", "");
    const pathname = url.pathname;

    if (host === "youtu.be") {
      const id = pathname.slice(1).split(/[?#&]/)[0];
      return { videoId: id || null, isShort: false };
    }

    if (host.includes("youtube.com")) {
      if (pathname.startsWith("/shorts/")) {
        const id = pathname.replace("/shorts/", "").split(/[?#&]/)[0];
        return { videoId: id || null, isShort: true };
      }
      if (pathname.startsWith("/embed/")) {
        const id = pathname.replace("/embed/", "").split(/[?#&]/)[0];
        return { videoId: id || null, isShort: false };
      }
      const v = url.searchParams.get("v");
      if (v) {
        return { videoId: v, isShort: false };
      }
    }

    return { videoId: null, isShort: false };
  } catch {
    return { videoId: null, isShort: false };
  }
}

/**
 * Extracts Vimeo Video ID.
 */
export function extractVimeoId(urlStr: string): string | null {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace("www.", "");
    if (host.includes("vimeo.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && /^\d+$/.test(last)) {
        return last;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Detects the video provider from a URL.
 */
export function detectVideoProvider(urlStr: string): VideoProvider {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace("www.", "");

    if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
    if (host.includes("vimeo.com")) return "vimeo";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("facebook.com") || host === "fb.watch") return "facebook";
    if (host.includes("instagram.com")) return "instagram";

    if (url.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) return "local";

    return "other";
  } catch {
    return "other";
  }
}

/**
 * Generates an SVG data URL for branded fallback thumbnail card when provider metadata is unavailable.
 */
export function generateFallbackThumbnail(title: string, provider: VideoProvider): string {
  const providerLabel = provider.toUpperCase();
  const safeTitle = (title || "Portfolio Video Project")
    .replace(/[&<>"']/g, "")
    .slice(0, 36);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="100%" height="100%" fill="#121214"/>
    <radialGradient id="g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#26262b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#121214" stop-opacity="1"/>
    </radialGradient>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="640" cy="320" r="54" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"/>
    <polygon points="632,302 658,320 632,338" fill="#ffffff" fill-opacity="0.9"/>
    <text x="640" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="-0.02em">${safeTitle}</text>
    <text x="640" y="480" font-family="monospace, monospace" font-size="14" font-weight="500" fill="#a1a1aa" text-anchor="middle" letter-spacing="0.1em">${providerLabel} PRODUCTION</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves video metadata, auto-detects aspect ratio, provider, videoId, and high-res thumbnail URL.
 * Server-safe and uses strict timeout and SSRF guards.
 */
export async function resolveVideoMetadata(urlStr: string, projectTitle: string = ""): Promise<ResolvedVideoMeta> {
  const cleanUrl = urlStr.trim();
  if (!cleanUrl || !isSafePublicUrl(cleanUrl)) {
    return {
      provider: "other",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "other"),
      aspectRatio: "16:9",
      embedUrl: null,
    };
  }

  const provider = detectVideoProvider(cleanUrl);

  // 1. YouTube
  if (provider === "youtube") {
    const { videoId, isShort } = extractYouTubeId(cleanUrl);
    const aspectRatio: AspectRatio = isShort ? "9:16" : "16:9";
    const embedUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    let thumbnailUrl: string | null = null;

    if (videoId) {
      // Default to hqdefault which is universally guaranteed to exist for any public YouTube video
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else {
      thumbnailUrl = generateFallbackThumbnail(projectTitle, "youtube");
    }

    return {
      provider: "youtube",
      videoId,
      thumbnailUrl,
      aspectRatio,
      embedUrl,
    };
  }

  // 2. Vimeo
  if (provider === "vimeo") {
    const videoId = extractVimeoId(cleanUrl);
    const embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    let thumbnailUrl: string | null = null;
    let title: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(cleanUrl)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        thumbnailUrl = data.thumbnail_url || null;
        title = data.title || null;
      }
    } catch {
      // fallback
    }

    if (!thumbnailUrl) {
      thumbnailUrl = generateFallbackThumbnail(projectTitle, "vimeo");
    }

    return {
      provider: "vimeo",
      videoId,
      thumbnailUrl,
      aspectRatio: "16:9",
      title,
      embedUrl,
    };
  }

  // 3. TikTok
  if (provider === "tiktok") {
    let thumbnailUrl: string | null = null;
    let title: string | null = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        thumbnailUrl = data.thumbnail_url || null;
        title = data.title || null;
      }
    } catch {
      // fallback
    }

    if (!thumbnailUrl) {
      thumbnailUrl = generateFallbackThumbnail(projectTitle, "tiktok");
    }

    return {
      provider: "tiktok",
      videoId: null,
      thumbnailUrl,
      aspectRatio: "9:16",
      title,
      embedUrl: null, // TikTok embeds are loaded via widget script or opened externally
    };
  }

  // 4. Instagram
  if (provider === "instagram") {
    const isReel = cleanUrl.includes("/reel/");
    return {
      provider: "instagram",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "instagram"),
      aspectRatio: isReel ? "9:16" : "16:9",
      embedUrl: null,
    };
  }

  // 5. Facebook
  if (provider === "facebook") {
    return {
      provider: "facebook",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "facebook"),
      aspectRatio: "16:9",
      embedUrl: null,
    };
  }

  // 6. Local MP4 / Video file
  if (provider === "local") {
    return {
      provider: "local",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "local"),
      aspectRatio: "16:9",
      embedUrl: cleanUrl,
    };
  }

  // Default fallback
  return {
    provider: "other",
    videoId: null,
    thumbnailUrl: generateFallbackThumbnail(projectTitle, "other"),
    aspectRatio: "16:9",
    embedUrl: null,
  };
}
