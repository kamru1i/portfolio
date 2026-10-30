# 02 — Website Content Update Map

**Audit Date:** 2026-10-31  
**Scope:** Route-by-route and component-by-component inventory of content updates reconciling the website against `Kamrul Islam-CV-M-01112026T1223.docx` and `Kamrul Islam-CV-VE-01112026T1223.docx`.

---

## 1. Central Data & Database Seed Layer

| File | Section / Symbol | Before | After |
| :--- | :--- | :--- | :--- |
| `src/lib/portfolio-data.ts` | `projects` & `showcaseProjects` | 11 static items with outdated slugs, missing `Photocard Generator` GitHub repo, and mismatched video records | Reconciled to the 13 verified published portfolio records (8 Web + 5 Video), exact live slugs, `https://github.com/kamru1i/photocard`, and `Web Wing` (`previewMode: "fallback"`, `canEmbed: false`) |
| `src/lib/portfolio-data.ts` | `manifesto` & `faq` portrait | `/images/Kamrul I.png` (unencoded space in asset path) | `/images/Kamrul-I.png` |
| `src/lib/portfolio-data.ts` | `services` (4 Pillars) | Listed standalone `"Kling"`, `"Office 365"`, `"4 Years Combined"` for Robi & Banglalink, and implied current B&F Corporate employment | Updated to `"Kling 3"`, removed `"Office 365"`, corrected Robi & Banglalink to `"3 Years Combined Experience"`, added `Independent Client Projects`, and marked `B&F Corporate` as `Previous Employment` |
| `src/lib/portfolio-data.ts` | `milestones` | B&F Corporate marked `"2 Years — Present"`; BSc marked `"Graduated: 2021"`; Robi & Banglalink marked `"4 Years Combined"` | Added `Independent Client Projects` (`Current — Project-Based Client Work`); marked B&F IT (`2 Years — Previous Employment`) & B&F Video (`1 Year — Previous Employment (Concurrent with IT responsibilities)`); updated BSc with `Department: Natural Science`, `Subject: Computer Science & Engineering`, `Major: Web Development` (no graduation year); fixed Robi & Banglalink (`3 Years Combined Experience`) |
| `src/lib/portfolio-data.ts` | `counters` | Generic/unaligned counters | `13+ Published Portfolio Works`, `4+ Years in Web, IT & Media`, `4 Core Practice Pillars` |
| `src/lib/portfolio-data.ts` | `faq` | Referenced unverified tools | Restricted strictly to CV-verified editing, AI (`Gemini Flow`, `Veo 3`, `Grok`, `Kling 3`, `Nano Banana`), web, and IT stacks |
| `supabase/seed.sql` | Seed data | Outdated `"Present"`, `"4 Years"`, and old tool tags | Synchronized with verified CV roles, durations, and toolchains |

---

## 2. Public Routes, Metadata & Structured Data (JSON-LD)

| Route / File | Element Updated | Before | After |
| :--- | :--- | :--- | :--- |
| `src/app/layout.tsx` | Root `Person` JSON-LD | Included `worksFor: { name: "B&F Corporate" }`, `#portrait` pointing to `/images/Kamrul I.png`, `knowsLanguage` missing Hindi | Removed `worksFor` (no longer employed at B&F Corporate), updated `#portrait` to `https://kamrulislam.me/images/Kamrul-I.png`, set `knowsLanguage: ["Bangla", "English", "Hindi"]`, and serialized via `serializeJsonLd` |
| `src/app/page.tsx` | Homepage JSON-LD | Listed `Midjourney` & `Runway Gen-2` in `knowsAbout` / service descriptions | Replaced with CV-verified tools (`Gemini Flow`, `Veo 3`, `Grok`, `Kling 3`, `Nano Banana`, `Premiere Pro`, `DaVinci Resolve`, `Next.js`) + `serializeJsonLd` |
| `src/app/cv/page.tsx` | `/cv` Interactive Web CV | Listed `Linux Administration` & `Google Workspace`; lacked Expertise/Comfortable/Familiar tiers; showed BSc passing year; omitted Hindi | Removed `Linux Administration` & `Google Workspace`; added 3-tier `SKILL_PROFICIENCY_MATRIX` (`Expertise`, `Comfortable`, `Familiar`); rendered `University Studies` (Department, Subject, Major) without fabricated graduation year; added `Hindi` (`Conversational`) |
| `src/app/milestones/education/page.tsx` | `/milestones/education` | Used `"Certified Records"` / `"certified degrees"` copy and assumed every entry had a passing year | Changed copy to `"Academic Background"` / `"University Studies"`; added `Department` & `Subject` metadata badges; rendered `Passing Year` & `GPA` conditionally only when supplied in CV (`HSC 2015`, `SSC 2013`) |
| `src/app/milestones/experience/[slug]/page.tsx` | `/milestones/experience/[slug]` | Labeled B&F Corporate as current role | Distinguished `Current Client Work` (`Independent Client Projects`) from `Previous Employment` (`B&F Corporate`, `Velocity Digital`, `JobMatchingBD`, `Robi & Banglalink`, `Pizza Hut`) |
| `src/app/services/[slug]/page.tsx` | `/services/[slug]` | Referenced `Runway Gen-3` and `github.com/kamrul-islam-dev` | Replaced with `Gemini Flow`, `Veo 3`, `Kling 3`, and `https://github.com/kamru1i`; switched to `serializeJsonLd` |
| `src/app/contact-us/page.tsx` | `/contact-us` JSON-LD | `availableLanguage: ["English", "Bengali"]` | Updated to `["Bangla", "English", "Hindi"]` + `serializeJsonLd` |
| `src/app/projects/page.tsx` | `/projects` Archive | Inline `JSON.stringify` | Standardized on `serializeJsonLd` and clean server-passed `initialProjects` |
| `src/app/projects/video/[slug]/page.tsx` | Video Case Study | Broken `https://www.youtube.com/embed/[object Object]` iframe URL; `"2026"` fallback year | Fixed YouTube/Vimeo embed URL via `resolvePlayableEmbedUrl`; rendered `@year` badge only when `project.year` exists |
| `src/app/projects/web/[slug]/page.tsx` | Web Case Study | Fabricated `"2026"` fallback year | Rendered `@year` badge conditionally only when `project.year` exists; encoded canonical slug |

---

## 3. Interactive Components & Admin Dashboard

| Component | Summary of Content / UX Update |
| :--- | :--- |
| `src/components/recognitions/AwardsSection.tsx` | Removed `"Certified Records"` badge on academic entries; aligned milestone subtitles with verified CV records. |
| `src/components/contact/ContactFormSection.tsx` | Added `?service=` query-parameter pre-selection (`video-editing`, `ai-content`, `web-development`, `it-support`), updated submission copy to `"Enquiry Received"` (avoiding false inbox-delivery guarantees when only accepted by upstream API). |
| `src/components/contact/ContactFaqSection.tsx` | Replaced `Runway` mention with CV-verified AI video stack (`Gemini Flow`, `Veo 3`, `Grok`, `Kling 3`, `Nano Banana`) and converted accordion triggers to semantic `<button aria-expanded aria-controls>`. |
| `src/app/admin/(dashboard)/inquiries/page.tsx` | Updated email status pill from `"Email Delivered ✓"` to `"Provider Accepted ✓"` to reflect Resend API acceptance accurately. |
| `src/components/admin/ProjectEditorForm.tsx` | Unified Create/Edit project form with explicit Web `Preview Mode` selector (`Live Interactive Iframe` vs `Protected / Fallback Card`). |
