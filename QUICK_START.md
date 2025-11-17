# Quick Start - Deploy in 10 Minutes

Follow these exact steps to get your app live quickly.

## ⚡ Fastest Path: Railway + Vercel

### Step 1: Get Your API Keys (5 minutes)

#### A. OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click **"Create new secret key"**
4. Name it: `collabx-production`
5. **COPY THE KEY** (starts with `sk-proj-...`)
6. Save it somewhere safe

#### B. Supabase Keys
1. Go to: https://app.supabase.com
2. Open your project
3. Go to **Settings** → **API**
4. Copy these two:
   - **Project URL** (e.g., `https://xiljhvtsanncqpjaydor.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

### Step 2: Deploy Backend to Railway (3 minutes)

#### 2.1 Sign Up
1. Go to: https://railway.app
2. Click **"Login with GitHub"**
3. Authorize Railway

#### 2.2 Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `gitslem/collabx`
4. Railway will detect it's a Python app
5. Click **"Add Variables"** and add:
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   SUPABASE_URL=https://xiljhvtsanncqpjaydor.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   ```
6. Click **"Deploy"**

#### 2.3 Configure
1. Go to **Settings** tab
2. Set **Root Directory**: `backend`
3. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **"Generate Domain"** under **Networking**
5. **COPY YOUR BACKEND URL** (e.g., `https://collabx-backend.up.railway.app`)

---

### Step 3: Deploy Frontend to Vercel (2 minutes)

#### 3.1 Sign Up
1. Go to: https://vercel.com
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

#### 3.2 Deploy
1. Click **"Add New..."** → **"Project"**
2. Click **"Import"** next to `gitslem/collabx`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - Click **"Environment Variables"**
   - Add these:
     ```
     VITE_SUPABASE_KEY=your-supabase-anon-key
     VITE_API_URL=https://your-railway-backend-url.railway.app
     ```
4. Click **"Deploy"**
5. Wait 2 minutes
6. **YOUR APP IS LIVE!** 🎉

---

### Step 4: Update Backend CORS (1 minute)

1. Open your local code
2. Edit `backend/main.py`
3. Find the CORS section (around line 12)
4. Add your Vercel URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-app.vercel.app",  # Add this
        "https://*.vercel.app",          # Add this
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

5. Commit and push:
```bash
git add backend/main.py
git commit -m "Update CORS for production"
git push
```

6. Railway will auto-deploy

---

## ✅ You're Done!

Your app is now live at: `https://your-app.vercel.app`

### Test It:
1. Open your Vercel URL
2. Fill out the form
3. Submit a profile
4. Check if matches appear

---

## Troubleshooting

### "Failed to fetch" error
- Check that `VITE_API_URL` in Vercel matches your Railway URL
- Make sure Railway backend is running (check logs)

### "CORS error"
- Make sure you added your Vercel URL to backend CORS settings
- Redeploy backend after updating CORS

### Backend not responding
- Railway free tier: First request after 10min of inactivity is slow
- Check Railway logs for errors

### OpenAI errors
- Verify your API key is correct
- Check you have credits: https://platform.openai.com/usage

---

## What's Next?

1. **Custom Domain** (Optional)
   - In Vercel: Settings → Domains → Add your domain
   - Free SSL included

2. **Monitor Costs**
   - Railway: Free $5/month credit
   - Vercel: Free for personal projects
   - OpenAI: ~$0.10 per 100 profiles (very cheap)

3. **Add Features**
   - User authentication
   - Direct messaging
   - File uploads for demos
   - Payment integration

4. **Share Your App**
   - Post on social media
   - Share with musician communities
   - Get feedback

---

## Support

Having issues? Check:
- Railway logs: Project → Deployments → View Logs
- Vercel logs: Project → Deployments → Click deployment → View Function Logs
- Browser console: F12 → Console tab

**Free tier limits:**
- Railway: $5 credit/month (~500 hours runtime)
- Vercel: Unlimited deployments, 100GB bandwidth
- Supabase: 500MB database, 2GB bandwidth

---

## Costs

For first 100-1000 users:
- Railway: **$0** (free tier)
- Vercel: **$0** (free tier)
- Supabase: **$0** (free tier)
- OpenAI: **~$5-20/month** (only thing you pay)

Total: **$5-20/month** 🎉

---

## Alternative: One-Command Deploy

If you prefer command line:

```bash
# Install CLIs
npm i -g vercel @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
railway domain  # Get your backend URL

# Deploy frontend
cd ../frontend
vercel --prod
# Add env vars when prompted
```

That's it! Your app is live! 🚀
