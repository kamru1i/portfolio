-- ==============================================================================
-- Migration: 20261009_create_projects_and_admin.sql
-- Description: Creates the projects and admin_users tables with full RLS policies,
--              triggers, and indexes for the Kamrul Islam Portfolio CMS.
-- ==============================================================================

-- 1. Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('video', 'web')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  client_name TEXT,
  year TEXT,
  
  -- Video-specific fields
  video_url TEXT,
  video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo', 'tiktok', 'facebook', 'instagram', 'local', 'other') OR video_provider IS NULL),
  video_id TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16')),
  
  -- Web-specific fields
  live_url TEXT,
  github_url TEXT,
  can_embed BOOLEAN NOT NULL DEFAULT false,
  
  -- Shared metadata & classification
  tags TEXT[] NOT NULL DEFAULT '{}',
  preview_image_url TEXT, -- Provider-derived thumbnail URL or fallback reference (NOT manual upload)
  
  -- Publishing & Ordering
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create the admin_users authorization allowlist table
-- References auth.users(id). Only users whose auth ID is in this table are permitted
-- to perform CRUD and publishing operations.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_projects_type_published ON public.projects (type, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_published_at ON public.projects (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects (sort_order ASC);

-- 5. Create automatic updated_at trigger for projects
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 7. Helper function to check if the current user is an authorized admin
-- Marked SECURITY DEFINER to bypass recursive RLS policies safely.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. RLS Policies for projects
-- Public: Anyone can read published projects
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (is_published = true);

-- Admin: Authorized admin users have full access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins have full access to projects" ON public.projects;
CREATE POLICY "Admins have full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. RLS Policies for admin_users
-- Admins can view only their own record in admin_users
DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;
CREATE POLICY "Admins can view their own record"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Only service role can insert/update/delete admin_users (or direct initial migration)
-- This completely prevents public users from inserting themselves into the admin allowlist!
