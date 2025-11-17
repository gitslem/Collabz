# OAuth Port Configuration Fix

## The Problem

OAuth redirect URLs in Supabase/Google are configured, but your app isn't running on those ports.

---

## Current Port Setup

Your app is configured to run on:

**Development mode:**
```bash
npm run dev
# Runs on: http://localhost:5173 (Vite default)
```

**Production/Preview mode:**
```bash
npm run preview  # or npm start
# Runs on: http://localhost:10000
```

---

## Quick Fix: Start Dev Server

**Step 1: Navigate to frontend folder**
```bash
cd frontend
```

**Step 2: Start the development server**
```bash
npm run dev
```

**Step 3: Check the output**
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: http://xxx.xxx.xxx.xxx:5173/
```

**Step 4: Open in browser**
```
http://localhost:5173
```

Now OAuth redirects should work! ✅

---

## If You're Running on a Different Port

### Option 1: Update OAuth Configs to Match Your Port

If your app runs on a different port (e.g., 3000, 8080), update these:

**In Supabase:**
1. Go to **Authentication** → **URL Configuration**
2. Update **Site URL**: `http://localhost:YOUR_PORT`
3. Update **Redirect URLs**: Add `http://localhost:YOUR_PORT/**`

**In Google Cloud Console:**
1. Go to **Credentials** → Your OAuth Client
2. **Authorized JavaScript origins**: Update to `http://localhost:YOUR_PORT`
3. Keep redirect URI as: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

**In Azure Portal (Microsoft OAuth):**
1. Your app registration → **Authentication**
2. Redirect URI stays the same: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
3. No localhost needed for Azure

---

### Option 2: Change Your App Port to 5173

**Create/update `frontend/.env.local`:**
```env
# Force Vite to use port 5173
PORT=5173
```

Or run with explicit port:
```bash
npm run dev -- --port 5173
```

---

## Understanding OAuth Redirect Flow

Here's how OAuth works:

1. **User clicks "Sign in with Google"** on `http://localhost:5173`
2. **Redirected to Google** for authentication
3. **Google redirects back** to Supabase: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. **Supabase redirects** to your app: `http://localhost:5173`

**Important:**
- Google needs to know about `http://localhost:5173` (JavaScript origin)
- Supabase handles the OAuth callback
- Your app must be running when Supabase redirects back

---

## Common Ports Reference

| Command | Default Port | Use Case |
|---------|--------------|----------|
| `npm run dev` | 5173 | Development with hot reload |
| `npm run preview` | 10000 | Testing production build locally |
| `npm start` | 10000 | Running production build |

---

## Recommended Setup for Development

**1. Use port 5173 (default)**
```bash
cd frontend
npm run dev
```

**2. Configure OAuth for localhost:5173**

**Supabase:**
- Site URL: `http://localhost:5173`
- Redirect URLs: Add `http://localhost:5173/**`

**Google Cloud Console:**
- Authorized JavaScript origins: `http://localhost:5173`

**3. Keep Supabase callback URLs as-is**
- These should always be: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- Don't change these!

---

## Testing OAuth After Port Fix

**1. Start dev server:**
```bash
cd frontend
npm run dev
```

**2. Verify it's running on 5173:**
```
➜  Local:   http://localhost:5173/
```

**3. Open in browser:**
```
http://localhost:5173
```

**4. Test OAuth:**
- Click "Continue with Google"
- Should redirect to Google
- After login, should redirect back to your app
- You should be logged in! ✅

---

## If You Still Get Redirect Errors

### Error: "redirect_uri_mismatch"

**Cause:** Google doesn't recognize your localhost URL

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5173
   ```
4. Save and try again (may take 1-2 minutes to propagate)

### Error: "Invalid redirect URL"

**Cause:** Supabase redirect URL configuration

**Fix:**
1. Supabase → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   http://localhost:5173/**
   ```
3. Set **Site URL**:
   ```
   http://localhost:5173
   ```

### App redirects but shows blank page

**Cause:** App not running on expected port

**Fix:**
- Make sure dev server is running: `npm run dev`
- Check console output for actual port
- Verify browser is on `http://localhost:5173`

---

## Production Deployment

For production (Render, Vercel, Netlify, etc.):

**1. Update Supabase:**
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/**`

**2. Update Google:**
- Authorized JavaScript origins: `https://your-domain.com`
- Keep Supabase callback URL unchanged

**3. Update Microsoft Azure:**
- No changes needed (callback goes to Supabase)

---

## Summary

✅ **For local development:**
- Run: `npm run dev`
- App runs on: `http://localhost:5173`
- Configure OAuth for: `http://localhost:5173`

✅ **For production:**
- Use your actual domain
- Update all OAuth configs to production URL

---

**Still having issues?** Check:
1. ✅ Dev server is running (`npm run dev`)
2. ✅ Browser is on `http://localhost:5173`
3. ✅ OAuth configs include `http://localhost:5173`
4. ✅ Supabase callback URL is `https://xxx.supabase.co/auth/v1/callback`
