-- ═══════════════════════════════════════════════════════════════════════════════
-- UPDATE PROFILE COMPLETION CALCULATION
-- ═══════════════════════════════════════════════════════════════════════════════
-- This migration updates the profile completion calculation to reflect that:
-- - 10 required fields (all except social_links) = 90% when complete
-- - social_links is optional and adds the final 10%
--
-- New calculation:
-- - Each required field = 9% (10 fields × 9% = 90%)
-- - social_links field = 10%
-- - Total possible = 100%
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── STEP 1: Update the calculate_profile_completion function ───
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion_percentage INTEGER := 0;
  required_field_count INTEGER := 10; -- All fields except social_links
  required_filled_count INTEGER := 0;
  has_social_links BOOLEAN := FALSE;
BEGIN
  -- Count required fields (all except social_links)
  SELECT
    (CASE WHEN email IS NOT NULL AND email <> '' THEN 1 ELSE 0 END +
     CASE WHEN name IS NOT NULL AND name <> '' THEN 1 ELSE 0 END +
     CASE WHEN role IS NOT NULL AND role <> '' THEN 1 ELSE 0 END +
     CASE WHEN genres_raw IS NOT NULL AND genres_raw <> '' THEN 1 ELSE 0 END +
     CASE WHEN location IS NOT NULL AND location <> '' THEN 1 ELSE 0 END +
     CASE WHEN availability IS NOT NULL AND availability <> '' THEN 1 ELSE 0 END +
     CASE WHEN skills_raw IS NOT NULL AND skills_raw <> '' THEN 1 ELSE 0 END +
     CASE WHEN experience_level IS NOT NULL AND experience_level <> '' THEN 1 ELSE 0 END +
     CASE WHEN collab_type IS NOT NULL AND collab_type <> '' THEN 1 ELSE 0 END +
     CASE WHEN bio IS NOT NULL AND bio <> '' THEN 1 ELSE 0 END)
  INTO required_filled_count
  FROM public.profiles
  WHERE id = profile_id;

  -- Check if social_links is filled (optional field)
  SELECT
    (social_links IS NOT NULL AND social_links <> '')
  INTO has_social_links
  FROM public.profiles
  WHERE id = profile_id;

  -- Calculate completion percentage
  -- Required fields account for 90% (9% each)
  -- Social links accounts for 10%
  completion_percentage := (required_filled_count * 90) / required_field_count;

  IF has_social_links THEN
    completion_percentage := completion_percentage + 10;
  END IF;

  -- Ensure we don't exceed 100%
  IF completion_percentage > 100 THEN
    completion_percentage := 100;
  END IF;

  RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- ─── STEP 2: Update the is_profile_complete function to match ───
-- Update the function we created in the previous migration to match the new logic
CREATE OR REPLACE FUNCTION public.is_profile_complete(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_complete BOOLEAN := FALSE;
BEGIN
  -- Profile is considered complete if all required fields are filled (90%)
  -- Social links is optional and not required for completion
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

-- ─── STEP 3: Update check_profile_unlock to use 90% threshold ───
-- Since profile completion now shows 90% for complete profiles (without social links),
-- we need to adjust the unlock criteria to match
CREATE OR REPLACE FUNCTION public.check_profile_unlock(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_complete BOOLEAN := FALSE;
  has_collabs BOOLEAN := FALSE;
  should_unlock BOOLEAN := FALSE;
BEGIN
  -- Profile is unlocked when completion >= 90% (all required fields)
  SELECT public.calculate_profile_completion(profile_id) >= 90 INTO is_complete;

  SELECT
    (accepted_collabs >= 1 OR profile_views >= 10) INTO has_collabs
  FROM public.profiles
  WHERE id = profile_id;

  should_unlock := is_complete AND has_collabs;
  RETURN should_unlock;
END;
$$ LANGUAGE plpgsql;

-- ─── STEP 4: Update all existing profile completion percentages ───
-- Recalculate for all existing profiles
UPDATE public.profiles
SET profile_completion_percentage = public.calculate_profile_completion(id);

-- ─── STEP 5: Add comments for documentation ───
COMMENT ON FUNCTION public.calculate_profile_completion(UUID) IS
  'Calculates profile completion percentage. Required fields (10) = 90%, social_links (optional) = 10%';

COMMENT ON FUNCTION public.is_profile_complete(UUID) IS
  'Returns true if all required fields are filled (social_links is optional)';

COMMENT ON FUNCTION public.check_profile_unlock(UUID) IS
  'Returns true if profile completion >= 90% and has 1 collab or 10 views';

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERIES
-- ═══════════════════════════════════════════════════════════════════════════════
-- Test profile completion calculation:
-- SELECT id, name, email,
--        public.calculate_profile_completion(id) as completion_pct,
--        social_links IS NOT NULL AND social_links <> '' as has_social_links
-- FROM public.profiles
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Check if functions exist:
-- SELECT proname, prosrc FROM pg_proc WHERE proname LIKE '%profile%completion%';
-- ═══════════════════════════════════════════════════════════════════════════════
