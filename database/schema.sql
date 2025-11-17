-- Supabase Database Schema for Music Collab App
-- Run this in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  genres_raw TEXT NOT NULL,
  location TEXT NOT NULL,
  availability TEXT NOT NULL,
  skills_raw TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  collab_type TEXT NOT NULL,
  social_links TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_created ON profiles(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read profiles (for matching)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert profiles (for now)
-- In production, you'd want authentication here
CREATE POLICY "Anyone can create profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own profile
-- In production, you'd check auth.uid() = user_id
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (true);

-- Optional: Create a view for public profile data (excludes email)
CREATE OR REPLACE VIEW public_profiles AS
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
  created_at
FROM profiles;

-- Grant access to the view
GRANT SELECT ON public_profiles TO anon, authenticated;

-- Create a stats view for analytics
CREATE OR REPLACE VIEW profile_stats AS
SELECT
  COUNT(*) as total_profiles,
  COUNT(DISTINCT role) as unique_roles,
  COUNT(DISTINCT experience_level) as experience_levels,
  MAX(created_at) as latest_profile,
  MIN(created_at) as first_profile
FROM profiles;

GRANT SELECT ON profile_stats TO anon, authenticated;

-- Sample data for testing (optional)
-- Uncomment to insert test data
/*
INSERT INTO profiles (email, name, role, genres_raw, location, availability, skills_raw, experience_level, collab_type, social_links)
VALUES
  ('alex@example.com', 'Alex Rivera', 'producer', 'hip-hop, r&b, trap', 'Toronto, Canada', 'part-time', 'mixing, mastering, beat making', 'professional', 'revenue-split', 'https://instagram.com/alex, https://soundcloud.com/alex'),
  ('jordan@example.com', 'Jordan Smith', 'artist', 'pop, indie, alternative', 'Los Angeles, USA', 'full-time', 'vocals, songwriting', 'intermediate', 'paid', 'https://instagram.com/jordan'),
  ('sam@example.com', 'Sam Chen', 'songwriter', 'r&b, soul, jazz', 'New York, USA', 'weekends', 'lyrics, melody writing', 'professional', 'feature-swap', 'https://twitter.com/samchen')
ON CONFLICT (email) DO NOTHING;
*/
