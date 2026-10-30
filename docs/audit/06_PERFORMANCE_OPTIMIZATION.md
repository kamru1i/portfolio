# 06 — Performance & Resource Optimization Report

**Audit Date:** 2026-10-31  
**Scope:** Client main-thread CPU/GPU work, redundant network fetches, Next.js 16 cache invalidation, motion accessibility, and `public/` static asset footprint.

---

## 1. Runtime & Network Optimizations Implemented

### 1. Eliminated Redundant `/api/projects` Client Re-Fetch on Hydrated Pages
- **Files:** `src/components/works/ProjectsAndWorksSection.tsx`, `src/components/works/ProjectsPageContent.tsx`
- **Before:** Both `/` and `/projects` fetched `publishedProjects` on the server (`getPublishedProjects()`), passed `initialProjects` to the client component, and then **immediately fired a duplicate client `fetch("/api/projects")` inside `useEffect` on mount**.
- **After:** When `initialProjects !== undefined`, client mount skips the duplicate network round-trip and extra React state re-render, cutting post-hydration API calls on `/` and `/projects` to `0`.

### 2. Paused Offscreen 60fps Liquid-Chrome Canvas Shader in `CurtainFooter`
- **File:** `src/components/layout/CurtainFooter.tsx`
- **Before:** Because `CurtainFooter` is `position: fixed; bottom: 0; z-index: 1` behind `<main>` (`z-10 bg-black`), its 2D Canvas `requestAnimationFrame` shader (`ctx.measureText` + multi-pass `source-atop` sin/cos chromatic ripples + radial gradient sweep) executed continuously at **60fps throughout 100% of every page visit**, even while completely occluded behind `<main>`.
- **After:** `CurtainFooter` paints 1 crisp initial chrome frame on mount/resize/font-ready (preventing any blank flash on reveal) and **pauses the `requestAnimationFrame` loop** whenever:
  1. `<main>` covers the footer (`main.getBoundingClientRect().bottom >= window.innerHeight + 60`),
  2. `document.hidden` is true (background tab), or
  3. `prefers-reduced-motion: reduce` is enabled.

### 3. Paused Offscreen & Reduced-Motion Hero 3D Cylinder Loop
- **File:** `src/components/hero/Rotating3DCylinder.tsx`
- **Before:** Ran an unconditional `requestAnimationFrame` transform loop even after scrolling thousands of pixels past the Hero section or in background tabs.
- **After:** Added `IntersectionObserver`, `visibilitychange`, and `prefers-reduced-motion: reduce` gating so the RAF loop runs `0` frames/sec when scrolled offscreen, hidden, or idle under reduced motion, while waking instantly on pointer drag.

### 4. Replaced Dual 1-Second Clock Polling with Shared Minute-Aligned Store
- **Files:** `src/hooks/useDhakaClock.ts`, `src/components/layout/Navigation.tsx`, `src/components/layout/CurtainFooter.tsx`
- **Before:** Two separate `setInterval(..., 1000)` loops ran **120 timer callbacks/minute** to format `HH:MM AM/PM` strings that only change once per minute.
- **After:** `useDhakaClock` shares a single module-level `setTimeout` aligned to the exact next minute boundary (`60_000 - (Date.now() % 60_000) + 50`), reducing timer wakeups by **99.2%** (`120/min` → `1/min`).

### 5. Fixed `SmoothScroll.tsx` Unmount RAF Leak & Reduced-Motion Bypass
- **File:** `src/components/common/SmoothScroll.tsx`
- **Before:** `const rafId = requestAnimationFrame(raf)` only stored frame #1's ID, so `cancelAnimationFrame(rafId)` on unmount failed to stop subsequent `requestAnimationFrame(raf)` ticks.
- **After:** Updated `rafId` on every frame for deterministic cleanup and bypassed Lenis wheel hijacking when `prefers-reduced-motion: reduce` is active (paired with instant skip in `IntroCurtain.tsx`).

### 6. Standardized Portrait Path to Eliminate Space-Encoded Duplicate Requests
- **Files:** `src/lib/portfolio-data.ts`, `src/app/layout.tsx`
- **Fix:** Unified all references from `/images/Kamrul I.png` to `/images/Kamrul-I.png` so `next/image` caches a single optimized WebP/AVIF derivative.

---

## 2. Static Asset Footprint Audit (`public/`)

Measured inventory of `d:\Web Dev\Portfolio\public` (non-destructive audit — no user asset files were deleted):

| Asset Path / Folder | Size | Active Usage Status & Recommendation |
| :--- | :---: | :--- |
| `public/images/Kamrul-I.png` | `3,577 KB` | **Active** (served via `next/image` WebP/AVIF optimizer on `/` & FAQ). Optional future optimization: compress source PNG to ~450 KB WebP. |
| `public/images/Kamrul I.png` | `3,577 KB` | **Unused Duplicate** (space in filename; all code references now point to `Kamrul-I.png`). Safe for user to delete manually (`-3.5 MB`). |
| `public/test-screenshots/**` | `~18,700 KB` (40 PNGs) | **QA Artifacts Inside `public/`** — Currently copied to CDN static output on deploy. Recommended: move `public/test-screenshots` to `docs/screenshots` or `.qa/` outside `public/` (`-18.7 MB` deploy artifact size). |
| `public/images/hero-gallery/*.webp` | `390 KB` total (5 WebPs) | **Active & Well-Optimized** (`46–127 KB` each, used by `hero-gallery-config.ts`). |
| `public/images/hero-card-1..5.png` | `2,553 KB` total | **Legacy Unreferenced PNGs** (superseded by `hero-gallery/*.webp`). Safe to archive outside `public/`. |
| `public/fonts/*.woff2` | `87.2 KB` total (4 files) | **Optimal** (`gambarino.woff2` `16.4 KB`, `inter` `30.9 KB`, `roboto-mono` `39.9 KB`). |
