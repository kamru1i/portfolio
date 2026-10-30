# 01 — Authoritative CV Content Reconciliation

**Audit Date:** 2026-10-31  
**Authoritative Primary Sources (01 November 2026):**
1. **Master CV:** `Kamrul Islam-CV-M-01112026T1223.docx`
2. **Video Editor CV:** `Kamrul Islam-CV-VE-01112026T1223.docx`

---

## 1. Source Hierarchy & Brand Priority Resolution

Per project governance, source priority was enforced as:
1. Uploaded `01112026T1223` Master & Video Editor CVs (highest authority for factual employment, skills, tools, education, and languages).
2. Confirmed website brand hierarchy and privacy boundaries.
3. Live repository & Supabase database state.
4. Older Context Pack documents and historical AI summaries.

### Preserved Distinction: Document Headline vs. Website Brand Hierarchy
- **Master CV Document Headline:** Web Developer · IT Professional · Video Editor · AI-Assisted Content Creator.
- **Website Brand Priority (Preserved):**
  1. Video Editing & Post-Production
  2. AI-Assisted Content Creation
  3. Web Development
  4. IT & Digital Technology

---

## 2. Verified Public Identity & Privacy Boundary

| Attribute | Public Status | Reconciled Public Value / Rule |
| :--- | :--- | :--- |
| Full Name | Public | `Kamrul Islam` |
| Website / Canonical | Public | Display: `https://www.kamrulislam.me/` · Live Canonical (`301` target): `https://kamrulislam.me` |
| Email | Public | `hello@kamrulislam.me` |
| Phone / WhatsApp | Public | `(+880) 1839 00 6867` (`https://wa.me/8801839006867`) |
| Location | Public | `Chittagong, Bangladesh` |
| Social Handles (`kamru1i`) | Public | LinkedIn, GitHub, YouTube, Behance, Facebook, X, Instagram |
| Date of Birth | **Private — Redacted** | Never rendered in UI, metadata, JSON-LD, or repository docs |
| Parents' Names | **Private — Redacted** | Never rendered in UI, metadata, JSON-LD, or repository docs |
| Religion / Marital Status / Blood Group | **Private — Redacted** | Never rendered in UI, metadata, JSON-LD, or repository docs |
| Street / Village / Permanent Addresses | **Private — Redacted** | Never rendered; restricted strictly to `Chittagong, Bangladesh` |

> **Action Item for `/admin/cv`:** Live Supabase `public.cv_documents` currently serves `Kamrul-Islam-Master-CV-01102026T2059.pdf` (uploaded `2026-10-21`). Before uploading the `01112026T1223` PDF via `/admin/cv`, export a **public-safe PDF edition** omitting the private *Personal Information* table at the bottom of the DOCX.

---

## 3. Employment & Experience Reconciliation

| Organization | Official Role(s) | Authoritative Duration & Status | Previous Website Discrepancy | Resolution Applied |
| :--- | :--- | :--- | :--- | :--- |
| **Independent / Project-Based** | Web Development, Video Editing & AI Content Projects | **Current — Project-Based Client Work** | Omitted as a dedicated current milestone; current status was misattributed to B&F Corporate | Added `Independent Client Projects` as Milestone #1 (`Current`) in `src/lib/portfolio-data.ts` and `/cv` |
| **B&F Corporate** | IT Executive & Digital Media Coordinator (`2 Years`) + Video Editor & Content Creator (`1 Year`, concurrent) | **Previous Employment** (`2 Years` total tenure; `1 Year` concurrent media production) | Listed as `"2 Years — Present"`, `"Current Role"`, and JSON-LD `worksFor: B&F Corporate` | Updated to `Previous Employment` across `portfolio-data.ts`, `/cv`, `/milestones/experience/[slug]`, `supabase/seed.sql`, and removed `worksFor` from `src/app/layout.tsx` |
| **Velocity Digital** | Junior Web Developer (Remote) | **1.5 Years — Previous Employment** | Matched duration; needed explicit `Previous Employment` clarity | Verified & standardized across `portfolio-data.ts` and `/cv` |
| **JobMatchingBD** | Web Development Intern | **1 Year — Previous Internship** | Matched duration | Verified & retained |
| **Robi & Banglalink** | Customer Care Representative | **3 Years Combined Experience** | Overstated as `"4 Years Combined"` in `portfolio-data.ts` (`services`, `milestones`) and `seed.sql` | Corrected to `3 Years Combined Experience` everywhere |
| **Pizza Hut** | Crew Member | **2 Years Combined Experience** | Matched (`2 Years Combined Experience`) | Verified & retained |
| **Career Break (COVID-19)** | Career Transition (`March 2020 – September 2020`) | Documented in CVs as pandemic disruption & self-directed digital upskilling | Not listed as a formal employer | Kept separate from employment milestones per CV structure; no invented dates added |

### Experience Duration Math Note
Because the `1 Year` Video Editor & Content Creator role at B&F Corporate ran **concurrently** with the `2 Years` IT Executive tenure (and is not additive `2 + 1 = 3`), public counters were reconciled to **`4+ Years in Web, IT & Media`** (`2y` B&F + `1.5y` Velocity + `1y` JobMatchingBD + ongoing independent work) rather than inflating non-overlapping technical years.

---

## 4. Technical Skills, Tools & Proficiency Matrix

Both `01112026T1223` CVs categorize skills into **Expertise**, **Comfortable**, and **Familiar**. Outdated or unverified tools were removed across all routes, FAQs, services, and JSON-LD schemas:

- **Removed Unverified Tools/Claims:** `Runway` / `Runway Gen-2` / `Runway Gen-3`, `Midjourney`, `ElevenLabs`, `Adobe Audition`, `Google Workspace`, `Office 365`, `Linux Administration`, and broken GitHub URL `github.com/kamrul-islam-dev`.
- **Verified AI Creative Workflow Tools:** `Gemini Flow`, `Veo 3`, `Grok`, `Kling 3` (replacing standalone `"Kling"`), `Nano Banana`, `Midjourney`-free prompt/keyframe workflows, `Claude`, `ChatGPT`, `Antigravity`, `Google AI Studio`, `Stitch`.
- **Verified Video & Design Suite:** `Adobe Premiere Pro`, `DaVinci Resolve`, `CapCut`, `Adobe After Effects` (Familiar — basic motion graphics & visual polish), `Adobe Photoshop`, `Adobe Illustrator`, `Canva`, `Figma`.
- **Verified Web & IT Stack:**
  - *Expertise:* HTML5, CSS3, Bootstrap 5, Tailwind CSS, JavaScript (ES6+), Responsive Design, Git, GitHub, Netlify, Vercel, Windows 10/11, Hardware/Software Troubleshooting, LAN/Wi-Fi Networking, System Maintenance, MS Office Suite.
  - *Comfortable:* React.js, Next.js, Firebase Auth, REST APIs, Node.js, Express.js, MongoDB, Chrome DevTools, Cross-Browser Compatibility, Basic Cybersecurity Hygiene.
  - *Familiar:* TypeScript, Redux, WordPress, cPanel/Hosting, Basic SQL, Windows Server Basics.

---

## 5. Education & Languages Reconciliation

| Credential | Institution | Verified CV Facts | Removed Fabrications |
| :--- | :--- | :--- | :--- |
| **Bachelor of Science (BSc)** | Port City International University, Chittagong | Department: `Natural Science` · Subject: `Computer Science & Engineering` · Major: `Web Development` | Removed `"Graduated: 2021"`, `"Class of 2021"`, `"Certified Records"`, `"certified degrees"`, and any invented GPA |
| **Higher Secondary Certificate (HSC)** |Milestone / CV Record: `2015` | Group: `Science` · Board: `Chittagong` · Passing Year: `2015` · GPA: `3.50` | None invented |
| **Secondary School Certificate (SSC)** | Milestone / CV Record: `2013` | Group: `Science` · Board: `Chittagong` · Passing Year: `2013` · GPA: `4.81` | Removed any implied rank/distinction |

### Spoken Languages
- **Bangla:** Fluent (Native)
- **English:** Good Working Command (Reading, Writing & Speaking)
- **Hindi:** Conversational (Speaking) — added to `/cv` and root `Person.knowsLanguage` / `ContactPoint.availableLanguage` JSON-LD.

---

## 6. Portfolio Projects Reconciliation

Live Supabase `public.projects` holds **13 published records** (8 Web + 5 YouTube Video). `PORTFOLIO_DATA.showcaseProjects` and `supabase/seed.sql` were aligned with these exact 13 verified records, including mixed-case live slugs (`Microplastic-BioBag-Kamrul-I`, `upside-down-world-Kamrul-I`, `Mustard-Oil-vs-Refined-Oil`), `Photocard Generator` (`https://github.com/kamru1i/photocard`), and `Web Wing` (`previewMode: "fallback"`, `canEmbed: false`). Fabricated `"2026"` fallback year badges were removed when `project.year` is null.
