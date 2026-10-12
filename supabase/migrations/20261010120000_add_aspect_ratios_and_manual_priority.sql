-- ==============================================================================
-- Migration: 20261010_add_aspect_ratios_and_manual_priority.sql
-- Description: Extends projects table to support 5 aspect ratios, twitter provider,
--              and manual_priority display ranking for independent Video and Web tabs.
-- ==============================================================================

-- 1. Update aspect_ratio check constraint to support all 5 options:
--    '16:9' (Landscape), '9:16' (Portrait/Reels), '1:1' (Square),
--    '4:3' (Standard landscape), '5:4' (Near-square landscape)
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_aspect_ratio_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_aspect_ratio_check
  CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:3', '5:4'));

-- 2. Update video_provider check constraint to support twitter/x
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_video_provider_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_video_provider_check
  CHECK (video_provider IN ('youtube', 'vimeo', 'tiktok', 'facebook', 'instagram', 'twitter', 'local', 'other') OR video_provider IS NULL);

-- 3. Add manual_priority column (optional positive integer, 1 = highest priority)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS manual_priority INTEGER CHECK (manual_priority > 0 OR manual_priority IS NULL) DEFAULT NULL;

-- 4. Create composite index for high-performance priority and chronological queries
CREATE INDEX IF NOT EXISTS idx_projects_manual_priority 
  ON public.projects (type, is_published, manual_priority ASC NULLS LAST, published_at DESC NULLS LAST, created_at DESC);
