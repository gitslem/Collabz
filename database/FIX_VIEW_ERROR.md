# Fix: "cannot change name of view column" Error

## The Problem

You're seeing this error:
```
ERROR: 42P16: cannot change name of view column "total_profiles" to "id"
HINT: Use ALTER VIEW ... RENAME COLUMN ... to change name of view column instead.
```

This happens because you previously ran an older version of the schema, and now the views have conflicting column structures.

---

## Quick Fix (Option 1) - Recommended ✅

### Step 1: Run the Reset Script
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the contents of `database/reset_schema.sql`
4. Paste into SQL Editor
5. Click **Run** (Ctrl/Cmd + Enter)
6. You should see: "Success. No rows returned"

⚠️ **WARNING**: This deletes all existing data in your CollabX tables!

### Step 2: Run the Complete Schema
1. Stay in **SQL Editor**
2. Click **New query**
3. Copy the contents of `database/complete_collabx_schema.sql`
4. Paste into SQL Editor
5. Click **Run** (Ctrl/Cmd + Enter)
6. You should see: "Success. No rows returned"

### Step 3: Verify Tables Created
1. Go to **Table Editor**
2. You should see these 5 tables:
   - ✅ profiles
   - ✅ opportunities
   - ✅ invitations
   - ✅ collaborations
   - ✅ project_pitches

---

## Alternative Fix (Option 2) - Manual Cleanup

If you don't want to use the reset script, run these commands manually in SQL Editor:

```sql
-- Drop the conflicting views
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.profile_stats CASCADE;

-- Now run the complete_collabx_schema.sql
```

Then run `complete_collabx_schema.sql`.

---

## What Changed?

The updated `complete_collabx_schema.sql` now:
- ✅ Explicitly drops views before creating them
- ✅ Uses `DROP VIEW IF EXISTS ... CASCADE`
- ✅ Prevents column structure conflicts

---

## If You Still Get Errors

### Error: "relation already exists"
**Solution**: Use Option 1 (reset script) to completely clean the database first.

### Error: "permission denied"
**Solution**: Make sure you're running the script as the database owner (you should be if you're in Supabase dashboard).

### Error: "trigger already exists"
**Solution**: The script now includes `DROP TRIGGER IF EXISTS` - make sure you're using the latest version of `complete_collabx_schema.sql`.

---

## Summary

**Fastest solution:**
1. Run `database/reset_schema.sql` (deletes everything)
2. Run `database/complete_collabx_schema.sql` (recreates everything fresh)
3. Done! ✅

---

## Files Updated

- ✅ `database/complete_collabx_schema.sql` - Now drops views before creating
- ✅ `database/reset_schema.sql` - NEW: Complete database reset script
- ✅ This guide - `database/FIX_VIEW_ERROR.md`

---

**Need more help?** Check the main setup guide: `SUPABASE_AUTHENTICATION_SETUP.md`
