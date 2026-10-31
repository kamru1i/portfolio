-- ==============================================================================
-- Migration: 20261031153000_shift_project_priorities.sql
-- Description: Ensures existing video project shifted by new Priority #5 entry
--              ("How I Edited a Car Dealership Promo") is set to Priority #6.
-- ==============================================================================

UPDATE public.projects
SET manual_priority = 6,
    sort_order = 6
WHERE type = 'video'
  AND title = 'How I Edited a Car Dealership Promo'
  AND manual_priority IS NULL;
