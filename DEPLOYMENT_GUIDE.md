# Deployment Guide - Music Collab App

## Overview
This guide will help you deploy your music collaboration app with:
- **Backend**: FastAPI (Python) → Render.com
- **Frontend**: React + Vite → Vercel
- **Database**: Supabase (already hosted)

---

## Prerequisites

1. **Accounts needed** (all have free tiers):
   - GitHub account (you have this)
   - [Render.com](https://render.com) account
   - [Vercel](https://vercel.com) account
   - [OpenAI API](https://platform.openai.com) key
   - Supabase account (you have this)

2. **Required credentials**:
   - `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
   - `SUPABASE_URL` - From your Supabase project settings
   - `SUPABASE_KEY` - From your Supabase project settings (anon/public key)

---

## Step 1: Prepare Your Code

### 1.1 Ensure Database Schema Exists

Log into Supabase and run this SQL to create the profiles table:

```sql
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
```

### 1.2 Push Your Code to GitHub

Your code is already on branch `claude/fix-code-errors-011CUfynaUWtyHwn2zNHK2GM`.
You may want to merge this to main or keep it as is.

---

## Step 2: Deploy Backend to Render

### 2.1 Sign Up for Render
1. Go to https://render.com
2. Sign up with your GitHub account

### 2.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `gitslem/collabx`
3. Configure the service:

**Basic Settings:**
- **Name**: `collabx-backend` (or any name)
- **Region**: Choose closest to your users
- **Branch**: `claude/fix-code-errors-011CUfynaUWtyHwn2zNHK2GM` (or main)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**
- Free tier is fine for testing

### 2.3 Set Environment Variables
In Render dashboard, go to **Environment** tab and add:

```
OPENAI_API_KEY=sk-proj-your-actual-key-here
SUPABASE_URL=https://xiljhvtsanncqpjaydor.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://collabx-backend.onrender.com`)
4. Test: Visit `https://your-backend-url.onrender.com/health`

**Important**: Free tier sleeps after 15 min of inactivity. First request may be slow.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel
1. Go to https://vercel.com
2. Sign up with your GitHub account

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `gitslem/collabx` repository
3. Configure the project:

**Project Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Set Environment Variables
In Vercel project settings, add **Environment Variables**:

```
VITE_SUPABASE_KEY=your-supabase-anon-key-here
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with your actual Render backend URL from Step 2.4.

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://collabx-xyz.vercel.app`

---

## Step 4: Update CORS Settings

Since your backend is now on a different domain, update the CORS settings:

### 4.1 Update Backend CORS
In `backend/main.py`, update the CORS middleware to include your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-app.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"           # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Redeploy Backend
- Commit and push changes
- Render will auto-deploy (or manually trigger)

---

## Step 5: Test Your Live App

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Fill out the profile form**
3. **Check if validation works** (real-time OpenAI validation)
4. **Submit profile**
5. **Verify matches appear**

### Troubleshooting
- **CORS errors**: Check backend CORS settings
- **500 errors**: Check Render logs for backend errors
- **Frontend errors**: Check browser console
- **Slow responses**: Free tier backends sleep - first request takes 30-60s

---

## Alternative Deployment Options

### Backend Alternatives
1. **Railway** (easier than Render)
   - Sign up: https://railway.app
   - Connect GitHub repo
   - Deploy from `backend` folder
   - Set environment variables

2. **Fly.io** (more control)
   - Requires Docker knowledge
   - Better for production

3. **PythonAnywhere** (beginner-friendly)
   - Manual setup required
   - Free tier available

### Frontend Alternatives
1. **Netlify** (similar to Vercel)
   - Sign up: https://netlify.com
   - Same process as Vercel

2. **Cloudflare Pages** (fastest)
   - Sign up: https://pages.cloudflare.com
   - Better global performance

---

## Cost Breakdown (Free Tiers)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Render | ✅ Yes | 750 hours/month, sleeps after 15min |
| Vercel | ✅ Yes | 100GB bandwidth, unlimited projects |
| Supabase | ✅ Yes | 500MB database, 2GB bandwidth |
| OpenAI | 💰 Paid | ~$5 for testing (pay as you go) |

**Total monthly cost**: ~$0-5 (just OpenAI usage)

---

## Production Checklist

Before going fully live:

- [ ] Set up custom domain (Vercel supports this free)
- [ ] Enable SSL (automatic on Vercel/Render)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Add rate limiting to backend
- [ ] Set up database backups (Supabase has this)
- [ ] Add user authentication (Supabase Auth)
- [ ] Optimize OpenAI costs (cache results)
- [ ] Add loading states and better error messages
- [ ] Test on mobile devices
- [ ] Set up analytics (Google Analytics, Plausible)

---

## Environment Variables Reference

### Backend (.env)
```bash
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://xiljhvtsanncqpjaydor.supabase.co
SUPABASE_KEY=eyJhb...
```

### Frontend (.env)
```bash
VITE_SUPABASE_KEY=eyJhb...
VITE_API_URL=https://collabx-backend.onrender.com
```

---

## Quick Deploy Commands

If you prefer Railway (easier):

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Get backend URL
railway domain

# Deploy frontend to Vercel
cd ../frontend
npm i -g vercel
vercel --prod
```

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## Next Steps

After deployment:
1. Share your app link!
2. Gather user feedback
3. Add features (auth, messaging, file uploads)
4. Optimize performance
5. Scale as needed

Good luck with your deployment! 🚀
