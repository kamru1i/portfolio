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
  DOCUMENT_CATEGORIES,
  downloadCvStorageBlob,
  getAllCvDocumentsForAdmin,
  getCvDocumentById,
  getDocumentCategory,
  getPublishedCvDocument,
  normalizeDocumentCategory,
  updateCvDocumentState,
  uploadAndReplaceCvDocument,
} from "@/lib/cv-service";
import { PortfolioProject } from "@/lib/portfolio-data";
import {
  deleteInquiry,
  getAllInquiriesForAdmin,
  updateInquiryStatus,
} from "@/lib/inquiries-service";
import { InquiryStatus } from "@/types/database";
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

// 3. GET /api/cv/pdf — Public document PDF streaming & download (with admin preview & multi-category support)
app.get("/cv/pdf", async (c) => {
  try {
    const isDownload = c.req.query("download") === "1" || c.req.query("download") === "true";
    const isPreview = c.req.query("preview") === "1";
    const requestedId = c.req.query("id")?.trim() || "";
    const requestedCategory = normalizeDocumentCategory(c.req.query("type"));

    let targetDoc = null;

    if (isPreview && requestedId) {
      const { user, isAdmin } = await verifyAdminSession();
      if (!user || !isAdmin) {
        c.header("Cache-Control", "no-store");
        return c.json(
          { error: "Unauthorized: Admin session required to preview unpublished documents." },
          401
        );
      }
      targetDoc = await getCvDocumentById(requestedId);
    } else {
      targetDoc = await getPublishedCvDocument(requestedCategory);
    }

    if (!targetDoc) {
      c.header("Cache-Control", "no-store");
      return c.json(
        { error: `No published ${DOCUMENT_CATEGORIES[requestedCategory].label} PDF is currently active.` },
        404
      );
    }

    const blob = await downloadCvStorageBlob(targetDoc.storage_path);
    if (!blob) {
      c.header("Cache-Control", "no-store");
      return c.json({ error: "PDF file could not be retrieved from storage." }, 404);
    }

    const docCategory = getDocumentCategory(targetDoc);
    const downloadFilename = DOCUMENT_CATEGORIES[docCategory].downloadFilename;
    const arrayBuffer = await blob.arrayBuffer();
    const dispositionType = isDownload ? "attachment" : "inline";

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${dispositionType}; filename="${downloadFilename}"`,
        "Content-Length": String(arrayBuffer.byteLength),
        "Cache-Control": isPreview
          ? "private, no-store"
          : "public, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    c.header("Cache-Control", "no-store");
    return c.json({ error: "Unable to serve PDF document at this time." }, 500);
  }
});

const MAX_ADMIN_JSON_BYTES = 64 * 1024;

function isTrustedAdminOrigin(originHeader: string | undefined, hostHeader: string | undefined): boolean {
  if (!originHeader) return false;
  let originUrl: URL;
  try {
    originUrl = new URL(originHeader);
  } catch {
    return false;
  }

  const originHost = originUrl.host.toLowerCase();
  const normalizedReqHost = (hostHeader || "").split(",")[0]?.trim().toLowerCase() || "";
  if (normalizedReqHost && originHost === normalizedReqHost) {
    return true;
  }

  const allowedOrigins = new Set<string>([
    "https://kamrulislam.me",
    "https://www.kamrulislam.me",
  ]);
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) {
    try {
      allowedOrigins.add(new URL(configuredSiteUrl).origin.toLowerCase());
    } catch {
      // ignore invalid NEXT_PUBLIC_SITE_URL
    }
  }

  if (allowedOrigins.has(originUrl.origin.toLowerCase())) {
    return true;
  }

  if (
    process.env.NODE_ENV !== "production" &&
    (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1")
  ) {
    return true;
  }

  return false;
}

async function readBoundedJson<T = Record<string, unknown>>(
  req: Request,
  maxBytes = MAX_ADMIN_JSON_BYTES
): Promise<T> {
  const raw = await req.text();
  if (raw.length > maxBytes) {
    throw new Error("Request JSON payload exceeds the 64 KB limit.");
  }
  if (!raw.trim()) {
    return {} as T;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("Malformed JSON request body.");
  }
}

// ============================================================================
// ADMIN ROUTES & CENTRALIZED AUTHENTICATION + CSRF MIDDLEWARE
// ============================================================================

// Centralized Cache-Control, CSRF Origin Guard & Admin Auth Guard for /api/admin/*
app.use("/admin/*", async (c, next) => {
  c.header("Cache-Control", "no-store, no-cache, must-revalidate, private");

  const method = c.req.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    const origin = c.req.header("origin");
    const referer = c.req.header("referer");
    let candidateOrigin = origin;
    if (!candidateOrigin && referer) {
      try {
        candidateOrigin = new URL(referer).origin;
      } catch {
        candidateOrigin = undefined;
      }
    }
    const hostHeader = c.req.header("x-forwarded-host") || c.req.header("host");
    if (!isTrustedAdminOrigin(candidateOrigin, hostHeader)) {
      return c.json(
        { error: "Forbidden: Untrusted or missing request origin." },
        403
      );
    }
  }

  if (
    c.req.path === "/api/admin/auth/logout" ||
    c.req.path === "/api/admin/auth/login"
  ) {
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

// Admin Login (protected by CSRF origin guard above)
app.post("/admin/auth/login", async (c) => {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return c.json({ error: "Supabase is not configured." }, 500);
    }

    const body = await readBoundedJson<{ email?: unknown; password?: unknown }>(
      c.req.raw
    );
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return c.json({ error: "Email and password are required." }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return c.json(
        { error: error?.message || "Invalid email or password." },
        401
      );
    }

    const { data: adminRecord, error: adminErr } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      await supabase.auth.signOut();
      return c.json(
        {
          error:
            "Access Denied: Your account does not have administrator privileges.",
        },
        403
      );
    }

    return c.json({ ok: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Authentication failed.";
    return c.json({ error: message }, 400);
  }
});

// Admin Logout (does not require active admin check to sign out session cookies, protected by CSRF guard above)
app.post("/admin/auth/logout", async (c) => {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return c.json({ success: true });
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
    const body = await readBoundedJson(c.req.raw);
    const project = await createProject(body as Parameters<typeof createProject>[0]);
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
    const body = await readBoundedJson(c.req.raw);
    const updated = await updateProject(id, body as Parameters<typeof updateProject>[1]);
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
    const body = await readBoundedJson<{ is_published?: boolean }>(c.req.raw);
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
    const { url, title } = await readBoundedJson<{ url?: unknown; title?: unknown }>(c.req.raw);

    if (!url || typeof url !== "string") {
      return c.json({ error: "Valid video URL is required" }, 400);
    }

    if (!isSafePublicUrl(url)) {
      return c.json({ error: "Invalid or restricted URL format" }, 400);
    }

    const safeTitle = typeof title === "string" ? title.slice(0, 200) : "";
    const meta = await resolveVideoMetadata(url, safeTitle);
    return c.json({ meta });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to resolve video metadata";
    return c.json({ error: message }, 400);
  }
});

// 7. POST /api/admin/upload-screenshot
app.route("/admin/upload-screenshot", uploadScreenshotRoute);

// 8. GET, POST, PATCH, DELETE /api/admin/cv
app.get("/admin/cv", async (c) => {
  try {
    const rawType = c.req.query("type");
    const categoryFilter = rawType ? normalizeDocumentCategory(rawType) : undefined;
    const documents = await getAllCvDocumentsForAdmin(categoryFilter);
    const activeCategory = categoryFilter || "cv";
    const activeDocument =
      documents.find(
        (doc) => getDocumentCategory(doc) === activeCategory && doc.is_published
      ) || null;
    return c.json({ documents, activeDocument });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load documents";
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

    const category = normalizeDocumentCategory(formData.get("category")?.toString());
    const categoryMeta = DOCUMENT_CATEGORIES[category];
    const title = formData.get("title")?.toString()?.trim() || categoryMeta.defaultTitle;
    const versionLabel = formData.get("versionLabel")?.toString() || null;
    const publishParam = formData.get("publishImmediately")?.toString();
    const publishImmediately = publishParam !== "false";

    const document = await uploadAndReplaceCvDocument({
      file: fileEntry,
      category,
      title,
      versionLabel,
      publishImmediately,
      uploadedBy: adminUser.id,
    });

    return c.json({ document }, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload document";
    return c.json({ error: message }, 400);
  }
});

app.patch("/admin/cv", async (c) => {
  try {
    const body = await readBoundedJson<Record<string, unknown>>(c.req.raw);
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
        const body = await readBoundedJson<Record<string, unknown>>(c.req.raw);
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

// 9. GET, PATCH, DELETE /api/admin/inquiries
app.get("/admin/inquiries", async (c) => {
  try {
    const result = await getAllInquiriesForAdmin();
    return c.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load inquiries";
    return c.json({ error: message }, 500);
  }
});

app.patch("/admin/inquiries/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const body = await readBoundedJson<{ status?: InquiryStatus }>(c.req.raw);
    const status = body.status as InquiryStatus;
    const inquiry = await updateInquiryStatus(id, status);
    return c.json({ inquiry });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update inquiry";
    return c.json({ error: message }, 400);
  }
});

app.delete("/admin/inquiries/:id", async (c) => {
  const id = c.req.param("id");
  try {
    await deleteInquiry(id);
    return c.json({ deleted: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete inquiry";
    return c.json({ error: message }, 400);
  }
});
