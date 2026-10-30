# 05 — Code Quality & Architecture Audit

**Audit Date:** 2026-10-31  
**Stack:** Next.js `16.4.3` (App Router, React `19.2.3`), TypeScript `5`, Tailwind CSS `4`, Hono `4.12.14` (`/api/[[...route]]`), Supabase SSR/PostgREST/Storage, Framer Motion & Lenis.

---

## 1. Architectural Assessment

The codebase follows a clean layered architecture:
- **Presentation (`src/app/`, `src/components/`):** Server Components fetch initial portfolio/CV state directly via service modules and pass hydrated props to interactive Client Components while preserving the approved Patrick Jane + Aurexa visual design and section order (`Hero → Projects & Works → About → Services → Milestones & Recognition → Stats / Counters → FAQ → Footer`).
- **API Gateway (`src/app/api/[[...route]]/route.ts` → `src/server/hono/app.ts`):** Unified Hono router enforcing admin session verification, CSRF origin checks, bounded JSON parsing, magic-byte upload inspection, and structured validation.
- **Domain Services (`src/lib/projects-service.ts`, `cv-service.ts`, `inquiries-service.ts`, `video-metadata.ts`):** Encapsulate Supabase queries, cache invalidation (`revalidatePath` / `revalidateTag`), URL sanitization, and graceful fallback when local dev lacks DB credentials.
- **Request Proxy (`src/proxy.ts`):** Next.js 16 `proxy.ts` convention refreshes Supabase auth cookies and guards `/admin` routes.

---

## 2. Structural Bugs & Duplications Resolved

### 1. Eliminated ~700 Lines of Duplicated Admin Form Code (`ProjectEditorForm.tsx`)
- **Problem:** `src/app/admin/(dashboard)/projects/new/page.tsx` (799 lines) and `src/app/admin/(dashboard)/projects/[id]/edit/EditProjectForm.tsx` (746 lines) duplicated nearly identical form state, screenshot upload handlers, video auto-resolution logic, and JSX — and both hardcoded `const [previewMode] = useState(...)` with no UI toggle, making it impossible for an admin to switch a web project between `iframe` and `fallback` modes.
- **Refactoring:** Extracted `src/components/admin/ProjectEditorForm.tsx` (`mode="create" | "edit"`), added the 2-option **Interactive Modal Preview Mode** selector (`Live Interactive Iframe` vs `Protected / Fallback Card`), added client-side slug pattern validation, and reduced `new/page.tsx` (5 lines) and `EditProjectForm.tsx` (6 lines) to clean thin wrappers.

### 2. Fixed Broken YouTube Embeds on Video Detail Pages (`resolvePlayableEmbedUrl`)
- **Problem:** `src/app/projects/video/[slug]/page.tsx` assigned `const ytId = extractYouTubeId(...)` (which returns `{ videoId, isShort }`) directly into `` `https://www.youtube.com/embed/${ytId}` ``, rendering `/embed/[object Object]` on all 5 live YouTube case study pages. Meanwhile, `VideoPlayerModal.tsx` maintained its own separate embed URL builder.
- **Refactoring:** Centralized `resolvePlayableEmbedUrl(url, options)` in `src/lib/video-metadata.ts` and shared it across `src/app/projects/video/[slug]/page.tsx` and `src/components/works/VideoPlayerModal.tsx`.

### 3. Fixed Duplicate Cards & Static-Fallback Resurrection in Project Services
- **Problem:**
  - `ProjectsPageContent.tsx` appended static `PORTFOLIO_DATA.showcaseProjects` entries onto live Supabase results, causing duplicate cards when slugs differed slightly and leaking unpublished projects.
  - `getProjectBySlugOrId()` fell back to static data even when Supabase was populated, exposing unpublished/deleted records.
  - `createProject` / `updateProject` / `deleteProject` did not trigger Next.js route/tag revalidation.
- **Refactoring:** Removed static re-append in `ProjectsPageContent.tsx`, gated `getProjectBySlugOrId()` fallback on `(publishedCount ?? 0) === 0`, preserved case-insensitive `.ilike("slug", trimmedKey)` for mixed-case live slugs (`Microplastic-BioBag-Kamrul-I`), and added `revalidateProjectRoutes()` across all admin project mutations.

### 4. Fixed `ProjectPreviewModal` Protected-Site Fallback Mode (`Web Wing`)
- **Problem:** `ProjectPreviewModal.tsx` initialized `activeMode` to `"live"` unconditionally, attempting to iframe-embed sites configured with `previewMode: "fallback"` / `canEmbed: false` (such as `Web Wing`).
- **Refactoring:** Derived initial modal mode from `project.previewMode === "fallback" || project.canEmbed === false ? "summary" : "live"`.

### 5. Centralized URL, JSON-LD & Clock Utilities
- **`src/lib/url-utils.ts`:** Extracted `getDisplayDomain(url, fallback)` (replacing 3 duplicate implementations in `WebCaseStudyCard.tsx`, `ProjectPreviewModal.tsx`, and `admin/page.tsx`) and `serializeJsonLd(data)` (used across all 7 JSON-LD route files).
- **`src/hooks/useDhakaClock.ts`:** Extracted a shared `useSyncExternalStore` clock subscriber shared by `Navigation.tsx` and `CurtainFooter.tsx`, eliminating duplicate `setInterval(..., 1000)` timers.

### 6. Accessibility Improvements
- **`src/components/contact/ContactFaqSection.tsx`:** Converted non-semantic clickable FAQ headers into keyboard-accessible `<button type="button" aria-expanded aria-controls>` triggers paired with `role="region"` answer panels.
- **`src/components/common/IntroCurtain.tsx`, `SmoothScroll.tsx`, `Rotating3DCylinder.tsx`, `CurtainFooter.tsx`:** Added `prefers-reduced-motion: reduce` support across motion-heavy surfaces.
