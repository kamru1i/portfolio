import { z } from "zod";

const projectTypeSchema = z.enum(["video", "web"], {
  error: "Project type must be either 'video' or 'web'.",
});

const videoProviderSchema = z.enum([
  "youtube",
  "vimeo",
  "tiktok",
  "facebook",
  "instagram",
  "twitter",
  "local",
  "other",
]);

const aspectRatioSchema = z.enum(["16:9", "9:16", "1:1", "4:3", "5:4"], {
  error: "Invalid aspect ratio format.",
});

const previewModeSchema = z.enum(["iframe", "fallback"]);

const slugSchema = z
  .string()
  .trim()
  .max(200, "URL slug must be 200 characters or fewer.")
  .regex(/^[A-Za-z0-9-]*$/, "URL slug may only contain letters, numbers, and hyphens.");

const manualPrioritySchema = z.union([
  z
    .number()
    .int("Display priority must be an integer.")
    .min(0, "Display priority must be 0 or greater.")
    .max(10000, "Display priority must be 10,000 or less."),
  z.null(),
]);

const sharedProjectFields = {
  slug: slugSchema.optional(),
  description: z.string().max(5000).optional(),
  client_name: z.string().max(120).nullable().optional(),
  year: z.string().max(20).nullable().optional(),
  role: z.string().max(150).nullable().optional(),
  overview: z.string().max(8000).nullable().optional(),
  deliverables: z.array(z.string().max(120)).max(20).optional(),
  tags: z.array(z.string().max(80)).max(30).optional(),
  video_url: z.string().max(2000).nullable().optional(),
  video_provider: videoProviderSchema.nullable().optional(),
  video_id: z.string().max(100).nullable().optional(),
  aspect_ratio: aspectRatioSchema.optional(),
  live_url: z.string().max(2000).nullable().optional(),
  github_url: z.string().max(2000).nullable().optional(),
  can_embed: z.boolean().optional(),
  preview_mode: previewModeSchema.nullable().optional(),
  preview_image_url: z.string().max(20000).nullable().optional(),
  is_published: z.boolean().optional(),
  published_at: z.string().max(64).nullable().optional(),
  sort_order: z.number().int().min(0).max(10000).optional(),
  manual_priority: manualPrioritySchema.optional(),
};

export const createProjectSchema = z.object({
  type: projectTypeSchema,
  title: z
    .string({ error: "Project title is required." })
    .trim()
    .min(1, "Project title is required.")
    .max(200, "Project title must be 200 characters or fewer."),
  ...sharedProjectFields,
});

export const updateProjectSchema = z
  .object({
    type: projectTypeSchema.optional(),
    title: z
      .string()
      .trim()
      .min(1, "Project title cannot be empty.")
      .max(200, "Project title must be 200 characters or fewer.")
      .optional(),
    ...sharedProjectFields,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one updatable project field is required.",
  });

export const patchProjectSchema = z.object({
  is_published: z
    .boolean({ error: "is_published must be a boolean." })
    .optional(),
});
