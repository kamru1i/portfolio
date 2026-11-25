import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import {
  createProjectSchema,
  patchProjectSchema,
  updateProjectSchema,
} from "./project-schemas";
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
import {
  clearFailedLoginAttempts,
  isLoginRateLimited,
  recordFailedLoginAttempt,
} from "@/lib/rate-limit";
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

const adminLoginSchema = z.object({
  email: z.string({ error: "Email and password are required." }).trim().min(1, "Email and password are required.").max(200),
  password: z.string({ error: "Email and password are required." }).min(1, "Email and password are required.").max(500),
});

const resolveVideoSchema = z.object({
  url: z.string({ error: "Valid video URL is required" }).trim().min(1, "Valid video URL is required").max(2000),
  title: z.string().max(200).optional(),
});

const cvPatchSchema = z.object({
  id: z.string({ error: "CV document ID is required." }).trim().min(1, "CV document ID is required."),
  is_published: z.boolean().optional(),
  title: z.string().max(140).optional(),
  version_label: z.string().max(60).nullable().optional(),
});

const inquiryStatusPatchSchema = z.object({
  status: z.enum(["unread", "read", "replied", "archived"], {
    error: "Invalid inquiry status value.",
  }),
});
const ADMIN_UI_HINT_COOKIE = "admin_ui_hint";

function getClientIp(headers: Headers): string {
  const nfIp = headers.get("x-nf-client-connection-ip");
  if (nfIp) return nfIp.trim();
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown-ip";
}

function isTrustedAdminOrigin(originHeader: string | undefined, hostHeader: string | undefined): boolean {
  if (!originHeader) return false;
  let originUrl: URL;
  try {
    originUrl = new URL(originHeader);
  } catch {
    return false;
  }

  const isProd = process.env.NODE_ENV === "production";
  if (isProd && originUrl.protocol !== "https:") {
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
    !isProd &&
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
    const hostHeader =
      process.env.NODE_ENV === "production"
        ? c.req.header("host")
        : c.req.header("x-forwarded-host") || c.req.header("host");
    if (!isTrustedAdminOrigin(candidateOrigin, hostHeader)) {
      return c.json(
        { error: "Forbidden: Untrusted or missing request origin." },
        403
      );
    }
  }

  if (
    c.req.path === "/api/admin/auth/session" ||
    c.req.path === "/api/admin/auth/logout" ||
    c.req.path === "/api/admin/auth/login"
  ) {
    return next();
  }

  const { user, isAdmin } = await verifyAdminSession();
  if (!user || !isAdmin) {
    return c.json(
      { error: "Unauthorized: Admin privileges required." },
      401
    );
  }

  c.set("adminUser", user);
  await next();
});

// Admin Session Status Probe (never leaks user UUID, email, or table details)
app.get("/admin/auth/session", async (c) => {
  try {
    const { user, isAdmin } = await verifyAdminSession();
    if (user && isAdmin) {
      setCookie(c, ADMIN_UI_HINT_COOKIE, "1", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
      });
      return c.json({ isAdmin: true });
    }
    deleteCookie(c, ADMIN_UI_HINT_COOKIE, { path: "/" });
    return c.json({ isAdmin: false });
  } catch {
    deleteCookie(c, ADMIN_UI_HINT_COOKIE, { path: "/" });
    return c.json({ isAdmin: false });
  }
});

// Admin Login (protected by CSRF origin guard & IP brute-force rate limiter)
app.post("/admin/auth/login", async (c) => {
  const clientIp = getClientIp(c.req.raw.headers);
  if (await isLoginRateLimited(clientIp)) {
    return c.json(
      { error: "Too many sign-in attempts. Please wait 15 minutes before trying again." },
      429
    );
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return c.json({ error: "Authentication service is temporarily unavailable." }, 500);
    }

    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsedLogin = adminLoginSchema.safeParse(rawBody);
    if (!parsedLogin.success) {
      return c.json(
        { error: parsedLogin.error.issues[0]?.message || "Email and password are required." },
        400
      );
    }
    const { email, password } = parsedLogin.data;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      await recordFailedLoginAttempt(clientIp);
      return c.json({ error: "Invalid email or password." }, 401);
    }

    const { data: adminRecord, error: adminErr } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (adminErr || !adminRecord) {
      await recordFailedLoginAttempt(clientIp);
      await supabase.auth.signOut();
      return c.json(
        {
          error:
            "Access Denied: Your account does not have administrator privileges.",
        },
        403
      );
    }

    await clearFailedLoginAttempts(clientIp);
    setCookie(c, ADMIN_UI_HINT_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
    });

    return c.json({ ok: true });
  } catch (err: unknown) {
    const isClientJsonError =
      err instanceof Error &&
      (err.message === "Request JSON payload exceeds the 64 KB limit." ||
        err.message === "Malformed JSON request body.");
    if (isClientJsonError) {
      return c.json({ error: err.message }, 400);
    }
    return c.json({ error: "Authentication failed." }, 500);
  }
});

// Admin Logout (does not require active admin check to sign out session cookies, protected by CSRF guard above)
app.post("/admin/auth/logout", async (c) => {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  deleteCookie(c, ADMIN_UI_HINT_COOKIE, { path: "/" });
  return c.json({ success: true });
});

// 4. GET & POST /api/admin/projects
app.get("/admin/projects", async (c) => {
  try {
    const rawPage = parseInt(c.req.query("page") || "1", 10);
    const rawPageSize = parseInt(c.req.query("pageSize") || "50", 10);
    const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
    const pageSize = Number.isFinite(rawPageSize) ? Math.min(500, Math.max(1, rawPageSize)) : 50;
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
  } catch {
    return c.json({ error: "Failed to load projects." }, 500);
  }
});

app.post("/admin/projects", async (c) => {
  try {
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = createProjectSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "Invalid project payload." },
        400
      );
    }
    const project = await createProject(parsed.data);
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
  } catch {
    return c.json({ error: "Failed to load project." }, 500);
  }
});

app.put("/admin/projects/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = updateProjectSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "Invalid project update payload." },
        400
      );
    }
    const updated = await updateProject(id, parsed.data);
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
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = patchProjectSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "Invalid publish status payload." },
        400
      );
    }
    if (typeof parsed.data.is_published === "boolean") {
      const updated = await updateProject(id, {
        is_published: parsed.data.is_published,
        published_at: parsed.data.is_published ? new Date().toISOString() : null,
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
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = resolveVideoSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "Valid video URL is required" },
        400
      );
    }

    const { url, title } = parsed.data;

    if (!isSafePublicUrl(url)) {
      return c.json({ error: "Invalid or restricted URL format" }, 400);
    }

    const meta = await resolveVideoMetadata(url, title || "");
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
  } catch {
    return c.json({ error: "Failed to load documents." }, 500);
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
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = cvPatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "CV document ID is required." },
        400
      );
    }

    const { id, is_published, title, version_label } = parsed.data;
    const document = await updateCvDocumentState(id, {
      is_published,
      title,
      version_label,
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
  } catch {
    return c.json({ error: "Failed to load inquiries." }, 500);
  }
});

app.patch("/admin/inquiries/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const rawBody = await readBoundedJson<unknown>(c.req.raw);
    const parsed = inquiryStatusPatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return c.json(
        { error: parsed.error.issues[0]?.message || "Invalid inquiry status value." },
        400
      );
    }
    const inquiry = await updateInquiryStatus(id, parsed.data.status as InquiryStatus);
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
