# 🚀 Complete Setup Walkthrough

Follow these steps in order to get your app live!

---

## 📅 Timeline: 20 Minutes Total

```
Step 1: Get Supabase Keys     [5 min]  ━━━━━━━━━━
Step 2: Get OpenAI Key         [5 min]  ━━━━━━━━━━
Step 3: Test Locally           [5 min]  ━━━━━━━━━━
Step 4: Deploy Live            [5 min]  ━━━━━━━━━━
                                        ──────────────
                                 TOTAL: 20 minutes
```

---

## 🎯 Step 1: Get Supabase Keys (5 minutes)

### Quick Steps:
1. **Go to**: https://app.supabase.com
2. **Sign in** with GitHub
3. **Create project**: Name it "music-collab"
4. **Wait** 2 minutes for setup
5. **Get keys**: Settings → API → Copy these:
   - Project URL (your `SUPABASE_URL`)
   - anon public key (your `SUPABASE_KEY`)
6. **Setup database**: SQL Editor → Paste from `database/schema.sql` → Run

### What You Get:
```
SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxx...
```

### ✅ Checklist:
- [ ] Supabase account created
- [ ] Project created and ready
- [ ] Copied SUPABASE_URL
- [ ] Copied SUPABASE_KEY (anon public)
- [ ] Database schema ran successfully
- [ ] See "profiles" table in Table Editor

📖 **Need detailed help?** See [HOW_TO_GET_API_KEYS.md](HOW_TO_GET_API_KEYS.md#part-1-get-supabase-api-keys-5-minutes)

---

## 🤖 Step 2: Get OpenAI Key (5 minutes)

### Quick Steps:
1. **Go to**: https://platform.openai.com
2. **Sign up** and verify phone
3. **Add billing**: Settings → Billing → Add card
4. **Add $10** credit (or set auto-charge)
5. **Set limit**: Hard limit = $20
6. **Create key**: API Keys → + Create → Copy it!

### What You Get:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ✅ Checklist:
- [ ] OpenAI account created
- [ ] Billing info added
- [ ] Credits added ($5-10) or auto-charge enabled
- [ ] Spending limit set ($10-20)
- [ ] API key created and copied
- [ ] Key saved somewhere safe!

📖 **Need detailed help?** See [HOW_TO_GET_API_KEYS.md](HOW_TO_GET_API_KEYS.md#part-2-get-openai-api-key-5-minutes)

---

## 💻 Step 3: Test Locally (5 minutes)

### Create Environment Files:

#### Backend:
```bash
cd backend
cat > .env << 'EOF'
OPENAI_API_KEY=sk-proj-your-actual-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
EOF
```

Then **edit** `backend/.env` and replace with your real keys!

#### Frontend:
```bash
cd ../frontend
cat > .env << 'EOF'
VITE_SUPABASE_KEY=your-supabase-anon-key-here
VITE_API_URL=http://localhost:8000
EOF
```

Then **edit** `frontend/.env` and replace with your real keys!

### Start Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Should see: `Application startup complete.`

### Start Frontend (new terminal):
```bash
cd frontend
npm install
npm run dev
```

Should see: `Local: http://localhost:5173`

### Test It:
1. Open http://localhost:5173
2. Fill out the form
3. Submit a profile
4. Check if it saves!

### ✅ Checklist:
- [ ] Backend .env created with real keys
- [ ] Frontend .env created with real keys
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can fill out form
- [ ] Profile saves successfully
- [ ] No errors in console (F12)

---

## 🌐 Step 4: Deploy Live (5 minutes)

### Deploy Backend to Railway:

1. **Go to**: https://railway.app
2. **Sign in** with GitHub
3. **New Project** → **Deploy from GitHub**
4. Select: `gitslem/collabx`
5. **Settings** → **Root Directory**: `backend`
6. **Variables** tab → Add:
   ```
   OPENAI_API_KEY=your-key
   SUPABASE_URL=your-url
   SUPABASE_KEY=your-key
   ```
7. **Settings** → **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
8. **Networking** → **Generate Domain**
9. **Copy your backend URL**: `https://xxx.railway.app`

### Deploy Frontend to Vercel:

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Add New** → **Project**
4. Import: `gitslem/collabx`
5. **Framework**: Vite
6. **Root Directory**: `frontend`
7. **Environment Variables**:
   ```
   VITE_SUPABASE_KEY=your-supabase-key
   VITE_API_URL=https://your-railway-url.railway.app
   ```
8. **Deploy**
9. Wait 2 minutes
10. **Your app is live!** 🎉

### Update CORS:

Edit `backend/main.py` and add your Vercel URL:
```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-app.vercel.app",  # Add this
    "https://*.vercel.app",          # Add this
],
```

Commit and push - Railway auto-deploys!

### ✅ Checklist:
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] CORS updated in backend
- [ ] Backend redeployed with new CORS
- [ ] Live app works at Vercel URL

---

## 🎉 You're Live!

Your app is now running at: `https://your-app.vercel.app`

### Test Your Live App:
1. Visit your Vercel URL
2. Fill out the profile form
3. Submit
4. Check if matches appear
5. Share with friends!

---

## 🐛 Common Issues

### "Failed to fetch"
**Problem**: Frontend can't reach backend

**Fix**:
```bash
# Check VITE_API_URL in Vercel matches your Railway URL
# Example:
# VITE_API_URL=https://collabx-backend-production.up.railway.app
```

### "CORS Error"
**Problem**: Backend blocking frontend requests

**Fix**: Make sure you updated `backend/main.py` CORS and redeployed

### "OpenAI Error"
**Problem**: No credits or invalid key

**Fix**: Check https://platform.openai.com/usage

### Backend Not Responding
**Problem**: Railway free tier sleeps after 10min

**Fix**: First request after sleep takes 30-60 seconds. This is normal!

---

## 💰 Current Costs

- Railway: **$0** (free tier)
- Vercel: **$0** (free tier)
- Supabase: **$0** (free tier)
- OpenAI: **~$0.10 per 100 users**

**Total: Less than $5/month** for hundreds of users!

---

## 📊 Monitor Your App

### Check Backend Logs:
- Railway: Project → Deployments → View Logs

### Check Frontend Logs:
- Vercel: Project → Deployments → Click deployment → Logs

### Check API Usage:
- OpenAI: https://platform.openai.com/usage
- Supabase: Project → Settings → Billing

---

## 🎯 Next Steps

1. **Share your app** with musician friends
2. **Get feedback**
3. **Add features**:
   - User authentication
   - Direct messaging
   - Profile editing
   - File uploads

---

## 📚 All Guides

- **This Guide**: Overview and checklist
- **[HOW_TO_GET_API_KEYS.md](HOW_TO_GET_API_KEYS.md)**: Detailed API key instructions
- **[QUICK_START.md](QUICK_START.md)**: Alternative quick deploy guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Comprehensive deployment guide
- **[PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)**: Pre-deployment checklist

---

## ⏱️ Quick Reference Times

| Task | Time |
|------|------|
| Get Supabase keys | 5 min |
| Get OpenAI key | 5 min |
| Test locally | 5 min |
| Deploy to Railway | 3 min |
| Deploy to Vercel | 2 min |
| **TOTAL** | **20 min** |

---

## 🎵 Let's Go!

You have everything you need. Start with **Step 1** above!

Questions? Check the detailed guides linked above.

**Good luck! 🚀**
