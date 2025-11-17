-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX DUPLICATE EMAILS MIGRATION
-- ═══════════════════════════════════════════════════════════════════════════════
-- This migration removes duplicate email entries and ensures email uniqueness
--
-- WHAT THIS DOES:
-- 1. Identifies profiles with duplicate emails
-- 2. Keeps the most recently created profile for each email
-- 3. Deletes older duplicate profiles
-- 4. Ensures UNIQUE constraint exists on email column
--
-- RUN THIS IN: Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- Step 1: Find and display duplicate emails (for logging purposes)
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT email, COUNT(*) as count
        FROM public.profiles
        GROUP BY email
        HAVING COUNT(*) > 1
    ) duplicates;

    RAISE NOTICE 'Found % duplicate email(s)', duplicate_count;
END $$;

-- Step 2: Delete duplicate profiles, keeping only the most recent one for each email
-- This uses a CTE (Common Table Expression) to identify which profiles to keep
WITH ranked_profiles AS (
    SELECT
        id,
        email,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
    FROM public.profiles
),
profiles_to_delete AS (
    SELECT id, email
    FROM ranked_profiles
    WHERE rn > 1  -- Keep only the first (most recent) profile for each email
)
DELETE FROM public.profiles
WHERE id IN (SELECT id FROM profiles_to_delete);

-- Step 3: Ensure the UNIQUE constraint exists on the email column
-- This will fail if there are still duplicates (which there shouldn't be after step 2)
DO $$
BEGIN
    -- Drop the constraint if it exists (to recreate it)
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_email_key'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_email_key;
        RAISE NOTICE 'Dropped existing email unique constraint';
    END IF;

    -- Add the unique constraint
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    RAISE NOTICE 'Added unique constraint on email column';
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Cannot add unique constraint: duplicate emails still exist';
END $$;

-- Step 4: Create index on email if it doesn't exist (for performance)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Step 5: Display summary
DO $$
DECLARE
    total_profiles INTEGER;
    unique_emails INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_profiles FROM public.profiles;
    SELECT COUNT(DISTINCT email) INTO unique_emails FROM public.profiles;

    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Migration Complete!';
    RAISE NOTICE 'Total profiles: %', total_profiles;
    RAISE NOTICE 'Unique emails: %', unique_emails;
    RAISE NOTICE 'Email uniqueness constraint: ACTIVE';
    RAISE NOTICE '=================================================';
END $$;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION QUERY (Run this after the migration to verify)
-- ═══════════════════════════════════════════════════════════════════════════════
-- SELECT email, COUNT(*) as count
-- FROM public.profiles
-- GROUP BY email
-- HAVING COUNT(*) > 1;
--
-- Expected result: 0 rows (no duplicates)
-- ═══════════════════════════════════════════════════════════════════════════════
