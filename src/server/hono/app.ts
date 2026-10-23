import { Hono } from "hono";
import type { User } from "@supabase/supabase-js";
import { verifyAdminSession } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";
import {
  getPublishedProjects,
  getAllProjectsForAdmin,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  togglePublishProject,
} from "@/lib/projects-service";
import { resolveVideoMetadata, isSafePublicUrl } from "@/lib/video-metadata";
import {
  deleteCvDocument,
  downloadCvStorageBlob,
  getAllCvDocumentsForAdmin,
  getCvDocumentById,
  getPublishedCvDocument,
  PUBLIC_CV_DOWNLOAD_FILENAME,
  updateCvDocumentState,
  uploadAndReplaceCvDocument,
} from "@/lib/cv-service";
import { PortfolioProject } from "@/lib/portfolio-data";
import { contactRoute } from "./routes/contact";
import { uploadScreenshotRoute } from "./routes/upload-screenshot";

type AppVariables = {
  adminUser: User;
};

// Fast in-memory cache for public projects list (auto-invalidated on any admin mutation)
const PROJECTS_CACHE_TTL_MS = 30 * 1000;
let cachedPublishedProjects: { data: PortfolioProject[]; expiresAt: number } | null = null;

export function invalidatePublishedProjectsCache() {
  cachedPublishedProjects = null;
}

export const app = new Hono<{ Variables: AppVariables }>().basePath("/api");

// Global security header middleware
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
});

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// 1. GET /api/projects — Ultra-fast public projects endpoint with in-memory + CDN cache
app.get("/projects", async (c) => {
  try {
    const now = Date.now();
    if (cachedPublishedProjects && cachedPublishedProjects.expiresAt > now) {
      c.header("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      c.header("X-Cache", "HIT");
      return c.json({ projects: cachedPublishedProjects.data });
    }

    const projects = await getPublishedProjects();
    cachedPublishedProjects = {
      data: projects,
      expiresAt: now + PROJECTS_CACHE_TTL_MS,
    };

    c.header("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    c.header("X-Cache", "MISS");
    return c.json({ projects });
  } catch {
    return c.json({ projects: [] }, 500);
  }
});

// 2. POST /api/contact — Contact enquiry & courtesy receipt delivery
app.route("/contact", contactRoute);

// 3. GET /api/cv/pdf — Public CV PDF streaming & download (with admin preview support)
app.get("/cv/pdf", async (c) => {
  try {
    const isDownload = c.req.query("download") === "1" || c.req.query("download") === "true";
    const isPreview = c.req.query("preview") === "1";
    const requestedId = c.req.query("id")?.trim() || "";

    let targetDoc = null;

    if (isPreview && requestedId) {
      const { user, isAdmin } = await verifyAdminSession();
      if (!user || !isAdmin) {
        c.header("Cache-Control", "no-store");
        return c.json(
          { error: "Unauthorized: Admin session required to preview unpublished CV documents." },
          401
        );
      }
      targetDoc = await getCvDocumentById(requestedId);
    } else {
      targetDoc = await getPublishedCvDocument();
    }

    if (!targetDoc) {
      c.header("Cache-Control", "no-store");
      return c.json({ error: "No published Curriculum Vitae PDF is currently active." }, 404);
    }

    const blob = await downloadCvStorageBlob(targetDoc.storage_path);
    if (!blob) {
      c.header("Cache-Control", "no-store");
      return c.json({ error: "CV PDF file could not be retrieved from storage." }, 404);
    }

    const arrayBuffer = await blob.arrayBuffer();
    const dispositionType = isDownload ? "attachment" : "inline";

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${PUBLIC_CV_DOWNLOAD_FILENAME}"`,
        "Content-Length": String(arrayBuffer.byteLength),
        "Cache-Control": isPreview
          ? "private, no-store"
          : "public, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    c.header("Cache-Control", "no-store");
    return c.json({ error: "Unable to serve CV PDF at this time." }, 500);
  }
});

// ============================================================================
// ADMIN ROUTES & CENTRALIZED AUTHENTICATION MIDDLEWARE
// ============================================================================

// Admin Logout (does not require active admin check to sign out session cookies)
app.post("/admin/auth/logout", async (c) => {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return c.json({ success: true });
});

// Centralized Admin Auth Guard for all other /api/admin/* endpoints
app.use("/admin/*", async (c, next) => {
  if (c.req.path === "/api/admin/auth/logout") {
    return next();
  }

  const { user, isAdmin, error } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return c.json(
      { error: error || "Unauthorized: Admin privileges required" },
      401
    );
  }

  c.set("adminUser", user);
  await next();
});

// 4. GET & POST /api/admin/projects
app.get("/admin/projects", async (c) => {
  try {
    const rawPage = parseInt(c.req.query("page") || "1", 10);
    const rawPageSize = parseInt(c.req.query("pageSize") || "50", 10);
    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const pageSize = Number.isFinite(rawPageSize) ? Math.min(100, Math.max(1, rawPageSize)) : 50;
    const rawType = c.req.query("type") || "all";
    const type: "all" | "video" | "web" =
      rawType === "video" || rawType === "web" ? rawType : "all";
    const rawStatus = c.req.query("status") || "all";
    const status: "all" | "published" | "draft" =
      rawStatus === "published" || rawStatus === "draft" ? rawStatus : "all";
    const search = (c.req.query("q") || "").slice(0, 100);
    const rawSort = c.req.query("sort") || "priority";
    const sortBy: "priority" | "newest" | "title" =
      rawSort === "newest" || rawSort === "title" ? rawSort : "priority";

    const result = await getAllProjectsForAdmin({
      page,
      pageSize,
      type,
      status,
      search,
      sortBy,
    });

    return c.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch projects";
    return c.json({ error: message }, 500);
  }
});

app.post("/admin/projects", async (c) => {
  try {
    const body = await c.req.json();
    const project = await createProject(body);
    invalidatePublishedProjectsCache();
    return c.json({ project }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    return c.json({ error: message }, 400);
  }
});

// 5. GET, PUT, PATCH, DELETE /api/admin/projects/:id
app.get("/admin/projects/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const project = await getProjectById(id);
    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }
    return c.json({ project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch project";
    return c.json({ error: message }, 500);
  }
});

app.put("/admin/projects/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    const updated = await updateProject(id, body);
    invalidatePublishedProjectsCache();
    return c.json({ project: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update project";
    return c.json({ error: message }, 400);
  }
});

app.patch("/admin/projects/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await c.req.json();
    if (typeof body.is_published === "boolean") {
      const updated = await updateProject(id, {
        is_published: body.is_published,
        published_at: body.is_published ? new Date().toISOString() : null,
      });
      invalidatePublishedProjectsCache();
      return c.json({ project: updated });
    } else {
      const existing = await getProjectById(id);
      if (!existing) {
        return c.json({ error: "Project not found" }, 404);
      }
      const updated = await togglePublishProject(id, existing.is_published);
      invalidatePublishedProjectsCache();
      return c.json({ project: updated });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle publish";
    return c.json({ error: message }, 400);
  }
});

app.delete("/admin/projects/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await deleteProject(id);
    invalidatePublishedProjectsCache();
    return c.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return c.json({ error: message }, 400);
  }
});

// 6. POST /api/admin/resolve-video
app.post("/admin/resolve-video", async (c) => {
  try {
    const { url, title } = await c.req.json();

    if (!url || typeof url !== "string") {
      return c.json({ error: "Valid video URL is required" }, 400);
    }

    if (!isSafePublicUrl(url)) {
      return c.json({ error: "Invalid or restricted URL format" }, 400);
    }

    const meta = await resolveVideoMetadata(url, title || "");
    return c.json({ meta });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resolve video metadata";
    return c.json({ error: message }, 500);
  }
});

// 7. POST /api/admin/upload-screenshot
app.route("/admin/upload-screenshot", uploadScreenshotRoute);

// 8. GET, POST, PATCH, DELETE /api/admin/cv
app.get("/admin/cv", async (c) => {
  try {
    const documents = await getAllCvDocumentsForAdmin();
    const activeDocument = documents.find((doc) => doc.is_published) || null;
    return c.json({ documents, activeDocument });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load CV documents";
    return c.json({ error: message }, 500);
  }
});

app.post("/admin/cv", async (c) => {
  try {
    const adminUser = c.get("adminUser");
    const formData = await c.req.formData();
    const fileEntry = formData.get("file");

    if (!fileEntry || !(fileEntry instanceof File)) {
      return c.json({ error: "Please select a valid PDF file to upload." }, 400);
    }

    const title = formData.get("title")?.toString() || "Kamrul Islam — Curriculum Vitae";
    const versionLabel = formData.get("versionLabel")?.toString() || null;
    const publishParam = formData.get("publishImmediately")?.toString();
    const publishImmediately = publishParam !== "false";

    const document = await uploadAndReplaceCvDocument({
      file: fileEntry,
      title,
      versionLabel,
      publishImmediately,
      uploadedBy: adminUser.id,
    });

    return c.json({ document }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload CV document";
    return c.json({ error: message }, 400);
  }
});

app.patch("/admin/cv", async (c) => {
  try {
    const body = await c.req.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      return c.json({ error: "CV document ID is required." }, 400);
    }

    const document = await updateCvDocumentState(id, {
      is_published: typeof body.is_published === "boolean" ? body.is_published : undefined,
      title: typeof body.title === "string" ? body.title : undefined,
      version_label:
        body.version_label === null || typeof body.version_label === "string"
          ? body.version_label
          : undefined,
    });

    return c.json({ document });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update CV document";
    return c.json({ error: message }, 400);
  }
});

app.delete("/admin/cv", async (c) => {
  try {
    let id = c.req.query("id")?.trim() || "";

    if (!id) {
      try {
        const body = await c.req.json();
        if (typeof body.id === "string") id = body.id.trim();
      } catch {
        // ignore empty body
      }
    }

    if (!id) {
      return c.json({ error: "CV document ID is required." }, 400);
    }

    await deleteCvDocument(id);
    return c.json({ deleted: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete CV document";
    return c.json({ error: message }, 400);
  }
});
