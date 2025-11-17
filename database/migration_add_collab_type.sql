-- Migration: Add collab_type column to opportunities table
-- This fixes the error when posting collaboration opportunities

BEGIN;

-- Add collab_type column if it doesn't exist
ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS collab_type TEXT;

-- Add comment
COMMENT ON COLUMN public.opportunities.collab_type IS 'Collaboration type preference (e.g., one-time, long-term, project-based, etc.)';

COMMIT;
