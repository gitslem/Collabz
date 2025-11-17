-- ═══════════════════════════════════════════════════════════════════════════════
-- COLLABX COMPLETE DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════
-- This is the complete production-ready schema for the CollabX platform
-- Includes: Authentication integration, profiles, opportunities, invitations,
--           collaborations, project pitches, RLS policies, and triggers
--
-- SETUP: Run this entire file in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. PROFILES TABLE (Linked to auth.users)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT,
  genres_raw TEXT,
  location TEXT,
  availability TEXT,
  skills_raw TEXT,
  experience_level TEXT,
  collab_type TEXT,
  social_links TEXT,
  bio TEXT,

  -- Extended profile fields
  profile_completion_percentage INTEGER DEFAULT 0,
  verified_creative BOOLEAN DEFAULT FALSE,
  private_mode BOOLEAN DEFAULT FALSE,
  accepted_collabs INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  profile_unlocked BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON public.profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_created ON public.profiles(created_at DESC);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. OPPORTUNITIES TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  looking_for_role TEXT NOT NULL, -- artist, producer, songwriter, dj, promoter, pr, fan
  location TEXT NOT NULL,
  description TEXT,
  genres TEXT, -- comma-separated genres
  collab_type TEXT, -- collaboration type (e.g., one-time, long-term, etc.)
  status TEXT DEFAULT 'active', -- active, closed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_user ON public.opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. INVITATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_from_user ON public.invitations(from_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_to_user ON public.invitations(to_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_opportunity ON public.invitations(opportunity_id);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. COLLABORATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT,
  verified BOOLEAN DEFAULT FALSE, -- verified by platform/admin
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_collaborations_user1 ON public.collaborations(user1_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_user2 ON public.collaborations(user2_id);

ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. PROJECT PITCHES TABLE
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.project_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_pitches_user ON public.project_pitches(user_id);

ALTER TABLE public.project_pitches ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function: Auto-create profile when user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_invitations_updated_at ON public.invitations;
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaborations_updated_at ON public.collaborations;
CREATE TRIGGER update_collaborations_updated_at
  BEFORE UPDATE ON public.collaborations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_pitches_updated_at ON public.project_pitches;
CREATE TRIGGER update_project_pitches_updated_at
  BEFORE UPDATE ON public.project_pitches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Calculate profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion_percentage INTEGER := 0;
  field_count INTEGER := 11;
  filled_count INTEGER := 0;
BEGIN
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
     CASE WHEN social_links IS NOT NULL AND social_links <> '' THEN 1 ELSE 0 END +
     CASE WHEN bio IS NOT NULL AND bio <> '' THEN 1 ELSE 0 END)
  INTO filled_count
  FROM public.profiles
  WHERE id = profile_id;

  completion_percentage := (filled_count * 100) / field_count;
  RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if profile should be unlocked
CREATE OR REPLACE FUNCTION public.check_profile_unlock(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_complete BOOLEAN := FALSE;
  has_collabs BOOLEAN := FALSE;
  should_unlock BOOLEAN := FALSE;
BEGIN
  SELECT public.calculate_profile_completion(profile_id) >= 100 INTO is_complete;

  SELECT
    (accepted_collabs >= 1 OR profile_views >= 10) INTO has_collabs
  FROM public.profiles
  WHERE id = profile_id;

  should_unlock := is_complete AND has_collabs;
  RETURN should_unlock;
END;
$$ LANGUAGE plpgsql;

-- Function: Update profile completion on change
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_percentage := public.calculate_profile_completion(NEW.id);
  NEW.profile_unlocked := public.check_profile_unlock(NEW.id);
  NEW.verified_creative := NEW.profile_unlocked;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update profile completion before update
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON public.profiles;
CREATE TRIGGER trigger_update_profile_completion
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completion();

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── PROFILES POLICIES ───
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── OPPORTUNITIES POLICIES ───
DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON public.opportunities;
CREATE POLICY "Opportunities are viewable by everyone"
  ON public.opportunities FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
CREATE POLICY "Users can create their own opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
CREATE POLICY "Users can update their own opportunities"
  ON public.opportunities FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;
CREATE POLICY "Users can delete their own opportunities"
  ON public.opportunities FOR DELETE
  USING (auth.uid() = user_id);

-- ─── INVITATIONS POLICIES ───
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.invitations;
CREATE POLICY "Users can view invitations they sent or received"
  ON public.invitations FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "Users can send invitations" ON public.invitations;
CREATE POLICY "Users can send invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can update invitations they received" ON public.invitations;
CREATE POLICY "Users can update invitations they received"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = to_user_id);

-- ─── COLLABORATIONS POLICIES ───
DROP POLICY IF EXISTS "Users can view their own collaborations" ON public.collaborations;
CREATE POLICY "Users can view their own collaborations"
  ON public.collaborations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can create collaborations" ON public.collaborations;
CREATE POLICY "Users can create collaborations"
  ON public.collaborations FOR INSERT
  WITH CHECK (true);

-- ─── PROJECT PITCHES POLICIES ───
DROP POLICY IF EXISTS "Users can view their own pitches" ON public.project_pitches;
CREATE POLICY "Users can view their own pitches"
  ON public.project_pitches FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own pitches" ON public.project_pitches;
CREATE POLICY "Users can create their own pitches"
  ON public.project_pitches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own pitches" ON public.project_pitches;
CREATE POLICY "Users can update their own pitches"
  ON public.project_pitches FOR UPDATE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 8. VIEWS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Drop existing views first (in case of column structure changes)
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.profile_stats CASCADE;

-- Public profile view (excludes sensitive data)
CREATE VIEW public.public_profiles AS
SELECT
  id,
  name,
  role,
  genres_raw,
  location,
  availability,
  skills_raw,
  experience_level,
  collab_type,
  social_links,
  bio,
  profile_completion_percentage,
  verified_creative,
  accepted_collabs,
  profile_views,
  created_at
FROM public.profiles
WHERE private_mode = false;

-- Grant access to views
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Profile stats view
CREATE VIEW public.profile_stats AS
SELECT
  COUNT(*) as total_profiles,
  COUNT(DISTINCT role) as unique_roles,
  COUNT(DISTINCT experience_level) as experience_levels,
  MAX(created_at) as latest_profile,
  MIN(created_at) as first_profile
FROM public.profiles;

GRANT SELECT ON public.profile_stats TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 9. TABLE COMMENTS (Documentation)
-- ═══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE public.profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE public.opportunities IS 'Collaboration opportunity posts created by users';
COMMENT ON TABLE public.invitations IS 'Collaboration invitations sent between users';
COMMENT ON TABLE public.collaborations IS 'Accepted and tracked collaborations';
COMMENT ON TABLE public.project_pitches IS 'User project pitches for verification';

COMMENT ON COLUMN public.profiles.profile_completion_percentage IS 'Percentage of profile fields completed (0-100)';
COMMENT ON COLUMN public.profiles.verified_creative IS 'Badge shown when profile is fully unlocked';
COMMENT ON COLUMN public.profiles.private_mode IS 'User preference to stay in private/anonymous mode';
COMMENT ON COLUMN public.profiles.profile_unlocked IS 'True when profile meets unlock criteria (100% complete + 1 collab or 10 views)';

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- SETUP COMPLETE!
-- ═══════════════════════════════════════════════════════════════════════════════
-- Next steps:
-- 1. Go to Authentication → Providers and enable Email, Google, Microsoft
-- 2. Configure your frontend .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
-- 3. Test user registration and login
-- ═══════════════════════════════════════════════════════════════════════════════
