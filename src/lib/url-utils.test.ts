import { describe, expect, it } from "vitest";
import {
  getDisplayDomain,
  isNextImageOptimizedUrl,
  serializeJsonLd,
  toSafeExternalUrl,
  toSafeOgImageUrl,
} from "./url-utils";

describe("url-utils", () => {
  it("accepts http/https external URLs and rejects unsafe protocols", () => {
    expect(toSafeExternalUrl("https://kamrulislam.me/work")).toBe(
      "https://kamrulislam.me/work"
    );
    expect(toSafeExternalUrl("http://example.com")).toBe("http://example.com/");
    expect(toSafeExternalUrl("javascript:alert(1)")).toBeUndefined();
    expect(toSafeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(toSafeExternalUrl("   ")).toBeUndefined();
    expect(toSafeExternalUrl(null)).toBeUndefined();
  });

  it("normalizes safe OG image URLs including local relative paths", () => {
    expect(toSafeOgImageUrl("/images/Kamrul-I.webp")).toBe(
      "https://kamrulislam.me/images/Kamrul-I.webp"
    );
    expect(toSafeOgImageUrl("https://cdn.example.com/thumb.webp")).toBe(
      "https://cdn.example.com/thumb.webp"
    );
    expect(toSafeOgImageUrl("javascript:alert(1)")).toBe(
      "https://kamrulislam.me/opengraph-image.jpg"
    );
    expect(toSafeOgImageUrl(undefined)).toBe(
      "https://kamrulislam.me/opengraph-image.jpg"
    );
  });

  it("extracts clean display domains and strips www prefix", () => {
    expect(getDisplayDomain("https://www.kamrulislam.me/projects")).toBe(
      "kamrulislam.me"
    );
    expect(getDisplayDomain("https://studio.example.com/demo")).toBe(
      "studio.example.com"
    );
    expect(getDisplayDomain("", "fallback.site")).toBe("fallback.site");
  });

  it("escapes HTML-sensitive characters in serialized JSON-LD", () => {
    const serialized = serializeJsonLd({
      bio: '</script><script>alert("xss")</script>',
    });
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
  });

  it("identifies Next.js optimized local and allowlisted URLs cleanly", () => {
    expect(isNextImageOptimizedUrl("/images/Kamrul-I.webp")).toBe(true);
    expect(isNextImageOptimizedUrl("https://i.ytimg.com/vi/abc/maxresdefault.jpg")).toBe(
      true
    );
    expect(isNextImageOptimizedUrl("https://evil.example.com/pic.jpg")).toBe(false);
    expect(isNextImageOptimizedUrl("data:image/png;base64,AAA")).toBe(false);
  });
});
