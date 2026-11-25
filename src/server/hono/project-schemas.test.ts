import { describe, expect, it } from "vitest";
import {
  createProjectSchema,
  patchProjectSchema,
  updateProjectSchema,
} from "./project-schemas";

describe("project-schemas", () => {
  describe("createProjectSchema", () => {
    it("validates valid video and web project payloads and strips unknown keys", () => {
      const videoPayload = createProjectSchema.safeParse({
        type: "video",
        title: "Biqolpo Commercial Edit",
        slug: "biqolpo-commercial-edit",
        client_name: "Biqolpo",
        year: "2026",
        description: "Full commercial video post-production.",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        video_provider: "youtube",
        video_id: "dQw4w9WgXcQ",
        aspect_ratio: "16:9",
        preview_image_url: "data:image/svg+xml;utf8,%3Csvg%3E%3C/svg%3E",
        tags: ["Premiere Pro", "Color Grading"],
        deliverables: ["Master 4K", "9:16 Cutdown"],
        manual_priority: null,
        is_published: true,
        id: "injected-uuid",
        created_at: "2020-01-01T00:00:00Z",
      });

      expect(videoPayload.success).toBe(true);
      if (videoPayload.success) {
        expect("id" in videoPayload.data).toBe(false);
        expect("created_at" in videoPayload.data).toBe(false);
        expect(videoPayload.data.title).toBe("Biqolpo Commercial Edit");
      }

      const webPayload = createProjectSchema.safeParse({
        type: "web",
        title: "Nexa Apparel Portal",
        live_url: "https://nexaapparels.com",
        github_url: null,
        preview_mode: "fallback",
        can_embed: false,
        aspect_ratio: "16:9",
        manual_priority: 1,
        is_published: false,
      });
      expect(webPayload.success).toBe(true);
    });

    it("rejects invalid type, empty title, bad aspect_ratio, invalid slug, and negative priority", () => {
      expect(
        createProjectSchema.safeParse({ type: "audio", title: "Invalid" }).success
      ).toBe(false);
      expect(
        createProjectSchema.safeParse({ type: "video", title: "   " }).success
      ).toBe(false);
      expect(
        createProjectSchema.safeParse({
          type: "video",
          title: "Reel",
          aspect_ratio: "21:9",
        }).success
      ).toBe(false);
      expect(
        createProjectSchema.safeParse({
          type: "web",
          title: "Site",
          slug: "bad slug/path",
        }).success
      ).toBe(false);
      expect(
        createProjectSchema.safeParse({
          type: "web",
          title: "Site",
          manual_priority: -2,
        }).success
      ).toBe(false);
    });
  });

  describe("updateProjectSchema", () => {
    it("validates partial updates and strips mass-assignment fields", () => {
      const parsed = updateProjectSchema.safeParse({
        title: "Updated Title",
        manual_priority: 3,
        id: "should-strip",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect("id" in parsed.data).toBe(false);
        expect(parsed.data.manual_priority).toBe(3);
      }
    });

    it("rejects empty update objects or blank titles", () => {
      expect(updateProjectSchema.safeParse({}).success).toBe(false);
      expect(updateProjectSchema.safeParse({ title: "   " }).success).toBe(false);
    });
  });

  describe("patchProjectSchema", () => {
    it("accepts boolean is_published or empty toggle payload and rejects non-booleans", () => {
      expect(patchProjectSchema.safeParse({ is_published: true }).success).toBe(true);
      expect(patchProjectSchema.safeParse({ is_published: false }).success).toBe(true);
      expect(patchProjectSchema.safeParse({}).success).toBe(true);
      expect(patchProjectSchema.safeParse({ is_published: "true" }).success).toBe(false);
    });
  });
});
