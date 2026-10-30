# 04 — Application Security Audit

**Audit Date:** 2026-10-31  
**Scope:** Next.js 16 App Router, Hono API routes (`/api/*`), Supabase Auth/PostgREST/Storage integration, RLS policies, client rendering sinks, and `pnpm` dependency graph.

---

## 1. Executive Summary

| Severity | Found | Remediated in Code | Pending Manual DB / Infra Action |
| :--- | :---: | :---: | :---: |
| **High** | 3 | 3 | 0 |
| **Medium** | 5 | 5 | 0 |
| **Low / Defense-in-Depth** | 3 | 2 | 1 (Distributed rate-limiter store if scaling multi-region serverless) |

`pnpm audit` status after remediation: **`No known vulnerabilities found` (Exit code `0`)**.

---

## 2. Detailed Findings & Remediations

### [SEC-01] High — Dependency Vulnerability in `zod@4.6.5`
- **Evidence:** `pnpm audit` reported High-severity advisory `1243066` affecting `zod < 4.6.7`.
- **Remediation:** Upgraded `zod` to `^4.6.7` (`4.6.7` locked in `pnpm-lock.yaml`). Re-ran `pnpm audit` -> `0` vulnerabilities.

### [SEC-02] High — SSRF Open-Redirect & Hostname-Spoofing Bypass in Video Metadata Resolver
- **Location:** `src/lib/video-metadata.ts` (invoked by `POST /api/admin/resolve-video`)
- **Vulnerability:**
  1. `fetch()` used default `redirect: "follow"`, allowing an allowed public HTTPS URL to `302` redirect into `http://169.254.169.254/latest/meta-data/` or internal RFC1918/loopback services.
  2. `isSafePublicUrl()` permitted cleartext `http:`, missed `0.0.0.0/8`, CGNAT `100.64.0.0/10`, `198.18.0.0/15`, multicast `>=224`, dotted-octal/hex IPv4 (`0177.0.0.1`, `0x7f.0.0.1`), and `metadata.google.internal`.
  3. Provider checks used substring `.includes("youtube.com")` (bypassable via `evil-youtube.com`) and interpolated unvalidated `videoId` values into upstream oEmbed/thumbnail URLs.
- **Remediation:**
  - Enforced `https:`-only protocol, strict IPv4/IPv6/octal/hex/CGNAT/metadata blocklists, and `matchesDomain()` exact/subdomain boundary matching.
  - Added `safePublicFetch()` with `redirect: "manual"`, re-validating every `Location` hop through `isSafePublicUrl()` (max 2 HTTPS hops, `3.5s` timeout).
  - Enforced `YOUTUBE_ID_REGEX` (`/^[A-Za-z0-9_-]{6,20}$/`), `VIMEO_ID_REGEX` (`/^\d{1,20}$/`), `readSafeJson()` (`64 KB` response cap), and `sanitizeRemoteHttpsUrl()` on oEmbed `thumbnail_url`.

### [SEC-03] High — Cross-Site Request Forgery (CSRF) & Unbounded JSON Bodies on `/api/admin/*`
- **Location:** `src/server/hono/app.ts`
- **Vulnerability:** Mutating admin endpoints (`POST`, `PUT`, `PATCH`, `DELETE` under `/api/admin/*`, including `/api/admin/auth/logout`) relied solely on ambient cookies without verifying `Origin` / `Referer` against the host, and called `c.req.json()` without a payload byte cap.
- **Remediation:**
  - Added `isTrustedAdminOrigin(c)` middleware check for all non-`GET/HEAD/OPTIONS` `/api/admin/*` requests, comparing request `Origin` (or fallback `Referer` origin) against `Host` / `X-Forwarded-Host` and `NEXT_PUBLIC_SITE_URL`, returning `403` on mismatch.
  - Added `readBoundedJson(c, 64 * 1024)` (`64 KB` max) across all JSON `/api/admin/*` endpoints (`413 Payload Too Large` on overflow).

### [SEC-04] Medium — Public Contact Endpoint Payload DoS, PII Logging & Error Leakage
- **Location:** `src/server/hono/routes/contact.ts`
- **Vulnerability:** Unauthenticated `POST /api/contact` parsed unbounded JSON prior to Zod validation, logged visitor email addresses via `console.warn` when saved to backup, and leaked raw Resend/exception messages in `500` JSON responses.
- **Remediation:** Enforced a `32 KB` raw body cap prior to `JSON.parse`, removed visitor email PII from `console.warn`, returned generic public error messages on `500`, and renamed delivery flag to `providerAccepted`.

### [SEC-05] Medium — Stored SVG XSS & Unvalidated Slugs/UUIDs in Project & CV Services
- **Locations:** `src/lib/projects-service.ts`, `src/lib/cv-service.ts`
- **Vulnerability:** `sanitizeProjectUrl` permitted `.svg` image URLs (executable script context if opened top-level), `slug` lacked strict character allowlisting, and CV storage/DB helpers accepted arbitrary string IDs/paths.
- **Remediation:** Blocked `.svg` URLs on `preview_image_url` (except safe internal generated `data:image/svg+xml` fallbacks), enforced `SAFE_SLUG_REGEX` (`/^[A-Za-z0-9-]+$/`), validated `UUID_REGEX` in `projects-service.ts` and `cv-service.ts`, enforced `cv/` prefix without `..` in `downloadCvStorageBlob()`, and standardized `serializeJsonLd()` (`<` -> `\u003c`) across every JSON-LD `<script>` tag.

### [SEC-06] Medium — Unpublished / Deleted Project Exposure via Static Fallback
- **Location:** `src/lib/projects-service.ts` (`getProjectBySlugOrId`)
- **Vulnerability:** When an admin unpublished or deleted a project in Supabase, direct requests to `/projects/web/[slug]` or `/projects/video/[slug]` fell back to `PORTFOLIO_DATA.showcaseProjects` and still rendered the page publicly.
- **Remediation:** `getProjectBySlugOrId` now checks whether `public.projects` has `(count ?? 0) > 0` published rows; when live DB records exist, missing/unpublished slugs return `null` (`404 Not Found`) instead of falling back to static seed data.

### [SEC-07] Medium — Supabase RLS `WITH CHECK (true)` & Mutable Function `search_path`
- **Location:** `supabase/migrations/20261031000000_harden_rls_and_functions.sql`
- **Live Verification:** Read-only REST probe confirmed `anon` `SELECT` on `public.contact_inquiries` returns `200 []` (RLS properly blocks public reads). However, earlier SQL migrations defined `public.is_admin()` (`SECURITY DEFINER`) and `public.handle_updated_at()` without pinning `search_path`, and `"Public can submit contact inquiries"` used `WITH CHECK (true)`.
- **Remediation:** Authored idempotent, non-destructive migration `supabase/migrations/20261031000000_harden_rls_and_functions.sql` which:
  1. Pins `SET search_path = public, pg_temp` on `public.is_admin()` and `public.handle_updated_at()`.
  2. Adds `NOT VALID` length `CHECK` constraints on `public.contact_inquiries` (preserving all existing rows while validating new inserts).
  3. Replaces `"Public can submit contact inquiries"` `WITH CHECK` to require `status = 'unread'` and bounded non-empty fields.
- **Live Deployment Verified:** Applied directly to remote Supabase PostgreSQL via `npx supabase db push` (`20261031000000_harden_rls_and_functions.sql`), followed by `--dry-run` verification confirming `Remote database is up to date.` (`upToDate: true`).

---

## 3. Security Headers, CSP & Rate-Limiting Architecture Notes

- **Active Headers (`next.config.ts` & `netlify.toml`):** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive `Permissions-Policy` (`camera=(), microphone=(), geolocation=()`).
- **CSP Note:** Because Next.js App Router emits inline RSC hydration scripts without per-request dynamic nonces on static/ISR routes, enforcing a strict `script-src` without `'unsafe-inline'` would break hydration unless every route is forced dynamic with nonce middleware. All dynamic data sinks (`serializeJsonLd`, URL sanitizers, React auto-escaping) are sanitized at source.
- **Rate Limiting Note:** `/api/contact` and `/api/admin/auth/login` use bounded in-memory sliding windows per serverless instance. If traffic scales across multi-instance serverless workers, attach Upstash Redis (`@upstash/ratelimit`) as a drop-in shared store.
