-- ==============================================================================
-- Migration: 20261023193000_create_project_screenshots_bucket.sql
-- Description: Creates the public project-screenshots storage bucket with RLS
--              policies allowing public read access and authenticated admin
--              upload/update/delete access for Web & Video project thumbnails.
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-screenshots',
  'project-screenshots',
  true,
  8388608, -- 8 MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view project screenshots" ON storage.objects;
CREATE POLICY "Public can view project screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-screenshots');

DROP POLICY IF EXISTS "Admins have full access to project screenshots" ON storage.objects;
CREATE POLICY "Admins have full access to project screenshots"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'project-screenshots' AND public.is_admin())
  WITH CHECK (bucket_id = 'project-screenshots' AND public.is_admin());
