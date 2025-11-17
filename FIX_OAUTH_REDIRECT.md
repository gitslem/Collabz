# Fix Google OAuth ERR_CONNECTION_REFUSED

## Problem
After Google OAuth authentication, the browser redirects to `https://localhost:300` which causes `ERR_CONNECTION_REFUSED` because nothing is listening on that port.

## Root Cause
The Supabase project's Site URL configuration is incorrectly set to `https://localhost:300` instead of the correct development URL.

## Solution

### Step 1: Fix Supabase Dashboard Configuration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `xiljhvtsanncqpjaydor`
3. Navigate to **Authentication** → **URL Configuration**
4. Update the **Site URL** field:
   - **Current (wrong)**: `https://localhost:300`
   - **Correct for development**: `http://localhost:5173`
   - **For production**: `https://your-production-domain.com`

5. Add the following to **Redirect URLs** (if not already present):
   ```
   http://localhost:5173/**
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```

6. Click **Save**

### Step 2: Verify Environment Configuration

The `.env` file has been created with the correct configuration:

```env
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
VITE_SITE_URL=http://localhost:5173
```

### Step 3: Code Changes Made

The OAuth redirect now uses the `VITE_SITE_URL` environment variable instead of `window.location.origin`:

```javascript
// frontend/src/App.jsx
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

const handleOAuthLogin = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: SITE_URL  // Now uses environment variable
    }
  });
};
```

### Step 4: Test the OAuth Flow

1. Make sure the Vite dev server is running:
   ```bash
   cd frontend
   npm run dev
   ```

2. Access the app at: `http://localhost:5173`

3. Click "Continue with Google"

4. After authentication, you should be redirected back to `http://localhost:5173`

## Google Cloud Console Configuration

Ensure your Google OAuth credentials have the correct origins and redirect URIs:

### Authorized JavaScript Origins
- `http://localhost:5173`
- `http://localhost:3000`
- `https://your-production-domain.com` (for production)

### Authorized Redirect URIs
- `https://xiljhvtsanncqpjaydor.supabase.co/auth/v1/callback`

## Production Deployment

When deploying to production (e.g., Vercel):

1. Set the `VITE_SITE_URL` environment variable in Vercel:
   ```
   VITE_SITE_URL=https://your-app.vercel.app
   ```

2. Update Supabase Site URL to your production domain

3. Add your production domain to Google OAuth authorized origins

## Troubleshooting

### Still getting redirected to wrong URL?
- Clear browser cache and cookies
- Check Supabase Dashboard → Authentication → URL Configuration
- Verify `.env` file exists in `frontend/` directory
- Restart the Vite dev server

### OAuth button disabled?
- Check if `VITE_SUPABASE_KEY` is set in `.env`
- Look for console errors in browser DevTools

### Error: "Authentication service not available"
- Verify Supabase key is correct in `.env`
- Check browser console for initialization errors
