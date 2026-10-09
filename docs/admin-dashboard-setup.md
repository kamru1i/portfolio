# Admin Dashboard & Database System Setup Guide

This guide provides step-by-step instructions for setting up the private **Admin Dashboard** and **Supabase Database** for the Kamrul Islam portfolio website.

Once configured, you will be able to add, edit, publish, and manage **Video** and **Web** projects from the private dashboard at `/admin` without editing source code.

---

## Architecture Overview

* **Authentication & Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security).
* **Authorization**: Dedicated `admin_users` allowlist table; strictly restricts dashboard access and mutations to authorized admin accounts.
* **Auto-Resolution**: Video metadata (YouTube, Vimeo, TikTok, etc.) and high-resolution thumbnails are detected automatically from URLs with zero manual file uploads and zero storage buckets required.
* **Public Site Fallback**: If Supabase is offline or unconfigured, the public website automatically and safely falls back to the verified static portfolio dataset so the homepage never breaks.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign in (or create a free account).
2. Click **New project** from your dashboard.
3. Configure your project:
   * **Name**: `kamrul-portfolio`
   * **Database Password**: Choose a strong password and save it securely in a password manager.
   * **Region**: Choose the closest region (e.g. `Singapore (ap-southeast-1)` or `Central EU`).
   * **Pricing Plan**: Free tier.
4. Click **Create new project** and wait ~1-2 minutes for the database to provision.

---

## Step 2: Retrieve API Keys & Project URL

1. In your Supabase project dashboard, navigate to **Project Settings** (gear icon in the left sidebar) → **API**.
2. Find the following values:
   * **Project URL**: Format `https://[your-project-id].supabase.co`
   * **Project API keys** → `anon` / `public`: Format `eyJhbGciOiJIUzI1Ni...`
   * **Project API keys** → `service_role` *(keep this secret; only used for offline seed scripts, never expose publicly)*.

---

## Step 3: Run Database Migrations

1. In the Supabase sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file [`supabase/migrations/20261009_create_projects_and_admin.sql`](../supabase/migrations/20261009_create_projects_and_admin.sql) in this repository.
4. Copy the entire contents and paste into the Supabase SQL Editor.
5. Click **Run** (or `Ctrl+Enter` / `Cmd+Enter`).
6. You should see `Success. No rows returned`.
   * This creates the `projects` table, `admin_users` table, Row Level Security (RLS) policies, indexes, and automatic `updated_at` triggers.

---

## Step 4: Create the Admin User & Disable Public Signups

### 4.1 Create Your Admin Account
1. In the Supabase sidebar, click **Authentication** → **Users**.
2. Click **Add user** → **Create user**.
3. Enter your admin email and a strong password:
   * **Email**: e.g. `admin@kamrulislam.bd` or your personal email.
   * **Password**: Create a secure password.
   * Toggle **Auto Confirm User?** to **ON** (so you don't need to verify via email link).
4. Click **Create user**.
5. Once created, look at the user table and copy the **User UID** (format: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### 4.2 Disable Public Signups (Strict Security Rule)
1. In the Supabase sidebar, go to **Authentication** → **Configuration** → **Signers & Providers** (or **Auth Settings**).
2. Under **User Signups**, **uncheck** `Enable email signup` (or toggle "Allow new users to sign up" to **OFF**).
3. Click **Save**.
   * *This ensures that no public visitor can register an account.*

---

## Step 5: Authorize Your Admin User in `admin_users`

The system uses an explicit allowlist table (`admin_users`) to prevent unauthorized users from performing mutations even if they authenticate.

1. Go back to **SQL Editor** in Supabase.
2. Run the following SQL query, replacing `YOUR_USER_UID_HERE` with the UID copied from Step 4.1, and `YOUR_EMAIL_HERE` with your admin email:

```sql
INSERT INTO public.admin_users (id, email, role)
VALUES ('YOUR_USER_UID_HERE', 'YOUR_EMAIL_HERE', 'admin')
ON CONFLICT (email) DO NOTHING;
```

3. Click **Run**.
4. Verify by running:
```sql
SELECT * FROM public.admin_users;
```
You should see your admin user listed.

---

## Step 6: Configure Environment Variables

1. Open your local `.env.local` file (or copy `.env.example` to `.env.local`).
2. Add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_key_here
```

3. For production deployments (e.g. Vercel, Netlify, or VPS):
   * Add the exact same environment variables under **Environment Variables** in your hosting provider's dashboard.

---

## Step 7: Import Initial Project Records (Seed Data)

You can seed the 11 verified portfolio projects into Supabase using either method:

### Method A: Via Supabase SQL Editor (Recommended & Fastest)
1. In Supabase, go to **SQL Editor** → **New query**.
2. Copy the contents of [`supabase/seed.sql`](../supabase/seed.sql).
3. Paste and click **Run**.
4. All 11 projects (5 Video and 6 Web) are immediately populated.

### Method B: Via Node.js CLI Script
If you prefer running a command from your terminal:
```bash
# Add SUPABASE_SERVICE_ROLE_KEY to your .env.local temporarily, then run:
node scripts/seed-projects.mjs
```

---

## Step 8: Logging into the Admin Dashboard

1. Open your browser and navigate to:
   ```
   http://localhost:3000/admin/login
   ```
2. Enter the admin email and password created in Step 4.
3. Click **Sign In to Dashboard**.
4. You will be redirected to the **Admin Dashboard** (`/admin`).
5. You will see:
   * Overview metrics (Total, Published, Drafts, Video, Web).
   * Search and filter controls.
   * Full list of projects with one-click **Publish/Draft** toggle, **Edit**, and **Delete**.

---

## Step 9: Adding and Managing Projects

### Adding a Video Project
1. In the Admin Dashboard, click **+ Add New Project**.
2. Select **Video Project**.
3. In **Video URL**, paste a YouTube, Vimeo, TikTok, or MP4 link:
   * *Example YouTube*: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   * *Example Shorts*: `https://www.youtube.com/shorts/...`
4. Click **Detect & Preview** (or click away from the input).
   * The system will detect the provider, video ID, aspect ratio (16:9 or 9:16), and resolve a high-resolution thumbnail automatically.
5. Enter Title, Description, Client name, and Tags.
6. Choose **Published** or **Draft**.
7. Click **Save & Publish Project**.
8. The project immediately appears on the public website at the top of the **Video** tab.

### Adding a Web Project
1. In the Admin Dashboard, click **+ Add New Project**.
2. Select **Web Project**.
3. In **Live Website URL**, enter the deployed URL (e.g. `https://example.com`).
4. (Optional) In **GitHub Repository URL**, enter the GitHub URL.
5. Check **Permit In-Site Live Iframe Preview** if the website allows framing. If the website blocks framing (like Cloudflare or GitHub), leave it unchecked; the website will display a sleek editorial card with an **Open Live Site ↗** button.
6. Enter Title, Description, and Tags.
7. Click **Save & Publish Project**.
8. The project immediately appears on the public website at the top of the **Web** tab.

---

## Step 10: Troubleshooting

### Problem: Video thumbnail is not showing up
* **YouTube**: Ensure the video is **Public** or **Unlisted** (not Private). YouTube serves thumbnails at `https://img.youtube.com/vi/[id]/hqdefault.jpg`.
* **TikTok**: TikTok public videos resolve via public oEmbed. If TikTok's rate limit is reached or the video is region-restricted, the system automatically uses a branded fallback thumbnail card so the UI never displays broken image icons.
* **Next.js Image Warning**: If using remote images, ensure the domain is listed under `images.remotePatterns` in `next.config.mjs` (already configured for YouTube, TikTok, Vimeo, and Google Cloud Storage).

### Problem: "Access Denied: Your account is not authorized as an administrator"
* Make sure you ran the SQL insert in **Step 5** to add your Supabase Auth UID to the `admin_users` table.

### Problem: Website preview in modal says "External Production Environment"
* This is expected behavior for websites that send `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`. Visitors can click **Visit Live Website ↗** to open the live site directly in a new tab.

---

## Security Verification Summary

* `/admin` routes require an authenticated admin session and will redirect unauthenticated requests to `/admin/login`.
* Project mutations (`POST`, `PUT`, `PATCH`, `DELETE`) verify admin authority on the server using `verifyAdminSession()`.
* Public visitors have read-only access to published projects via Supabase Row Level Security (RLS).
* Drafts are hidden from anonymous visitors.
* No service role keys or passwords are exposed in client-side bundles.
