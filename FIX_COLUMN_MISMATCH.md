# Fix Column Name Mismatch - Quick Solution

## Problem: Your database has "genre" but code expects "genres_raw"

You're right! The column names don't match. Here are two solutions:

---

## ✅ Solution 1: Rename Columns in Supabase (Recommended - 2 minutes)

### Step 1: Check What Columns You Have

Go to Supabase → Table Editor → Click "profiles" table

You probably have columns like:
- ❌ **genre** (should be **genres_raw**)
- ❌ **skills** (should be **skills_raw**)

### Step 2: Run This SQL to Fix Column Names

Go to Supabase → SQL Editor → New Query → Paste this:

```sql
-- Rename columns to match what the code expects
ALTER TABLE profiles
  RENAME COLUMN genre TO genres_raw;

-- If you also have "skills" instead of "skills_raw", uncomment this:
-- ALTER TABLE profiles
--   RENAME COLUMN skills TO skills_raw;

-- Verify the columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

Click **Run**

### Step 3: Verify

After running, you should see these columns:
- ✅ genres_raw
- ✅ skills_raw

---

## ✅ Solution 2: Add Missing Columns (If Rename Doesn't Work)

If the rename fails or you want to keep both columns, run this instead:

```sql
-- Add missing columns if they don't exist
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS genres_raw TEXT;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS skills_raw TEXT;

-- Copy data from old columns to new ones (if you have data)
UPDATE profiles
  SET genres_raw = genre
  WHERE genres_raw IS NULL AND genre IS NOT NULL;

UPDATE profiles
  SET skills_raw = skills
  WHERE skills_raw IS NULL AND skills IS NOT NULL;

-- Optional: Drop old columns after copying (uncomment if you want)
-- ALTER TABLE profiles DROP COLUMN IF EXISTS genre;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS skills;
```

---

## 🎯 Quick Check: What Columns Do You Actually Have?

Run this in Supabase SQL Editor to see ALL your columns:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

Share the output and I'll give you the exact SQL to fix it!

---

## ✅ After Running the SQL

1. Refresh your Supabase Table Editor
2. Click on **profiles** table
3. Verify you see:
   - ✅ **genres_raw** (not "genre")
   - ✅ **skills_raw** (not "skills")

4. Now test your app:
   - Go to your deployed site
   - Complete signup
   - Click "Save Profile"
   - Should work now! ✅

---

## 🐛 Common Column Mismatches

The code expects these exact column names:

| What Code Expects | What You Might Have |
|-------------------|---------------------|
| `genres_raw` | ❌ `genre` or `genres` |
| `skills_raw` | ❌ `skill` or `skills` |
| `experience_level` | ❌ `experience` or `level` |
| `collab_type` | ❌ `collaboration_type` |
| `social_links` | ❌ `social` or `links` |

If you have any of these mismatches, rename them!

---

## 💡 Pro Tip: Drop and Recreate Table

If your table is empty (no data yet), the easiest solution is:

```sql
-- Drop the existing table
DROP TABLE IF EXISTS profiles CASCADE;

-- Create the correct table from scratch
CREATE TABLE profiles (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can create profile"
  ON profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (true);
```

This creates the table with the EXACT column names the code expects!

---

## 🎯 Quick Fix Summary

**Option 1:** Rename `genre` → `genres_raw` (keeps your data)
**Option 2:** Add `genres_raw` column (keeps both columns)
**Option 3:** Drop and recreate table (if no data yet)

Pick the one that works for you and run it in Supabase SQL Editor!
