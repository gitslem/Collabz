-- ═══════════════════════════════════════════════════════════════════════════════
-- STARRED OPPORTUNITIES FEATURE
-- ═══════════════════════════════════════════════════════════════════════════════
-- This adds the ability for users to star/favorite opportunities
-- Starred opportunities will be shown on the user's profile
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- Create starred_opportunities table
CREATE TABLE IF NOT EXISTS public.starred_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Ensure a user can only star an opportunity once
  UNIQUE(user_id, opportunity_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_starred_opportunities_user ON public.starred_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_starred_opportunities_opportunity ON public.starred_opportunities(opportunity_id);

-- Enable RLS
ALTER TABLE public.starred_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for starred_opportunities
-- Users can view their own starred opportunities
CREATE POLICY "Users can view own starred opportunities"
  ON public.starred_opportunities FOR SELECT
  USING (auth.uid() = user_id);

-- Users can star opportunities
CREATE POLICY "Users can star opportunities"
  ON public.starred_opportunities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unstar their own opportunities
CREATE POLICY "Users can unstar opportunities"
  ON public.starred_opportunities FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.starred_opportunities TO authenticated;

COMMIT;
