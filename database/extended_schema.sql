-- Extended Schema for CollabX Platform (idempotent)
-- Adds opportunities, invitations, collaborations, pitches, and profile unlock features

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- Profiles: extend existing table
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verified_creative BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS private_mode BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_collabs INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_unlocked BOOLEAN DEFAULT FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  looking_for_role TEXT NOT NULL, -- artist, producer, songwriter, dj, promoter, pr, fan
  location TEXT NOT NULL,
  description TEXT,
  genres TEXT,                     -- comma-separated genres
  collab_type TEXT,                -- collaboration type (e.g., one-time, long-term, etc.)
  status TEXT DEFAULT 'active',    -- active, closed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',   -- pending, accepted, rejected
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT,
  verified  BOOLEAN DEFAULT FALSE, -- verified by platform/admin
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_opportunities_user        ON public.opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status      ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_invitations_from_user     ON public.invitations(from_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_to_user       ON public.invitations(to_user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_opportunity   ON public.invitations(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_user1      ON public.collaborations(user1_id);
CREATE INDEX IF NOT EXISTS idx_collaborations_user2      ON public.collaborations(user2_id);
CREATE INDEX IF NOT EXISTS idx_project_pitches_user      ON public.project_pitches(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Functions & Triggers (profiles completion / unlock / access code)
-- ─────────────────────────────────────────────────────────────────────────────
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

CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_percentage := public.calculate_profile_completion(NEW.id);
  NEW.profile_unlocked := public.check_profile_unlock(NEW.id);
  NEW.verified_creative := NEW.profile_unlocked;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_completion ON public.profiles;
CREATE TRIGGER trigger_update_profile_completion
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_completion();


-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.opportunities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_pitches ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- Policies (idempotent blocks)
-- ─ Opportunities
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='opportunities'
      AND policyname='Opportunities are viewable by everyone'
  ) THEN
    CREATE POLICY "Opportunities are viewable by everyone"
      ON public.opportunities FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='opportunities'
      AND policyname='Users can create their own opportunities'
  ) THEN
    CREATE POLICY "Users can create their own opportunities"
      ON public.opportunities FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='opportunities'
      AND policyname='Users can update their own opportunities'
  ) THEN
    CREATE POLICY "Users can update their own opportunities"
      ON public.opportunities FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='opportunities'
      AND policyname='Users can delete their own opportunities'
  ) THEN
    CREATE POLICY "Users can delete their own opportunities"
      ON public.opportunities FOR DELETE USING (auth.uid() = user_id);
  END IF;
END$$;

-- ─ Invitations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='invitations'
      AND policyname='Users can view invitations they sent or received'
  ) THEN
    CREATE POLICY "Users can view invitations they sent or received"
      ON public.invitations FOR SELECT
      USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='invitations'
      AND policyname='Users can send invitations'
  ) THEN
    CREATE POLICY "Users can send invitations"
      ON public.invitations FOR INSERT
      WITH CHECK (auth.uid() = from_user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='invitations'
      AND policyname='Users can update invitations they received'
  ) THEN
    CREATE POLICY "Users can update invitations they received"
      ON public.invitations FOR UPDATE
      USING (auth.uid() = to_user_id);
  END IF;
END$$;

-- ─ Collaborations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='collaborations'
      AND policyname='Users can view their own collaborations'
  ) THEN
    CREATE POLICY "Users can view their own collaborations"
      ON public.collaborations FOR SELECT
      USING (auth.uid() = user1_id OR auth.uid() = user2_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='collaborations'
      AND policyname='Users can create collaborations'
  ) THEN
    CREATE POLICY "Users can create collaborations"
      ON public.collaborations FOR INSERT
      WITH CHECK (true);
  END IF;
END$$;

-- ─ Project Pitches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='project_pitches'
      AND policyname='Users can view their own pitches'
  ) THEN
    CREATE POLICY "Users can view their own pitches"
      ON public.project_pitches FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='project_pitches'
      AND policyname='Users can create their own pitches'
  ) THEN
    CREATE POLICY "Users can create their own pitches"
      ON public.project_pitches FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='project_pitches'
      AND policyname='Users can update their own pitches'
  ) THEN
    CREATE POLICY "Users can update their own pitches"
      ON public.project_pitches FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE  public.opportunities  IS 'Collaboration opportunity posts created by users';
COMMENT ON TABLE  public.invitations    IS 'Collaboration invitations sent between users';
COMMENT ON TABLE  public.collaborations IS 'Accepted and tracked collaborations';
COMMENT ON TABLE  public.project_pitches IS 'User project pitches for verification';

COMMENT ON COLUMN public.profiles.profile_completion_percentage IS 'Percentage of profile fields completed (0-100)';
COMMENT ON COLUMN public.profiles.verified_creative             IS 'Badge shown when profile is fully unlocked';
COMMENT ON COLUMN public.profiles.private_mode                  IS 'User preference to stay in private/anonymous mode';
COMMENT ON COLUMN public.profiles.profile_unlocked              IS 'True when profile meets unlock criteria (100% complete + 1 collab or 10 views)';
COMMIT;

