-- ═══════════════════════════════════════════════════════════════════════════════
-- COLLABX DATABASE RESET SCRIPT
-- ═══════════════════════════════════════════════════════════════════════════════
-- WARNING: This will DELETE ALL DATA and DROP ALL TABLES!
-- Only run this if you want a completely fresh start.
--
-- USE CASE: Run this FIRST if you're getting conflicts when running the main schema
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.profile_stats CASCADE;

-- Drop tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS public.project_pitches CASCADE;
DROP TABLE IF EXISTS public.collaborations CASCADE;
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.opportunities CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions (in reverse dependency order)
DROP FUNCTION IF EXISTS public.update_profile_completion() CASCADE;
DROP FUNCTION IF EXISTS public.check_profile_unlock(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_profile_completion(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop trigger from auth.users (if it exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- RESET COMPLETE!
-- ═══════════════════════════════════════════════════════════════════════════════
-- Next step: Run complete_collabx_schema.sql to recreate everything
-- ═══════════════════════════════════════════════════════════════════════════════
