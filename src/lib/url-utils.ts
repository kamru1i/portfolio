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
