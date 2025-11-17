# Supabase Authentication Setup Guide for CollabX

Complete step-by-step guide to set up Supabase authentication with email/password and OAuth providers (Google & Microsoft).

---

## Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Set Up Database Schema](#2-set-up-database-schema)
3. [Configure Email/Password Authentication](#3-configure-emailpassword-authentication)
4. [Set Up Google OAuth](#4-set-up-google-oauth)
5. [Set Up Microsoft OAuth](#5-set-up-microsoft-oauth)
6. [Configure Frontend Environment Variables](#6-configure-frontend-environment-variables)
7. [Test Authentication](#7-test-authentication)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up / Log In
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign in with GitHub (recommended) or email

### Step 1.2: Create New Project
1. Click "New Project"
2. Fill in project details:
   - **Name**: `CollabX` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
3. Click "Create new project"
4. Wait 2-3 minutes for project to provision

### Step 1.3: Get Project Credentials
1. Once project is ready, go to **Settings** (gear icon) → **API**
2. Copy and save these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

   ⚠️ **Keep these safe! You'll need them later.**

---

## 2. Set Up Database Schema

### Step 2.1: Access SQL Editor
1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"

### Step 2.2: Run Database Schema
1. Copy the contents from `database/complete_collabx_schema.sql`
2. Paste into the SQL Editor
3. Click "Run" or press `Ctrl/Cmd + Enter`
4. You should see: **"Success. No rows returned"**

### Step 2.3: Verify Tables Created
1. Click **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ profiles
   - ✅ opportunities
   - ✅ invitations
   - ✅ collaborations
   - ✅ project_pitches

---

## 3. Configure Email/Password Authentication

### Step 3.1: Enable Email Auth
1. Go to **Authentication** → **Providers** in left sidebar
2. Find **Email** provider
3. Ensure it's **enabled** (it's enabled by default)

### Step 3.2: Configure Email Settings
1. Go to **Authentication** → **Email Templates**
2. Customize these templates (optional):
   - **Confirm signup**: Email sent when user registers
   - **Magic Link**: For passwordless login (if you want this)
   - **Change Email Address**: When user updates email
   - **Reset Password**: For password recovery

### Step 3.3: Configure Email Provider (Production)
For production, you'll want to use your own SMTP server:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider:
   ```
   SMTP Host: smtp.gmail.com (or your provider)
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   Sender email: noreply@yourdomain.com
   Sender name: CollabX
   ```

**For development**: Supabase will use their default email service (limited)

---

## 4. Set Up Google OAuth

### Step 4.1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure OAuth consent screen first:
   - **User Type**: External
   - **App name**: CollabX
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Scopes**: Add `email` and `profile`
   - Click **Save and Continue**

### Step 4.2: Create OAuth Client
1. **Application type**: Web application
2. **Name**: CollabX
3. **Authorized JavaScript origins**: Add these:
   ```
   http://localhost:5173
   https://your-production-domain.com
   ```
4. **Authorized redirect URIs**: Add this:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   Replace `xxxxx` with your Supabase project ID (from Project URL)

5. Click **Create**
6. Copy **Client ID** and **Client Secret** (keep these safe!)

### Step 4.3: Configure in Supabase
1. Go to Supabase **Authentication** → **Providers**
2. Find **Google** provider
3. Click to expand
4. Toggle **Enable Sign in with Google**
5. Paste your Google credentials:
   - **Client ID (for OAuth)**: Paste from Google
   - **Client Secret (for OAuth)**: Paste from Google
6. Copy the **Callback URL (for OAuth)** shown here
7. Make sure this matches what you entered in Google Console
8. Click **Save**

### Step 4.4: Configure Site URL (CRITICAL!)
⚠️ **This step is critical to prevent ERR_CONNECTION_REFUSED after OAuth login**

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Set the **Site URL** to your application's URL:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://your-production-domain.com`
3. Add **Redirect URLs** (wildcard patterns allowed):
   ```
   http://localhost:5173/**
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```
4. Click **Save**

**Why this matters**: After OAuth authentication, Supabase redirects users back to the Site URL. If this is set incorrectly (e.g., `https://localhost:300`), users will get connection errors.

---

## 5. Set Up Microsoft OAuth

### Step 5.1: Register Azure App
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **Azure Active Directory** (or **Microsoft Entra ID**)
3. Click **App registrations** → **New registration**
4. Fill in:
   - **Name**: CollabX
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: Web, then paste:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     Replace `xxxxx` with your Supabase project ID
5. Click **Register**

### Step 5.2: Get Credentials
1. On the app overview page, copy:
   - **Application (client) ID** - This is your Client ID
   - **Directory (tenant) ID**
2. Click **Certificates & secrets**
3. Click **New client secret**
4. Description: "CollabX Supabase"
5. Expires: Choose duration (24 months recommended)
6. Click **Add**
7. **Copy the secret VALUE immediately** (you won't see it again!)

### Step 5.3: Configure API Permissions
1. Click **API permissions**
2. Click **Add a permission** → **Microsoft Graph**
3. Select **Delegated permissions**
4. Add these:
   - `openid`
   - `profile`
   - `email`
5. Click **Add permissions**

### Step 5.4: Configure in Supabase
1. Go to Supabase **Authentication** → **Providers**
2. Find **Azure** provider
3. Click to expand
4. Toggle **Enable Sign in with Azure**
5. Paste your Microsoft credentials:
   - **Client ID**: Application (client) ID from Azure
   - **Client Secret**: Secret value you copied
   - **Azure Tenant ID**: Directory (tenant) ID from Azure
6. Click **Save**

---

## 6. Configure Frontend Environment Variables

### Step 6.1: Create Environment File
1. In your project root, navigate to `frontend/` directory
2. Create a file named `.env` (if it doesn't exist)

### Step 6.2: Add Supabase Credentials
Add these variables to `.env`:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
VITE_SITE_URL=http://localhost:5173
```

Replace with your actual values:
- `VITE_SUPABASE_URL`: From Step 1.3 (Project URL)
- `VITE_SUPABASE_ANON_KEY`: From Step 1.3 (anon public key)
- `VITE_API_URL`: Your backend API URL (default: `http://localhost:8000`)
- `VITE_SITE_URL`: Your frontend URL for OAuth redirects (dev: `http://localhost:5173`, prod: your domain)

### Step 6.3: Verify Environment Variables
1. Check that your `frontend/src/lib/supabase.js` file imports these:
   ```javascript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

### Step 6.4: Restart Development Server
```bash
cd frontend
npm run dev
```

---

## 7. Test Authentication

### Step 7.1: Test Email/Password Signup
1. Open your app: `http://localhost:5173`
2. Click "Create New Account" or "Sign Up"
3. Enter email and password
4. Click "Sign Up"
5. Check your email for confirmation (if email confirmation is enabled)
6. You should be logged in or see confirmation message

### Step 7.2: Test Email/Password Login
1. On landing page, enter your email and password
2. Click "Sign In"
3. You should be redirected to dashboard

### Step 7.3: Test Google OAuth
1. On landing page, click "Continue with Google" button
2. Select your Google account
3. Grant permissions
4. You should be redirected back and logged in

### Step 7.4: Test Microsoft OAuth
1. On landing page, click "Continue with Microsoft" button
2. Enter Microsoft credentials
3. Grant permissions
4. You should be redirected back and logged in

### Step 7.5: Verify User in Supabase
1. Go to Supabase **Authentication** → **Users**
2. You should see your registered users listed
3. Check **Table Editor** → **profiles** table
4. Each authenticated user should have a profile record

---

## 8. Troubleshooting

### Issue: "Invalid API key"
**Solution**:
- Check that `.env` file is in the correct location (`frontend/.env`)
- Verify the API key is correct (no extra spaces)
- Restart the dev server

### Issue: OAuth redirect not working
**Solution**:
- Verify the redirect URI in OAuth provider console exactly matches Supabase callback URL
- Check that you're using the correct Supabase project URL
- Ensure no trailing slashes in URLs

### Issue: "Email not confirmed"
**Solution**:
1. Go to Supabase **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Disable **Confirm email** for testing
4. For production, keep this enabled and configure proper SMTP

### Issue: User created but no profile
**Solution**:
- Check if RLS policies are enabled on profiles table
- Verify the profile creation trigger exists:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- If missing, run the complete schema again

### Issue: Google OAuth shows "400: redirect_uri_mismatch"
**Solution**:
- Copy the exact callback URL from Supabase
- Go to Google Cloud Console → Credentials
- Edit your OAuth client
- Ensure redirect URI exactly matches (no extra characters)

### Issue: Microsoft OAuth fails
**Solution**:
- Verify tenant ID is correct
- Check that client secret hasn't expired
- Ensure API permissions include `openid`, `profile`, `email`
- Grant admin consent for API permissions if required

### Issue: "User already registered" error
**Solution**:
- This means the email is already in use
- Use password reset flow or login instead
- To remove user: Go to **Authentication** → **Users** → Delete user

---

## Additional Configuration

### Enable Password Reset
1. Go to **Authentication** → **Email Templates**
2. Customize "Reset Password" template
3. Users can request reset via your app's password reset form

### Set Up Row Level Security (RLS)
The schema includes RLS policies, but verify they're enabled:
1. Go to **Table Editor** → Select table
2. Click table name → **Edit table**
3. Check that **Enable Row Level Security** is ON

### Configure Session Duration
1. Go to **Authentication** → **Settings**
2. Scroll to **JWT Settings**
3. Adjust **JWT expiry limit** (default: 3600 seconds = 1 hour)

### Set Up Multi-Factor Authentication (MFA)
1. Go to **Authentication** → **Settings**
2. Enable **Multi-Factor Authentication**
3. Users can enable TOTP in their profile

---

## Environment Variables Summary

### Development (.env)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Production
Set these in your hosting platform (Vercel, Netlify, etc.):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Next Steps

✅ Authentication is now set up!

**Recommended next steps:**
1. Test all authentication flows thoroughly
2. Customize email templates with your branding
3. Set up custom SMTP for production
4. Configure custom domain for Supabase (optional, paid feature)
5. Set up monitoring and alerts for auth failures
6. Implement password strength requirements in your app
7. Add rate limiting for auth endpoints (Supabase includes basic protection)

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth Setup**: https://support.google.com/cloud/answer/6158849
- **Microsoft Azure AD**: https://learn.microsoft.com/en-us/azure/active-directory/
- **CollabX Database Schema**: `database/complete_collabx_schema.sql`

---

**Need Help?** Check the troubleshooting section above or consult Supabase documentation.
