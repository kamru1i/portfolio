# 07 — Testing & Verification Report

**Audit Date:** 2026-10-31  
**Environment:** Windows · Node.js `v24.22.1` · `pnpm` · Next.js `16.4.3` · TypeScript `5`

> **Safety Compliance:** Per operational constraints, no running dev servers were started, stopped, or restarted, no `.next` build artifacts were clobbered, no live Supabase rows were mutated, and no Git commits/pushes were executed.

---

## 1. Executed Automated Checks & Exit Codes

| Check / Command | Scope Verified | Result | Exit Code |
| :--- | :--- | :--- | :---: |
| `pnpm audit` | Full `pnpm-lock.yaml` dependency vulnerability scan after upgrading `zod` (`4.6.5` → `4.6.7`) | `No known vulnerabilities found` | `0` |
| `pnpm exec tsc --noEmit` | Full-project strict TypeScript compilation across all App Router pages, Hono routes, services, hooks, and components | Zero TypeScript errors | `0` |
| `pnpm lint` (`eslint .`) | Next.js 16 + React 19 ESLint rules (including React Hooks rules, accessibility, `@next/next` rules) | Zero warnings, zero errors | `0` |
| `node scratch/verify-all.mjs` | Custom automated security, URL/embed resolution, JSON-LD XSS escaping, and 83-file source-tree CV/privacy invariant suite | **4 / 4 test suites passed** across all `83` source files in `src/` | `0` |
| Read-only Live Supabase REST Probe | Verified live `public.projects` (13 published rows), `public.cv_documents` (1 active row), and `anon` `SELECT` on `public.contact_inquiries` | Confirmed `anon` receives `200 []` on `contact_inquiries` (RLS blocks public read) and reconciled all 13 live project slugs/modes | `0` |
| Live Canonical HTTP `HEAD` Check | Verified `https://www.kamrulislam.me/` vs `https://kamrulislam.me/` redirect chain | Confirmed `301 Moved Permanently` → `https://kamrulislam.me/` (`200 OK`) | `0` |
| `npx supabase db push` | Applied `20261031000000_harden_rls_and_functions.sql` to remote Supabase DB & verified with `--dry-run` | `Finished supabase db push.` → `Remote database is up to date.` (`upToDate: true`) | `0` |

---

## 2. Detailed Coverage of `verify-all.mjs` Assertions

1. **SSRF & URL Sanitizer Unit Tests (`isSafePublicUrl`):**
   - Verified rejection (`false`) of: `http://example.com/...` (cleartext HTTP), `localhost`, `sub.localhost`, `127.0.0.1`, `127.0.0.53`, `0.0.0.0`, `10.0.0.1`, `172.16.0.1`, `172.31.255.255`, `192.168.1.1`, `169.254.169.254` (cloud metadata), `100.64.0.1` / `100.127.255.254` (CGNAT), `198.18.0.1`, `224.0.0.1` (multicast), `0177.0.0.1` (octal IPv4), `0x7f.0.0.1` (hex IPv4), `127.1` (shorthand IPv4), `[::1]`, `[fc00::1]`, `[fe80::1]`, `[::ffff:127.0.0.1]`, `metadata.google.internal`, credentialed URLs (`https://user:pass@...`), and `javascript:` URIs.
   - Verified acceptance (`true`) of valid public `https://` URLs (`youtube.com`, `youtu.be`, `vimeo.com`, `kamrulislam.me`).
2. **Video Provider & Embed Resolution (`detectVideoProvider`, `extractYouTubeId`, `resolvePlayableEmbedUrl`):**
   - Verified `evil-youtube.com` and `youtube.com.evil.tld` are rejected (`"other"`).
   - Verified path-traversal query `?v=../../evil` returns `videoId: null`.
   - Verified `resolvePlayableEmbedUrl` outputs clean `https://www.youtube-nocookie.com/embed/<id>?autoplay=0&rel=0&modestbranding=1` strings with **zero `[object Object]`** interpolation, and returns `null` for direct `.mp4` URLs so `<video>` renders them.
3. **JSON-LD Script Breakout Guard (`serializeJsonLd`):**
   - Verified `</script><script>alert(1)</script>` is escaped to `\u003c/script>\u003cscript>alert(1)\u003c/script>`.
4. **83-File Source-Tree Content & Privacy Invariants (`src/**`):**
   - Verified **zero occurrences** of:
     - Outdated B&F `"Present"` employment claims or `"worksFor"` JSON-LD
     - Unverified tools/skills (`Runway`, `Midjourney`, `ElevenLabs`, `Adobe Audition`, `Google Workspace`, `Linux Administration`, `Office 365`)
     - Fabricated BSc graduation claims (`Graduated: 2021`, `Class of 2021`) or `"4 Years Combined"` Robi/Banglalink overstatement
     - Wrong GitHub handle (`kamrul-islam-dev`)
     - Private CV personal fields (DOB, parents' names, blood group, street/village addresses).

---

## 3. Items Requiring Post-Deployment / Manual Owner Verification

To remain strictly honest about runtime boundaries not executed in this session:
1. **`next build` Production Bundle Build:** Skipped intentionally during this session to avoid overwriting `.next` artifacts if a local dev server is active; run `pnpm build` prior to production deploy.
2. **Public-Safe `01112026T1223` CV PDF Upload:** Upload a redacted PDF export (without the private *Personal Information* table) via `/admin/cv` to replace `Kamrul-Islam-Master-CV-01102026T2059.pdf` in Supabase Storage.
