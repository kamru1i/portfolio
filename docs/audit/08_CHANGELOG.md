# 08 — Comprehensive Audit & Refactoring Changelog

**Date:** 2026-10-31  
**Summary:** Complete CV content reconciliation (`01112026T1223` Master & Video Editor CVs), security hardening, bug fixes, admin form deduplication, runtime performance optimization, and audit documentation.

---

## 1. Created Files

| File Path | Purpose |
| :--- | :--- |
| `src/lib/url-utils.ts` | Shared `getDisplayDomain(url, fallback)` and XSS-safe `serializeJsonLd(data)` helpers. |
| `src/hooks/useDhakaClock.ts` | Shared `useSyncExternalStore` `Asia/Dhaka` live clock aligned to minute boundaries (`1` wakeup/min vs `120`/min). |
| `src/components/admin/ProjectEditorForm.tsx` | Unified Create/Edit admin project form eliminating ~700 duplicated lines and adding the Web `Preview Mode` (`iframe` vs `fallback`) selector. |
| `supabase/migrations/20261031000000_harden_rls_and_functions.sql` | Non-destructive PostgreSQL migration pinning `search_path` on `is_admin()`/`handle_updated_at()`, adding `NOT VALID` length `CHECK` constraints, and tightening `contact_inquiries` `INSERT` RLS. |
| `docs/audit/01_CV_CONTENT_RECONCILIATION.md` | Authoritative CV fact inventory, conflict resolutions, and privacy redaction rules. |
| `docs/audit/02_WEBSITE_CONTENT_UPDATE_MAP.md` | Route-by-route and component-by-component map of content updates. |
| `docs/audit/03_PREVIOUS_GEMINI_AUDIT_RECONCILIATION.md` | Verification of previous 10 audit items + 6 newly discovered bugs resolved. |
| `docs/audit/04_SECURITY_AUDIT.md` | Severity-rated application security audit and remediation log. |
| `docs/audit/05_CODE_QUALITY_ARCHITECTURE_AUDIT.md` | Architecture review, deduplication summary, and accessibility improvements. |
| `docs/audit/06_PERFORMANCE_OPTIMIZATION.md` | Runtime CPU/GPU, network fetch, clock timer, and `public/` asset optimization report. |
| `docs/audit/07_TESTING_AND_VERIFICATION.md` | Executed verification commands, unit/invariant test coverage, and manual deployment checklist. |
| `docs/audit/08_CHANGELOG.md` | Complete file-by-file changelog of this audit. |

---

## 2. Modified Files

### Dependencies
- **`package.json` & `pnpm-lock.yaml`:** Upgraded `zod` (`^4.6.5` → `^4.6.7`), resolving High-severity advisory `1243066` (`pnpm audit` → `0` vulnerabilities).

### Backend, API & Services
- **`src/lib/video-metadata.ts`:** Enforced HTTPS-only `isSafePublicUrl` (blocking `0.0.0.0/8`, CGNAT, metadata hosts, octal/hex IPv4, IPv6 internal ranges), `matchesDomain` hostname suffix checks, `YOUTUBE_ID_REGEX`/`VIMEO_ID_REGEX`, manual redirect validation (`safePublicFetch`), `64 KB` JSON cap, oEmbed thumbnail sanitization, and exported `resolvePlayableEmbedUrl()`.
- **`src/lib/projects-service.ts`:** Added SVG XSS guard in `sanitizeProjectUrl`, `SAFE_SLUG_REGEX`, `UUID_REGEX`, `revalidateProjectRoutes()` on create/update/delete, and fixed `getProjectBySlugOrId()` so unpublished/deleted DB projects do not resurrect via static fallback.
- **`src/lib/cv-service.ts`:** Added `UUID_REGEX` validation and `cv/` storage path prefix check in `downloadCvStorageBlob()`.
- **`src/server/hono/app.ts`:** Added centralized `isTrustedAdminOrigin` CSRF check on all mutating `/api/admin/*` routes (including logout) and `readBoundedJson` (`64 KB` cap).
- **`src/server/hono/routes/contact.ts`:** Enforced `32 KB` raw body cap, removed visitor email PII from `console.warn`, sanitized `500` error responses, and updated response semantics to `providerAccepted` (`"Enquiry received."`).

### Content Data, Seed & Public Routes
- **`src/lib/portfolio-data.ts`:** Reconciled all 13 live portfolio projects, `Independent Client Projects` (`Current`), `B&F Corporate` (`Previous Employment`, concurrent `2y` IT + `1y` Video), `Robi & Banglalink` (`3 Years Combined Experience`), `BSc` (`Department: Natural Science`, `Subject: Computer Science & Engineering`, `Major: Web Development`, no fabricated graduation year), `counters`, `services`, `faq`, and `/images/Kamrul-I.png`.
- **`supabase/seed.sql`:** Synchronized seed records with verified `01112026T1223` CV facts.
- **`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/contact-us/page.tsx`:** Removed `worksFor: B&F Corporate` and unverified tools (`Runway`, `Midjourney`, `kamrul-islam-dev`), added `Hindi` to language schemas, updated portrait URL to `Kamrul-I.png`, and standardized `serializeJsonLd()`.
- **`src/app/cv/page.tsx`:** Added 3-tier `SKILL_PROFICIENCY_MATRIX` (`Expertise`, `Comfortable`, `Familiar`), removed `Linux Administration` & `Google Workspace`, updated BSc education display, and added `Hindi` (`Conversational`).
- **`src/app/milestones/education/page.tsx`, `src/app/milestones/experience/[slug]/page.tsx`, `src/components/recognitions/AwardsSection.tsx`:** Removed `"Certified Records"` / `"certified degrees"` claims, added `Department` & `Subject` fields, and distinguished `Current Client Work` vs `Previous Employment`.
- **`src/app/projects/video/[slug]/page.tsx`, `src/app/projects/web/[slug]/page.tsx`, `src/app/projects/[slug]/page.tsx`:** Fixed `/embed/[object Object]` YouTube player bug via `resolvePlayableEmbedUrl`, encoded redirect slugs, removed fabricated `"2026"` fallback year, and applied `serializeJsonLd`.

### UI Components, Admin Pages & Performance
- **`src/components/works/ProjectsPageContent.tsx` & `ProjectsAndWorksSection.tsx`:** Removed duplicate static-project merge and skipped redundant `/api/projects` mount re-fetch when hydrated with `initialProjects`.
- **`src/components/works/ProjectPreviewModal.tsx`, `WebCaseStudyCard.tsx`, `VideoPlayerModal.tsx`:** Respected `previewMode: "fallback"` / `canEmbed: false` on modal open (`Web Wing`), shared `getDisplayDomain` & `resolvePlayableEmbedUrl`, and removed `"2026"` year fallback.
- **`src/components/contact/ContactFormSection.tsx` & `ContactFaqSection.tsx`:** Added `?service=` pre-selection, updated confirmation copy to `"Enquiry Received"`, replaced `Runway` with CV-verified AI tools, and upgraded FAQ items to accessible `<button aria-expanded>` controls.
- **`src/app/admin/(dashboard)/projects/new/page.tsx`, `projects/[id]/edit/EditProjectForm.tsx`, `page.tsx`, `inquiries/page.tsx`:** Delegated create/edit forms to `ProjectEditorForm`, shared `getDisplayDomain`, and updated `"Email Delivered ✓"` → `"Provider Accepted ✓"`.
- **`src/components/layout/Navigation.tsx`, `CurtainFooter.tsx`, `src/components/hero/Rotating3DCylinder.tsx`, `src/components/common/IntroCurtain.tsx`, `SmoothScroll.tsx`:** Wired `useDhakaClock`, paused offscreen `CurtainFooter` & `Rotating3DCylinder` RAF loops, fixed `SmoothScroll` unmount RAF leak, and added `prefers-reduced-motion: reduce` support.
