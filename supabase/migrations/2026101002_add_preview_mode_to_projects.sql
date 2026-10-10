-- ==============================================================================
-- Migration: 20261010_add_preview_mode_to_projects.sql
-- Description: Adds preview_mode column ('iframe' | 'fallback') to projects table,
--              syncs with can_embed, and sets Web Wing to fallback preview mode.
-- ==============================================================================

-- 1. Add preview_mode column with constraint
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS preview_mode TEXT 
  CHECK (preview_mode IN ('iframe', 'fallback')) 
  DEFAULT 'iframe';

-- 2. Synchronize existing records based on can_embed
UPDATE public.projects 
  SET preview_mode = CASE WHEN can_embed = false THEN 'fallback' ELSE 'iframe' END 
  WHERE preview_mode IS NULL;

-- 3. Specifically set Web Wing to 'fallback' to resolve Cloudflare anti-bot challenge page
UPDATE public.projects 
  SET can_embed = false, preview_mode = 'fallback' 
  WHERE slug = 'web-wing' OR title ILIKE '%Web Wing%' OR live_url ILIKE '%webwing.co.uk%';
