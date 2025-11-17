# 🚀 Supabase Database Setup Guide for CollabX

Complete step-by-step instructions to set up your CollabX database in Supabase.

---

## 📋 Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Supabase project created
- Node.js and npm installed (for running the frontend)

---

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and **log in**
2. Click **"New Project"**
3. Fill in the project details:
   - **Project Name**: `collabx` (or your preferred name)
   - **Database Password**: Choose a strong password and **save it!**
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (takes 1-2 minutes)

---

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon in sidebar)
2. Go to **API** section
3. Copy the following two values:
   - **Project URL** (e.g., `https://xiljhvtsanncqpjaydor.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
4. **Save these** - you'll need them in the next step

---

## Step 3: Configure Frontend Environment Variables

1. Navigate to the `frontend` folder in your project
2. Create or edit the `.env` file:

```bash
cd frontend
```

3. Add your Supabase credentials (replace with your actual values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
VITE_API_URL=http://localhost:8000
```

**Example:**
```env
VITE_SUPABASE_URL=https://xiljhvtsanncqpjaydor.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbGpodnRzYW5uY3FwamF5ZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk...
VITE_API_URL=http://localhost:8000
```

---

## Step 4: Run the Base Schema (Required) ✅

This creates the main `profiles` table that stores user profiles.

### How to Run in Supabase:

1. In your Supabase project dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"** button
3. Open the file `database/schema.sql` from this repository
4. **Copy all the contents** of `schema.sql`
5. **Paste** it into the SQL Editor
6. Click **"Run"** button (or press **Ctrl/Cmd + Enter**)
7. You should see **"Success. No rows returned"** ✅

### What This Creates:

- ✅ `profiles` table with columns:
  - `id` (UUID, auto-generated)
  - `email` (unique, required)
  - `name`, `role`, `genres_raw`, `location`
  - `availability`, `skills_raw`, `experience_level`
  - `collab_type`, `social_links`
  - `created_at`, `updated_at` (automatic timestamps)
- ✅ Indexes for better query performance
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates

---

## Step 5: Run the Extended Schema (Highly Recommended) ⭐

This adds **advanced features** like access codes, private mode, opportunities, and invitations.

### How to Run in Supabase:

1. In the same **SQL Editor**, click **"New query"** again
2. Open the file `database/extended_schema.sql` from this repository
3. **Copy all the contents** of `extended_schema.sql`
4. **Paste** it into the SQL Editor
5. Click **"Run"** button (or press **Ctrl/Cmd + Enter**)
6. You should see **"Success. No rows returned"** ✅

### What This Adds:

**New Columns to `profiles` table:**
- ✅ `access_code` - 4-digit code for profile access (auto-generated!)
- ✅ `private_mode` - Hide/show your profile from other users
- ✅ `profile_completion_percentage` - Automatically calculated (0-100%)
- ✅ `verified_creative` - Verified badge for users
- ✅ `accepted_collabs` - Count of accepted collaborations
- ✅ `profile_views` - Count of profile views/clicks
- ✅ `profile_unlocked` - Full profile visibility unlock status

**New Tables Created:**
- ✅ `opportunities` - Collaboration opportunity posts
- ✅ `invitations` - Collaboration invitations between users
- ✅ `collaborations` - Track accepted collaborations
- ✅ `project_pitches` - User project pitches for verification

**Database Functions & Triggers:**
- ✅ Auto-generate 4-digit access codes on signup
- ✅ Calculate profile completion percentage
- ✅ Check profile unlock criteria (100% complete + 1 collab OR 10 views)
- ✅ Track collaboration counts and profile views
- ✅ Auto-update profile stats

---

## Step 6: Verify the Setup 🔍

Run this query in the SQL Editor to verify everything is set up correctly:

```sql
-- Check profiles table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**You should see these columns:**
- id, email, name, role, genres_raw, location, availability, skills_raw, experience_level, collab_type, social_links, created_at, updated_at
- **Plus (if extended_schema ran):** access_code, private_mode, profile_completion_percentage, verified_creative, accepted_collabs, profile_views, profile_unlocked

**Check if all tables exist:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**You should see:**
- collaborations
- invitations
- opportunities
- profiles
- project_pitches

---

## Step 7: Test with a Sample Profile (Optional) 🧪

Run this query to create a test profile and verify access code generation:

```sql
INSERT INTO profiles (
  email,
  name,
  role,
  genres_raw,
  location,
  availability,
  skills_raw,
  experience_level,
  collab_type,
  social_links
)
VALUES (
  'test@example.com',
  'Test User',
  'producer',
  'hip-hop, r&b',
  'Toronto, Canada',
  'part-time',
  'mixing, mastering',
  'professional',
  'revenue-split',
  'https://instagram.com/test'
)
RETURNING id, email, name, access_code, profile_completion_percentage;
```

**Expected Result:**
- You should see the profile returned
- **With a 4-digit access_code** (e.g., 3847) automatically generated!
- With profile_completion_percentage = 100

---

## Step 8: Start the Application 🎯

With the database set up, you can now start the application:

```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

**Backend (Optional - for AI matching features):**
```bash
# Terminal 2 - Backend
cd backend
pip install -r requirements.txt
python main.py
```

---

## 🎉 You're All Set!

Your CollabX app is now ready to use with:
- ✅ User profiles with signup/login
- ✅ 4-digit access code authentication
- ✅ Private mode for profile visibility
- ✅ Collaboration opportunities posting
- ✅ Invitation system
- ✅ Profile unlocking system

---

## 🔧 Troubleshooting

### Error: "Could not find the table 'opportunities' in the schema cache"
**Problem:** The `opportunities` table doesn't exist.
**Solution:** Run `extended_schema.sql` (Step 5 above).

### Error: "Could not find the 'access_code' column"
**Problem:** The `access_code` column hasn't been added.
**Solution:** Run `extended_schema.sql` (Step 5 above).
**Note:** The latest app version generates access codes even without this, but you should still run it for full features.

### Error: "Could not find the 'private_mode' column"
**Problem:** The `private_mode` column hasn't been added.
**Solution:** Run `extended_schema.sql` (Step 5 above).

### Error: "genres_raw column not found"
**Problem:** The base `profiles` table hasn't been created.
**Solution:** Run `schema.sql` (Step 4 above).

### Access code not showing after signup
**Fix:** This is now fixed in the latest version! Access codes are generated in the frontend as a fallback.
**Recommendation:** Still run `extended_schema.sql` for database-generated codes and full features.

### Database connection errors
**Solutions:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` in `frontend/.env`
2. Make sure you're using the **anon public key**, NOT the service role key
3. Check that your Supabase project is active (not paused)
4. Restart the frontend dev server after changing `.env`

### Private mode or opportunities not working
**Problem:** Extended schema features aren't available.
**Solution:** Run `extended_schema.sql` (Step 5).
**Note:** The app now shows helpful error messages guiding you to run the schema.

---

## 📊 Database Schema Diagram

```
profiles (Main User Table)
├── id (uuid, primary key)
├── email (text, unique) ⚡
├── name (text)
├── role (text)
├── genres_raw (text)
├── location (text)
├── availability (text)
├── skills_raw (text)
├── experience_level (text)
├── collab_type (text)
├── social_links (text)
├── access_code (text) 🆕 AUTO-GENERATED
├── private_mode (boolean) 🆕
├── profile_completion_percentage (integer) 🆕 AUTO-CALCULATED
├── verified_creative (boolean) 🆕
├── accepted_collabs (integer) 🆕
├── profile_views (integer) 🆕
├── profile_unlocked (boolean) 🆕 AUTO-UPDATED
├── created_at (timestamptz)
└── updated_at (timestamptz) AUTO-UPDATED

opportunities (Collaboration Posts)
├── id (uuid, primary key)
├── user_id (uuid → profiles.id)
├── looking_for_role (text)
├── location (text)
├── description (text)
├── genres (text)
├── status (text: 'active' or 'closed')
├── created_at (timestamptz)
└── updated_at (timestamptz)

invitations (Collab Requests)
├── id (uuid, primary key)
├── opportunity_id (uuid → opportunities.id)
├── from_user_id (uuid → profiles.id)
├── to_user_id (uuid → profiles.id)
├── status (text: 'pending', 'accepted', 'rejected')
├── message (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

collaborations (Accepted Collabs)
├── id (uuid, primary key)
├── invitation_id (uuid → invitations.id)
├── user1_id (uuid → profiles.id)
├── user2_id (uuid → profiles.id)
├── project_name (text)
├── verified (boolean)
├── completed (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)

project_pitches (Verified Pitches)
├── id (uuid, primary key)
├── user_id (uuid → profiles.id)
├── project_name (text)
├── description (text)
├── verified (boolean)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

**Legend:**
- ⚡ = Indexed for better query performance
- 🆕 = Added by extended_schema.sql
- AUTO-* = Automatically maintained by database triggers

---

## 🔐 Security Notes

- ✅ The app uses **Row Level Security (RLS)** to protect user data
- ✅ Access codes are 4 digits for easy user access
- ✅ The **anon public key** is safe to use in frontend code
- ⚠️ **NEVER** expose the **service role key** in frontend code
- ⚠️ For production, consider hashing access codes or using stronger authentication

---

## 🌟 Features Unlocked by Extended Schema

Once you run `extended_schema.sql`, these features become available:

### ✅ Access Code System
- 4-digit codes auto-generated on signup
- Users can log in with their access code
- Edit profile with access code verification

### ✅ Private Mode
- Hide your profile from other users
- Toggle on/off from dashboard
- Useful for taking a break from collaborations

### ✅ Opportunities System
- Post collaboration opportunities (max 2 per user)
- Browse opportunities from other users
- Filter by role, location, genres
- Send invitations to users

### ✅ Profile Unlocking
- **Lock state**: Basic info visible (name, role, genres, location)
- **Unlock state**: Full details visible (skills, social links, collab preferences)
- **How to unlock**: 100% profile completion + 1 accepted collab OR 10 profile views

### ✅ Verified Badge
- Displayed when profile is unlocked
- Shows user is a serious collaborator

### ✅ Profile Completion Tracking
- Automatically calculated percentage (0-100%)
- Shows on dashboard
- Encourages users to complete their profile

---

## 📞 Need Help?

If you encounter issues:

1. **Check browser console** (F12 → Console tab) for error messages
2. **Check Supabase logs** (Dashboard → Logs) for database errors
3. **Verify SQL scripts ran successfully** (no red error messages)
4. **Check environment variables** in `frontend/.env`
5. **Restart dev server** after changing `.env` file

---

## 🎵 Happy Collaborating!

You're now ready to connect with other music creators and build amazing projects together!

If you found this helpful, consider starring the repository ⭐

---

**Last Updated:** 2025-01-11
**Version:** 2.0 - Complete setup guide with troubleshooting
