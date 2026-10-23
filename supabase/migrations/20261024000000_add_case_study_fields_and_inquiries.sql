-- ==============================================================================
-- Migration: 20261024000000_add_case_study_fields_and_inquiries.sql
-- Description:
--   1. Adds Case Study detail columns (role, overview, deliverables) to public.projects
--   2. Creates public.contact_inquiries table for Contact Form backup storage &
--      Admin Dashboard Inquiries Inbox with strict Row-Level Security (RLS).
-- ==============================================================================

-- 1. Add Case Study columns to public.projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS deliverables TEXT[] NOT NULL DEFAULT '{}';

-- 2. Create public.contact_inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT NOT NULL,
  budget_range TEXT,
  timeline TEXT,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  email_delivered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at
  ON public.contact_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status
  ON public.contact_inquiries (status, created_at DESC);

-- 3. Automatic updated_at trigger for contact_inquiries
DROP TRIGGER IF EXISTS set_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER set_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS) on contact_inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public visitors (anon & authenticated) can ONLY insert new inquiries (no SELECT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
  ON public.contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authorized admins have full access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins have full access to contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins have full access to contact inquiries"
  ON public.contact_inquiries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
