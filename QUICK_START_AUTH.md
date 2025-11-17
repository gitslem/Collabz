# CollabX Authentication - Quick Start Guide

**⏱️ Time: 15-20 minutes**

Follow these steps to get Supabase authentication working in your CollabX app.

> **🚨 IMPORTANT:** Your app must be running on `http://localhost:5173` for OAuth to work correctly.
> If you use a different port, see [`OAUTH_PORT_FIX.md`](./OAUTH_PORT_FIX.md) for configuration details.

---

## 📋 Prerequisites

- Supabase account (sign up free at [supabase.com](https://supabase.com))
- Google Cloud account (for Google OAuth)
- Microsoft Azure account (for Microsoft OAuth)
- Node.js and npm installed

---

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Fill in:
   - **Name**: CollabX
   - **Database Password**: (create strong password)
   - **Region**: (closest to you)
3. Click **Create**
4. Wait 2-3 minutes for provisioning

### 2️⃣ Get Your Credentials (1 min)

1. Go to **Settings** (⚙️) → **API**
2. Copy these two values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJ...
   ```
3. Save them somewhere safe!

### 3️⃣ Set Up Database (2 min)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New query**
3. Copy entire contents of `database/complete_collabx_schema.sql`
4. Paste into SQL Editor
5. Click **Run** (Ctrl/Cmd + Enter)
6. Verify: Go to **Table Editor** → Should see 5 tables ✅

### 4️⃣ Configure Frontend (1 min)

1. In your project, navigate to `frontend/` folder
2. Create a file named `.env`
3. Add these lines (paste your actual values):
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Save the file
5. **Start your dev server** (IMPORTANT - must be running for OAuth to work):
   ```bash
   cd frontend
   npm run dev
   ```
6. **Verify the port:** You should see:
   ```
   ➜  Local:   http://localhost:5173/
   ```
   ⚠️ **Note:** OAuth is configured for port 5173. If your app runs on a different port, see `OAUTH_PORT_FIX.md`

### 5️⃣ Test Email Authentication (2 min)

1. Open app: `http://localhost:5173`
2. Click **Sign Up**
3. Enter email and password
4. Click **Create Account**
5. You should be logged in! ✅

---

## 🔐 Optional: Add OAuth (Google/Microsoft)

### Enable Google OAuth (5 min)

**In Google Cloud Console:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → **Create OAuth Client ID**
3. **Application type**: Web application
4. **Authorized redirect URIs**: `https://xxxxx.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**

**In Supabase:**
1. **Authentication** → **Providers** → **Google**
2. Toggle **Enable**
3. Paste **Client ID** and **Client Secret**
4. Click **Save**

### Enable Microsoft OAuth (5 min)

**In Azure Portal:**
1. Go to [portal.azure.com](https://portal.azure.com)
2. **Azure Active Directory** → **App registrations** → **New registration**
3. **Redirect URI**: `https://xxxxx.supabase.co/auth/v1/callback`
4. After creation, go to **Certificates & secrets** → **New client secret**
5. Copy **Application (client) ID** and **Secret value**

**In Supabase:**
1. **Authentication** → **Providers** → **Azure**
2. Toggle **Enable**
3. Paste **Client ID**, **Client Secret**, and **Tenant ID**
4. Click **Save**

---

## ✅ Verify Everything Works

### Test Email/Password
- [ ] Sign up with email
- [ ] Log out
- [ ] Log in with same email

### Test Google OAuth (if configured)
- [ ] Click "Continue with Google"
- [ ] Select account
- [ ] Should redirect back and log in

### Test Microsoft OAuth (if configured)
- [ ] Click "Continue with Microsoft"
- [ ] Enter credentials
- [ ] Should redirect back and log in

### Check Database
- [ ] Go to Supabase → **Authentication** → **Users**
- [ ] Your test users should appear
- [ ] Go to **Table Editor** → **profiles**
- [ ] Each user should have a profile record

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check `.env` file is in `frontend/` folder and dev server restarted |
| OAuth redirect error | Verify redirect URI in OAuth console exactly matches Supabase callback URL |
| User created but no profile | Re-run the SQL schema file to create the trigger |
| Can't log in after signup | Disable "Confirm email" in Supabase → **Auth** → **Settings** for testing |

---

## 📚 Need More Details?

See the complete guide: **[SUPABASE_AUTHENTICATION_SETUP.md](./SUPABASE_AUTHENTICATION_SETUP.md)**

---

## 🎯 Production Checklist

Before going live:
- [ ] Enable email confirmation
- [ ] Set up custom SMTP (Settings → Auth → SMTP)
- [ ] Customize email templates (Authentication → Email Templates)
- [ ] Configure OAuth production URLs
- [ ] Set up environment variables in hosting platform
- [ ] Test password reset flow
- [ ] Enable MFA (optional but recommended)

---

**🎉 You're all set! Your authentication is now working!**
