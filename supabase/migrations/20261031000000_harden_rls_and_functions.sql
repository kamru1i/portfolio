-- ==============================================================================
-- Migration: 20261031000000_harden_rls_and_functions.sql
-- Description: Non-destructive security hardening for PostgreSQL functions and
--              public.contact_inquiries RLS / column bounds.
-- ==============================================================================

-- 1. Pin search_path on SECURITY DEFINER and trigger functions (PostgreSQL CVE/best-practice hardening)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Add non-destructive length bounds on contact_inquiries (NOT VALID preserves any historical rows)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'contact_inquiries'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'contact_inquiries_field_lengths_chk'
    ) THEN
      ALTER TABLE public.contact_inquiries
        ADD CONSTRAINT contact_inquiries_field_lengths_chk
        CHECK (
          char_length(name) BETWEEN 1 AND 120
          AND char_length(email) BETWEEN 3 AND 160
          AND char_length(project_type) BETWEEN 1 AND 120
          AND char_length(details) BETWEEN 1 AND 6000
          AND (company IS NULL OR char_length(company) <= 120)
          AND (budget_range IS NULL OR char_length(budget_range) <= 80)
          AND (timeline IS NULL OR char_length(timeline) <= 80)
        ) NOT VALID;
    END IF;
  END IF;
END $$;

-- 3. Tighten public INSERT RLS policy on contact_inquiries so direct anon PostgREST
--    calls cannot spoof inquiry status or insert unbounded payloads
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'contact_inquiries'
  ) THEN
    DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
    CREATE POLICY "Public can submit contact inquiries"
      ON public.contact_inquiries
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (
        status = 'unread'
        AND char_length(btrim(name)) BETWEEN 1 AND 100
        AND char_length(btrim(email)) BETWEEN 5 AND 120
        AND position('@' in email) > 1
        AND char_length(btrim(project_type)) BETWEEN 1 AND 100
        AND char_length(btrim(details)) BETWEEN 1 AND 5000
        AND (company IS NULL OR char_length(company) <= 100)
        AND (budget_range IS NULL OR char_length(budget_range) <= 60)
        AND (timeline IS NULL OR char_length(timeline) <= 60)
      );
  END IF;
END $$;
