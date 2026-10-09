import { AspectRatio, VideoProvider } from "@/types/database";
import { ResolvedVideoMeta, VideoMetaStatus } from "@/types/project";

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
    // Block localhost, private IPs, link-local, loopbacks
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("169.254.") ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local")
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
    if (host.includes("twitter.com") || host.includes("x.com")) return "twitter";

    if (url.pathname.match(/\.(mp4|webm|ogg|mov)$/i)) return "local";

    return "other";
  } catch {
    return "other";
  }
}

/**
 * Checks whether YouTube's maxresdefault.jpg exists for a given video ID,
 * falling back to hqdefault.jpg which is universally guaranteed by YouTube.
 */
async function resolveYouTubeThumbnailUrl(videoId: string): Promise<string> {
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(maxResUrl, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // YouTube returns HTTP 200 when maxres exists, or HTTP 404 when it doesn't
    if (res.ok) {
      return maxResUrl;
    }
  } catch {
    // On network error or timeout, safely fallback to hqdefault
  }

  return hqUrl;
}

/**
 * Generates an SVG data URL for branded fallback thumbnail card with provider-specific theme.
 */
export function generateFallbackThumbnail(title: string, provider: VideoProvider): string {
  const providerLabel = provider.toUpperCase();
  const safeTitle = (title || "Portfolio Video Project")
    .replace(/[&<>"']/g, "")
    .slice(0, 42);

  // Provider-specific accent colors and gradients
  let accentColor = "#a1a1aa";
  let gradientStops = `<stop offset="0%" stop-color="#26262b" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;

  if (provider === "youtube") {
    accentColor = "#ef4444";
    gradientStops = `<stop offset="0%" stop-color="#3b1219" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  } else if (provider === "tiktok") {
    accentColor = "#06b6d4";
    gradientStops = `<stop offset="0%" stop-color="#162e3b" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  } else if (provider === "instagram") {
    accentColor = "#ec4899";
    gradientStops = `<stop offset="0%" stop-color="#3b162f" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  } else if (provider === "facebook") {
    accentColor = "#3b82f6";
    gradientStops = `<stop offset="0%" stop-color="#12253b" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  } else if (provider === "vimeo") {
    accentColor = "#0ea5e9";
    gradientStops = `<stop offset="0%" stop-color="#102b38" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  } else if (provider === "twitter") {
    accentColor = "#e4e4e7";
    gradientStops = `<stop offset="0%" stop-color="#24272c" stop-opacity="0.9"/><stop offset="100%" stop-color="#121214" stop-opacity="1"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="100%" height="100%" fill="#121214"/>
    <radialGradient id="g" cx="50%" cy="45%" r="65%">
      ${gradientStops}
    </radialGradient>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="640" cy="310" r="54" fill="#ffffff" fill-opacity="0.08" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="2"/>
    <polygon points="632,292 658,310 632,328" fill="#ffffff" fill-opacity="0.9"/>
    <text x="640" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="-0.02em">${safeTitle}</text>
    <rect x="540" y="460" width="200" height="28" rx="14" fill="#ffffff" fill-opacity="0.06" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="640" y="479" font-family="monospace, monospace" font-size="12" font-weight="600" fill="${accentColor}" text-anchor="middle" letter-spacing="0.12em">${providerLabel} PRODUCTION</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves video metadata, auto-detects aspect ratio, provider, videoId, and thumbnail URL.
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
      status: "error",
      errorDetails: "Invalid or restricted URL format.",
    };
  }

  const provider = detectVideoProvider(cleanUrl);

  // 1. YouTube
  if (provider === "youtube") {
    const { videoId, isShort } = extractYouTubeId(cleanUrl);
    const aspectRatio: AspectRatio = isShort ? "9:16" : "16:9";
    const embedUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;

    if (videoId) {
      const thumbnailUrl = await resolveYouTubeThumbnailUrl(videoId);
      return {
        provider: "youtube",
        videoId,
        thumbnailUrl,
        aspectRatio,
        embedUrl,
        status: "available",
      };
    }

    return {
      provider: "youtube",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "youtube"),
      aspectRatio,
      embedUrl: null,
      status: "unavailable",
      errorDetails: "Could not extract YouTube video ID from provided URL.",
    };
  }

  // 2. Vimeo
  if (provider === "vimeo") {
    const videoId = extractVimeoId(cleanUrl);
    const embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    let thumbnailUrl: string | null = null;
    let title: string | null = null;
    let status: VideoMetaStatus = "unavailable";

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
        if (thumbnailUrl) {
          status = "available";
        }
      }
    } catch {
      // Fallback
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
      status,
    };
  }

  // 3. TikTok
  if (provider === "tiktok") {
    let thumbnailUrl: string | null = null;
    let title: string | null = null;
    let status: VideoMetaStatus = "unavailable";

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
        if (thumbnailUrl) {
          status = "available";
        }
      }
    } catch {
      // Fallback
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
      embedUrl: null,
      status,
      errorDetails: status === "unavailable" ? "Using branded TikTok preview card (oEmbed rate limited or restricted)." : null,
    };
  }

  // 4. Instagram
  if (provider === "instagram") {
    const isReel = cleanUrl.includes("/reel/") || cleanUrl.includes("/reels/");
    return {
      provider: "instagram",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "instagram"),
      aspectRatio: isReel ? "9:16" : "16:9",
      embedUrl: null,
      status: "unavailable",
      errorDetails: "Meta oEmbed restricts public image extraction; using high-resolution branded preview card.",
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
      status: "unavailable",
      errorDetails: "Meta oEmbed restricts public image extraction; using high-resolution branded preview card.",
    };
  }

  // 6. Twitter / X
  if (provider === "twitter") {
    return {
      provider: "twitter",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "twitter"),
      aspectRatio: "16:9",
      embedUrl: null,
      status: "unavailable",
      errorDetails: "X/Twitter media uses branded preview card.",
    };
  }

  // 7. Local MP4 / Video file
  if (provider === "local") {
    return {
      provider: "local",
      videoId: null,
      thumbnailUrl: generateFallbackThumbnail(projectTitle, "local"),
      aspectRatio: "16:9",
      embedUrl: cleanUrl,
      status: "available",
    };
  }

  // Default fallback
  return {
    provider: "other",
    videoId: null,
    thumbnailUrl: generateFallbackThumbnail(projectTitle, "other"),
    aspectRatio: "16:9",
    embedUrl: null,
    status: "unavailable",
    errorDetails: "Generic web video; using branded preview card.",
  };
}
