-- ==============================================================================
-- Migration: 20261031154500_add_project_priority_shift_trigger.sql
-- Description: Adds an automatic PostgreSQL trigger on public.projects so that
--              inserting or updating a project's manual_priority cascades and
--              shifts existing projects of the same type ('video' or 'web')
--              down by +1 serially (e.g., 5 -> 6, 6 -> 7, 7 -> 8).
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_project_priority_shift()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  rec RECORD;
  next_req INTEGER;
BEGIN
  -- Prevent recursive trigger execution when shifting other rows
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  IF NEW.manual_priority IS NULL OR NEW.manual_priority <= 0 THEN
    RETURN NEW;
  END IF;

  -- Check if another project of the same type already holds NEW.manual_priority
  IF NOT EXISTS (
    SELECT 1
    FROM public.projects
    WHERE type = NEW.type
      AND id <> NEW.id
      AND COALESCE(NULLIF(manual_priority, 0), NULLIF(sort_order, 0)) = NEW.manual_priority
  ) THEN
    RETURN NEW;
  END IF;

  next_req := NEW.manual_priority + 1;

  FOR rec IN
    SELECT id,
           COALESCE(NULLIF(manual_priority, 0), NULLIF(sort_order, 0)) AS eff_priority
    FROM public.projects
    WHERE type = NEW.type
      AND id <> NEW.id
      AND COALESCE(NULLIF(manual_priority, 0), NULLIF(sort_order, 0)) >= NEW.manual_priority
    ORDER BY COALESCE(NULLIF(manual_priority, 0), NULLIF(sort_order, 0)) ASC,
             updated_at DESC,
             created_at DESC,
             id ASC
  LOOP
    IF rec.eff_priority < next_req THEN
      UPDATE public.projects
      SET manual_priority = next_req,
          sort_order = next_req
      WHERE id = rec.id;
      next_req := next_req + 1;
    ELSE
      next_req := rec.eff_priority + 1;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_shift_project_priorities ON public.projects;
CREATE TRIGGER trg_shift_project_priorities
  AFTER INSERT OR UPDATE OF manual_priority, type
  ON public.projects
  FOR EACH ROW
  WHEN (pg_trigger_depth() = 1 AND NEW.manual_priority IS NOT NULL AND NEW.manual_priority > 0)
  EXECUTE FUNCTION public.handle_project_priority_shift();
