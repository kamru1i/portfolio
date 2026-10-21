-- ==============================================================================
-- Migration: 20261022020000_create_cv_documents_and_storage.sql
-- Description: Creates public.cv_documents table and private cv-documents storage
--              bucket with strict RLS policies for authenticated admin management
--              and controlled public CV access.
-- ==============================================================================

-- 1. Create the cv_documents table
CREATE TABLE IF NOT EXISTS public.cv_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Kamrul Islam — Curriculum Vitae',
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  file_url TEXT NOT NULL DEFAULT '/api/cv/pdf',
  file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 10485760),
  mime_type TEXT NOT NULL DEFAULT 'application/pdf' CHECK (mime_type = 'application/pdf'),
  version_label TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enforce at most one published CV at any time via a partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_cv_documents_single_published
  ON public.cv_documents ((is_published))
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_cv_documents_updated_at
  ON public.cv_documents (updated_at DESC);

-- 3. Automatic updated_at trigger
DROP TRIGGER IF EXISTS set_cv_documents_updated_at ON public.cv_documents;
CREATE TRIGGER set_cv_documents_updated_at
  BEFORE UPDATE ON public.cv_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.cv_documents ENABLE ROW LEVEL SECURITY;

-- Public: Anyone can view the currently published CV metadata record
DROP POLICY IF EXISTS "Public can view published cv_documents" ON public.cv_documents;
CREATE POLICY "Public can view published cv_documents"
  ON public.cv_documents FOR SELECT
  USING (is_published = true);

-- Admin: Authorized admin users have full CRUD access
DROP POLICY IF EXISTS "Admins have full access to cv_documents" ON public.cv_documents;
CREATE POLICY "Admins have full access to cv_documents"
  ON public.cv_documents FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Create controlled storage bucket for CV PDFs (10 MB limit, application/pdf only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv-documents', 'cv-documents', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 6. Storage RLS policies for cv-documents bucket
DROP POLICY IF EXISTS "Public can read published CV storage objects" ON storage.objects;
CREATE POLICY "Public can read published CV storage objects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-documents'
    AND EXISTS (
      SELECT 1 FROM public.cv_documents
      WHERE public.cv_documents.storage_path = storage.objects.name
        AND public.cv_documents.is_published = true
    )
  );

DROP POLICY IF EXISTS "Admins have full access to CV storage objects" ON storage.objects;
CREATE POLICY "Admins have full access to CV storage objects"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'cv-documents' AND public.is_admin())
  WITH CHECK (bucket_id = 'cv-documents' AND public.is_admin());
