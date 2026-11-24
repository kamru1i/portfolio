/**
 * Extracts a clean display domain (without www.) from a URL string.
 */
export function getDisplayDomain(url?: string | null, fallback = "site"): string {
  if (!url) return fallback;
  try {
    return new URL(url).hostname.replace(/^www\./, "") || fallback;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || fallback;
  }
}

/**
 * Safely serializes structured data for <script type="application/ld+json">
 * while escaping `<` to prevent script-tag breakout XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Returns true if the image URL is a local path or matches one of the hostnames
 * configured in next.config.mjs `images.remotePatterns`. Arbitrary external URLs
 * or `data:` URIs return false so `<Image unoptimized />` can render them safely.
 */
export function isNextImageOptimizedUrl(src?: string | null): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  if (trimmed.startsWith("data:")) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host === "img.youtube.com" ||
      host === "i.ytimg.com" ||
      host === "commondatastorage.googleapis.com" ||
      host.endsWith(".tiktokcdn.com") ||
      host.endsWith(".vimeocdn.com") ||
      host.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

/**
 * Validates external URLs rendered in `<a href>` on the client so legacy or
 * malformed records cannot introduce `javascript:`, `data:`, or `vbscript:` links.
 */
export function toSafeExternalUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Ensures OpenGraph/Twitter and JSON-LD image URLs are valid absolute HTTP(S) URLs,
 * never emitting malformed URLs from `data:image/svg+xml;...` fallbacks.
 */
export function toSafeOgImageUrl(
  url?: string | null,
  fallbackPath = "/opengraph-image.jpg"
): string {
  const baseUrl = "https://kamrulislam.me";
  const raw = (url || "").trim();
  if (!raw || raw.startsWith("//")) {
    return `${baseUrl}${fallbackPath}`;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    return toSafeExternalUrl(raw) || `${baseUrl}${fallbackPath}`;
  }
  if (raw.startsWith("/")) {
    return `${baseUrl}${raw}`;
  }
  return `${baseUrl}/${raw}`;
}
