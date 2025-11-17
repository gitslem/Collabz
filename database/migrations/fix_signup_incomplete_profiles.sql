-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX SIGNUP ISSUE: Handle incomplete profiles and add delete policies
-- ═══════════════════════════════════════════════════════════════════════════════
-- This migration fixes the issue where users can't sign up because:
-- 1. Auto-created profiles from trigger are incomplete
-- 2. No RLS policy exists to delete profiles
-- 3. Orphaned incomplete profiles prevent new signups
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── STEP 1: Add RLS policy to allow users to delete their own profiles ───
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ─── STEP 2: Add RLS policy to allow deletion of incomplete orphaned profiles ───
-- This allows cleanup of auto-created profiles that were never completed
-- Only applies to profiles that have no name (never completed signup)
DROP POLICY IF EXISTS "Allow cleanup of incomplete profiles" ON public.profiles;
CREATE POLICY "Allow cleanup of incomplete profiles"
  ON public.profiles FOR DELETE
  USING (
    name IS NULL OR name = '' OR
    (name IS NOT NULL AND auth.uid() = id)
  );

-- ─── STEP 3: Clean up existing incomplete orphaned profiles ───
-- Find and delete profiles that:
-- 1. Have no name (never completed signup)
-- 2. Were created more than 24 hours ago (grace period)
-- 3. Have no related data (no opportunities, invitations, etc.)

-- First, identify orphaned profiles
WITH orphaned_profiles AS (
  SELECT p.id, p.email, p.created_at
  FROM public.profiles p
  WHERE (p.name IS NULL OR p.name = '')
    AND p.created_at < NOW() - INTERVAL '24 hours'
    AND NOT EXISTS (
      SELECT 1 FROM public.opportunities o WHERE o.user_id = p.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.invitations i WHERE i.from_user_id = p.id OR i.to_user_id = p.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.collaborations c WHERE c.user1_id = p.id OR c.user2_id = p.id
    )
)
DELETE FROM public.profiles
WHERE id IN (SELECT id FROM orphaned_profiles);

-- ─── STEP 4: Add index to improve performance of incomplete profile checks ───
CREATE INDEX IF NOT EXISTS idx_profiles_incomplete
  ON public.profiles(created_at)
  WHERE name IS NULL OR name = '';

-- ─── STEP 5: Add function to identify incomplete profiles ───
CREATE OR REPLACE FUNCTION public.is_profile_complete(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_complete BOOLEAN := FALSE;
BEGIN
  SELECT
    COALESCE(email, '') <> '' AND
    COALESCE(name, '') <> '' AND
    COALESCE(role, '') <> '' AND
    COALESCE(bio, '') <> '' AND
    COALESCE(genres_raw, '') <> '' AND
    COALESCE(location, '') <> '' AND
    COALESCE(availability, '') <> '' AND
    COALESCE(skills_raw, '') <> '' AND
    COALESCE(experience_level, '') <> '' AND
    COALESCE(collab_type, '') <> ''
  INTO is_complete
  FROM public.profiles
  WHERE id = profile_id;

  RETURN COALESCE(is_complete, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ─── STEP 6: Add comment for documentation ───
COMMENT ON POLICY "Users can delete their own profile" ON public.profiles IS
  'Allows authenticated users to delete their own profile';

COMMENT ON POLICY "Allow cleanup of incomplete profiles" ON public.profiles IS
  'Allows deletion of incomplete profiles (no name) to prevent orphaned records from blocking signups';

COMMENT ON FUNCTION public.is_profile_complete(UUID) IS
  'Returns true if profile has all required fields filled';

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES (Run these to verify the migration worked)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Check for remaining incomplete profiles:
-- SELECT id, email, name, created_at FROM public.profiles WHERE name IS NULL OR name = '';

-- Check if policies are in place:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles' AND policyname LIKE '%delete%';
-- ═══════════════════════════════════════════════════════════════════════════════
