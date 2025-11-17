-- Add avatar field to profiles table
-- This stores the emoji character for the user's space-themed avatar
--
-- IMPORTANT: Run this migration in your Supabase SQL Editor to add avatar support
--
-- This migration adds an avatar column that stores a space-themed emoji for each user.
-- Avatars are randomly assigned during signup from a collection of 30 space-themed emojis
-- including planets, stars, galaxies, rockets, aliens, and other cosmic objects.
--
-- Each avatar has an associated gradient color scheme that is displayed in the UI.

BEGIN;

-- Add avatar column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '🚀';

-- Add comment to document the field
COMMENT ON COLUMN public.profiles.avatar IS 'User space-themed avatar emoji (🪐, 🌍, ⭐, 🚀, 👽, etc.)';

COMMIT;
