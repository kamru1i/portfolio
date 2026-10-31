-- ==============================================================================
-- Migration: 20261031120000_support_multi_document_types.sql
-- Description: Allows each document category (Curriculum Vitae, Resume,
--              Portfolio, Cover Letter) to have its own active published PDF
--              simultaneously in public.cv_documents.
-- ==============================================================================

-- 1. Drop legacy single-row published index and replace with per-category (file_url) unique index
DROP INDEX IF EXISTS public.idx_cv_documents_single_published;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cv_documents_single_published_per_category
  ON public.cv_documents (file_url)
  WHERE is_published = true;

-- 2. Update public SELECT policy on cv_documents to support both is_published = true and fallback active=1
DROP POLICY IF EXISTS "Public can view published cv_documents" ON public.cv_documents;
CREATE POLICY "Public can view published cv_documents"
  ON public.cv_documents FOR SELECT
  USING (is_published = true OR file_url LIKE '%active=1%');

-- 3. Update storage RLS policy so public can read any published/active document in cv-documents
DROP POLICY IF EXISTS "Public can read published CV storage objects" ON storage.objects;
CREATE POLICY "Public can read published CV storage objects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-documents'
    AND EXISTS (
      SELECT 1 FROM public.cv_documents
      WHERE public.cv_documents.storage_path = storage.objects.name
        AND (
          public.cv_documents.is_published = true
          OR public.cv_documents.file_url LIKE '%active=1%'
        )
    )
  );
