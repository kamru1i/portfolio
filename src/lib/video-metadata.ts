import type { AspectRatio, VideoProvider } from "@/types/database";
import type { ResolvedVideoMeta, VideoMetaStatus } from "@/types/project";

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID_REGEX = /^\d{1,20}$/;

function matchesDomain(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function isRestrictedIpv4(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length < 2 || parts.length > 4) return false;
  // Reject dotted-hex or dotted-octal IPv4 obfuscation (e.g., 0177.0.0.1 or 0x7f.0.0.1)
  if (parts.some((p) => /^0x/i.test(p) || (/^0\d+$/.test(p)))) {
    return true;
  }
  if (!parts.every((p) => /^\d{1,3}$/.test(p))) return false;
  if (parts.length !== 4) return true; // Reject shorthand 2/3-part IPv4 forms

  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => n < 0 || n > 255)) return true;

  const [a, b] = nums;
  if (
    a === 0 || // 0.0.0.0/8 ("this" network)
    a === 10 || // 10.0.0.0/8 private
    a === 127 || // 127.0.0.0/8 loopback
    (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 CGNAT
    (a === 169 && b === 254) || // 169.254.0.0/16 link-local / cloud metadata
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12 private
    (a === 192 && b === 168) || // 192.168.0.0/16 private
    (a === 192 && b === 0) || // 192.0.0.0/24 IETF protocol assignments
    (a === 198 && (b === 18 || b === 19)) || // 198.18.0.0/15 benchmarking
    a >= 224 // 224.0.0.0/4 multicast & 240.0.0.0/4 reserved
  ) {
    return true;
  }

  return false;
}

/**
 * Checks whether a URL is a safe public HTTP/HTTPS URL and not an internal/private IP (SSRF guard).
 */
export function isSafePublicUrl(urlString: string): boolean {
  try {
    // Reject NUL bytes or non-ASCII control characters (CVE-2026-105482 / CVE-2026-105483 hardening)
    if (
      urlString.includes("\0") ||
      /%00/i.test(urlString) ||
      /[^\x20-\x7E]/.test(urlString)
    ) {
      return false;
    }

    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    // Strip IPv6 brackets and trailing dot if present
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
    if (!hostname || /[^\x21-\x7E]/.test(hostname)) return false;

    // Block localhost, cloud metadata hostnames, IPv6 internal ranges, and integer/hex IPs
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "metadata" ||
      hostname === "instance-data" ||
      hostname === "metadata.google.internal" ||
      hostname === "::" ||
      hostname === "::1" ||
      hostname.startsWith("::ffff:") ||
      hostname.startsWith("64:ff9b:") ||
      /^f[cd][0-9a-f]{2}:/i.test(hostname) ||
      /^fe[89ab][0-9a-f]:/i.test(hostname) ||
      /^\d+$/.test(hostname) ||
      /^0x[0-9a-f]+$/i.test(hostname) ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".arpa") ||
      isRestrictedIpv4(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function safePublicFetch(
  initialUrl: string,
  init: RequestInit & { timeoutMs?: number } = {},
  maxRedirects = 2
): Promise<Response> {
  const { timeoutMs = 3500, ...fetchInit } = init;
  let currentUrl = initialUrl;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (!isSafePublicUrl(currentUrl)) {
      throw new Error("Blocked redirect to unsafe destination.");
    }
    const parsed = new URL(currentUrl);
    if (parsed.protocol !== "https:") {
      throw new Error("Only HTTPS upstream endpoints are permitted.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(currentUrl, {
        ...fetchInit,
        redirect: "manual",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location || hop === maxRedirects) {
          throw new Error("Redirect limit reached or missing Location header.");
        }
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  throw new Error("Redirect limit exceeded.");
}

async function readSafeJson(res: Response, maxBytes = 64 * 1024): Promise<Record<string, unknown> | null> {
  const text = await res.text();
  if (text.length > maxBytes) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function sanitizeRemoteHttpsUrl(candidate: unknown): string | null {
  if (typeof candidate !== "string") return null;
  const trimmed = candidate.trim();
  if (!trimmed || !isSafePublicUrl(trimmed)) return null;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" ? trimmed : null;
  } catch {
    return null;
  }
}

/**
 * Extracts YouTube Video ID from common URL formats (watch, youtu.be, shorts, embed).
 */
export function extractYouTubeId(urlStr: string): { videoId: string | null; isShort: boolean } {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const pathname = url.pathname;

    const cleanCandidate = (raw: string | null | undefined): string | null => {
      if (!raw) return null;
      const token = raw.split(/[/?#&]/)[0]?.trim() || "";
      return YOUTUBE_ID_REGEX.test(token) ? token : null;
    };

    if (host === "youtu.be") {
      return { videoId: cleanCandidate(pathname.slice(1)), isShort: false };
    }

    if (matchesDomain(host, "youtube.com") || matchesDomain(host, "youtube-nocookie.com")) {
      if (pathname.startsWith("/shorts/")) {
        return { videoId: cleanCandidate(pathname.slice("/shorts/".length)), isShort: true };
      }
      if (pathname.startsWith("/embed/")) {
        return { videoId: cleanCandidate(pathname.slice("/embed/".length)), isShort: false };
      }
      const v = cleanCandidate(url.searchParams.get("v"));
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
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (matchesDomain(host, "vimeo.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && VIMEO_ID_REGEX.test(last)) {
        return last;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Detects the video provider from a URL using strict hostname suffix checks.
 */
export function detectVideoProvider(urlStr: string): VideoProvider {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (matchesDomain(host, "youtube.com") || matchesDomain(host, "youtube-nocookie.com") || host === "youtu.be") {
      return "youtube";
    }
    if (matchesDomain(host, "vimeo.com")) return "vimeo";
    if (matchesDomain(host, "tiktok.com")) return "tiktok";
    if (matchesDomain(host, "facebook.com") || host === "fb.watch") return "facebook";
    if (matchesDomain(host, "instagram.com")) return "instagram";
    if (matchesDomain(host, "twitter.com") || matchesDomain(host, "x.com")) return "twitter";

    if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return "local";

    return "other";
  } catch {
    return "other";
  }
}

export interface PlayableEmbedOptions {
  autoplay?: boolean;
  privacyEnhanced?: boolean;
}

/**
 * Resolves a safe iframe embed URL (YouTube, Vimeo, or Google Drive /preview)
 * for detail pages and modal players. Returns `null` for direct MP4/WebM files
 * or non-embeddable social links so callers can render `<video>` or external CTAs.
 */
export function resolvePlayableEmbedUrl(
  url?: string | null,
  options: PlayableEmbedOptions = {}
): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct local or remote video files should render in <video>, not <iframe>
  if (
    (trimmed.startsWith("/") && !trimmed.startsWith("//")) ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)
  ) {
    return null;
  }

  if (!isSafePublicUrl(trimmed)) {
    return null;
  }

  const autoplayFlag = options.autoplay ? "1" : "0";
  const ytHost =
    options.privacyEnhanced === false
      ? "www.youtube.com"
      : "www.youtube-nocookie.com";

  const { videoId: ytId } = extractYouTubeId(trimmed);
  if (ytId) {
    return `https://${ytHost}/embed/${ytId}?autoplay=${autoplayFlag}&rel=0&modestbranding=1`;
  }

  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoplayFlag}`;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (matchesDomain(host, "drive.google.com") && parsed.pathname.includes("/preview")) {
      return trimmed;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Checks whether YouTube's maxresdefault.jpg exists for a given video ID,
 * falling back to hqdefault.jpg which is universally guaranteed by YouTube.
 */
async function resolveYouTubeThumbnailUrl(videoId: string): Promise<string> {
  if (!YOUTUBE_ID_REGEX.test(videoId)) {
    throw new Error("Invalid YouTube video ID.");
  }
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const res = await safePublicFetch(maxResUrl, {
      method: "HEAD",
      headers: { "Accept-Encoding": "gzip, deflate" },
      timeoutMs: 2500,
    });

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
      const res = await safePublicFetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(cleanUrl)}`,
        {
          headers: { "Accept-Encoding": "gzip, deflate" },
          timeoutMs: 3500,
        }
      );

      if (res.ok) {
        const data = await readSafeJson(res);
        if (data) {
          thumbnailUrl = sanitizeRemoteHttpsUrl(data.thumbnail_url);
          title = typeof data.title === "string" ? data.title.slice(0, 200) : null;
          if (thumbnailUrl) {
            status = "available";
          }
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
      const res = await safePublicFetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
        {
          headers: { "Accept-Encoding": "gzip, deflate" },
          timeoutMs: 3500,
        }
      );

      if (res.ok) {
        const data = await readSafeJson(res);
        if (data) {
          thumbnailUrl = sanitizeRemoteHttpsUrl(data.thumbnail_url);
          title = typeof data.title === "string" ? data.title.slice(0, 200) : null;
          if (thumbnailUrl) {
            status = "available";
          }
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
