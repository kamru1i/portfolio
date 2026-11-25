import { afterEach, describe, expect, it, vi } from "vitest";
import {
  detectVideoProvider,
  extractVimeoId,
  extractYouTubeId,
  generateFallbackThumbnail,
  isSafePublicUrl,
  resolvePlayableEmbedUrl,
  resolveVideoMetadata,
} from "./video-metadata";

describe("video-metadata", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("isSafePublicUrl", () => {
    it("allows valid public HTTPS URLs", () => {
      expect(isSafePublicUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
      expect(isSafePublicUrl("https://kamrulislam.me/videos/showreel.mp4")).toBe(true);
    });

    it("rejects non-HTTPS, localhost, private/metadata IPs, obfuscated IPs, credentials, and control chars", () => {
      expect(isSafePublicUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
      expect(isSafePublicUrl("https://localhost:3000/video.mp4")).toBe(false);
      expect(isSafePublicUrl("https://sub.localhost/video.mp4")).toBe(false);
      expect(isSafePublicUrl("https://127.0.0.1/video.mp4")).toBe(false);
      expect(isSafePublicUrl("https://169.254.169.254/latest/meta-data")).toBe(false);
      expect(isSafePublicUrl("https://10.0.0.5/internal")).toBe(false);
      expect(isSafePublicUrl("https://192.168.1.1/admin")).toBe(false);
      expect(isSafePublicUrl("https://172.16.0.1/admin")).toBe(false);
      expect(isSafePublicUrl("https://[::1]/video")).toBe(false);
      expect(isSafePublicUrl("https://0x7f.0.0.1/video")).toBe(false);
      expect(isSafePublicUrl("https://0177.0.0.1/video")).toBe(false);
      expect(isSafePublicUrl("https://user:pass@example.com/video")).toBe(false);
      expect(isSafePublicUrl("https://example.com/video%00.mp4")).toBe(false);
    });
  });

  describe("extractYouTubeId", () => {
    it("extracts watch, youtu.be, shorts, and embed IDs", () => {
      expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
        videoId: "dQw4w9WgXcQ",
        isShort: false,
      });
      expect(extractYouTubeId("https://youtu.be/dQw4w9WgXcQ?si=test")).toEqual({
        videoId: "dQw4w9WgXcQ",
        isShort: false,
      });
      expect(extractYouTubeId("https://www.youtube.com/shorts/AbCdEf12345")).toEqual({
        videoId: "AbCdEf12345",
        isShort: true,
      });
      expect(extractYouTubeId("https://www.youtube-nocookie.com/embed/AbCdEf12345")).toEqual({
        videoId: "AbCdEf12345",
        isShort: false,
      });
    });

    it("ignores spoofed lookalike domains", () => {
      expect(extractYouTubeId("https://notyoutube.com/watch?v=dQw4w9WgXcQ")).toEqual({
        videoId: null,
        isShort: false,
      });
    });
  });

  describe("extractVimeoId", () => {
    it("extracts numeric Vimeo IDs and rejects lookalikes", () => {
      expect(extractVimeoId("https://vimeo.com/123456789")).toBe("123456789");
      expect(extractVimeoId("https://vimeo.com/channels/staffpicks/987654321")).toBe(
        "987654321"
      );
      expect(extractVimeoId("https://evilvimeo.com/123456789")).toBeNull();
    });
  });

  describe("detectVideoProvider", () => {
    it("identifies supported platforms and direct video files accurately", () => {
      expect(detectVideoProvider("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
      expect(detectVideoProvider("https://vimeo.com/123456789")).toBe("vimeo");
      expect(detectVideoProvider("https://www.tiktok.com/@creator/video/123")).toBe("tiktok");
      expect(detectVideoProvider("https://fb.watch/abc123/")).toBe("facebook");
      expect(detectVideoProvider("https://www.instagram.com/reel/Cxyz123/")).toBe("instagram");
      expect(detectVideoProvider("https://x.com/user/status/123")).toBe("twitter");
      expect(detectVideoProvider("https://cdn.example.com/reel.MOV?token=1")).toBe("local");
      expect(detectVideoProvider("https://example.com/watch")).toBe("other");
    });
  });

  describe("resolvePlayableEmbedUrl", () => {
    it("resolves privacy-enhanced YouTube, Vimeo, and Google Drive preview URLs", () => {
      expect(resolvePlayableEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
        "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1"
      );
      expect(
        resolvePlayableEmbedUrl("https://youtu.be/dQw4w9WgXcQ", {
          autoplay: true,
          privacyEnhanced: false,
        })
      ).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1");
      expect(resolvePlayableEmbedUrl("https://vimeo.com/123456789")).toBe(
        "https://player.vimeo.com/video/123456789?autoplay=0"
      );
      expect(
        resolvePlayableEmbedUrl("https://drive.google.com/file/d/abc123/preview")
      ).toBe("https://drive.google.com/file/d/abc123/preview");
    });

    it("returns null for direct video files, local paths, and unsafe URLs", () => {
      expect(resolvePlayableEmbedUrl("https://cdn.example.com/cut.mp4?token=abc")).toBeNull();
      expect(resolvePlayableEmbedUrl("/videos/local-reel.mp4")).toBeNull();
      expect(resolvePlayableEmbedUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
      expect(resolvePlayableEmbedUrl("javascript:alert(1)")).toBeNull();
    });
  });

  describe("generateFallbackThumbnail", () => {
    it("creates a sanitized SVG data URL thumbnail", () => {
      const dataUrl = generateFallbackThumbnail(`<script>alert("xss")</script>`, "instagram");
      expect(dataUrl.startsWith("data:image/svg+xml;utf8,")).toBe(true);
      const decoded = decodeURIComponent(dataUrl.slice("data:image/svg+xml;utf8,".length));
      expect(decoded).toContain("INSTAGRAM PRODUCTION");
      expect(decoded).not.toContain("<script>");
    });
  });

  describe("resolveVideoMetadata", () => {
    it("returns error metadata for restricted URLs", async () => {
      const meta = await resolveVideoMetadata("http://127.0.0.1/internal.mp4", "Blocked");
      expect(meta.status).toBe("error");
      expect(meta.provider).toBe("other");
      expect(meta.thumbnailUrl?.startsWith("data:image/svg+xml;utf8,")).toBe(true);
    });

    it("detects 9:16 for Instagram reels and direct availability for .mp4", async () => {
      const igMeta = await resolveVideoMetadata(
        "https://www.instagram.com/reel/Cxyz123/",
        "Brand Reel"
      );
      expect(igMeta.provider).toBe("instagram");
      expect(igMeta.aspectRatio).toBe("9:16");

      const mp4Meta = await resolveVideoMetadata("https://cdn.example.com/film.mp4", "Film");
      expect(mp4Meta.provider).toBe("local");
      expect(mp4Meta.status).toBe("available");
      expect(mp4Meta.embedUrl).toBe("https://cdn.example.com/film.mp4");
    });

    it("uses maxresdefault when YouTube HEAD succeeds and falls back to hqdefault on 404", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValueOnce(new Response(null, { status: 200 }));

      const okMeta = await resolveVideoMetadata(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "Showreel"
      );
      expect(okMeta.provider).toBe("youtube");
      expect(okMeta.aspectRatio).toBe("16:9");
      expect(okMeta.thumbnailUrl).toBe("https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg");

      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 404 }));
      const fallbackMeta = await resolveVideoMetadata(
        "https://www.youtube.com/shorts/AbCdEf12345",
        "Short"
      );
      expect(fallbackMeta.aspectRatio).toBe("9:16");
      expect(fallbackMeta.thumbnailUrl).toBe("https://img.youtube.com/vi/AbCdEf12345/hqdefault.jpg");
    });
  });
});
