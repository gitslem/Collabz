# Pre-Deployment Checklist

Before deploying to production, complete these steps:

## 1. Environment Setup

### ✅ Backend Environment Variables
- [ ] `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- [ ] `SUPABASE_URL` - Get from Supabase project settings
- [ ] `SUPABASE_KEY` - Get from Supabase project settings (anon/public key)

### ✅ Frontend Environment Variables
- [ ] `VITE_SUPABASE_KEY` - Same as backend SUPABASE_KEY
- [ ] `VITE_API_URL` - Will be your deployed backend URL

---

## 2. Database Setup

### ✅ Supabase Database
1. [ ] Log into https://app.supabase.com
2. [ ] Go to SQL Editor
3. [ ] Run the schema from `/database/schema.sql`
4. [ ] Verify table was created: Go to Table Editor → Check for `profiles` table
5. [ ] Test with sample data (optional)

---

## 3. API Keys Setup

### OpenAI API Key
1. [ ] Go to https://platform.openai.com/api-keys
2. [ ] Create new secret key
3. [ ] Add billing info: https://platform.openai.com/account/billing
4. [ ] Set spending limit: $10-20 for testing
5. [ ] Test key works:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY_HERE"
```

### Supabase Keys
1. [ ] Go to Supabase project settings
2. [ ] Settings → API
3. [ ] Copy **Project URL** (SUPABASE_URL)
4. [ ] Copy **anon public** key (SUPABASE_KEY)
5. [ ] Do NOT use service_role key in frontend (security risk)

---

## 4. Local Testing

### Test Backend Locally
```bash
cd backend

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=sk-proj-your-key
SUPABASE_URL=https://xiljhvtsanncqpjaydor.supabase.co
SUPABASE_KEY=your-supabase-anon-key
EOF

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload

# Test in another terminal
curl http://localhost:8000/health
```

Expected response: `{"status":"healthy","message":"Music collab API is running"}`

### Test Frontend Locally
```bash
cd frontend

# Create .env file
cat > .env << EOF
VITE_SUPABASE_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:8000
EOF

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:5173
```

### Test Full Flow
1. [ ] Fill out profile form
2. [ ] Check OpenAI validation works (genres, skills, etc.)
3. [ ] Submit profile
4. [ ] Check Supabase Table Editor - profile should appear
5. [ ] Create 2-3 more profiles
6. [ ] Check if matches appear

---

## 5. Code Review

### Backend (`backend/main.py`)
- [ ] All imports present
- [ ] CORS includes production URLs
- [ ] Error handling in place
- [ ] Environment variables validated on startup

### Frontend (`frontend/src/App.jsx`)
- [ ] API_URL uses environment variable
- [ ] Supabase key uses environment variable
- [ ] Error handling for API calls
- [ ] Loading states present

---

## 6. Security Checks

- [ ] **Never commit** `.env` files
- [ ] `.env` is in `.gitignore`
- [ ] Using `anon` key (not `service_role`) in frontend
- [ ] API keys are in environment variables, not hardcoded
- [ ] CORS only allows specific origins
- [ ] Database RLS (Row Level Security) enabled

---

## 7. Performance Checks

- [ ] Frontend builds successfully: `npm run build`
- [ ] No console errors in browser
- [ ] Images/assets optimized
- [ ] No unused dependencies

---

## 8. Deployment Platform Setup

### Option A: Railway (Recommended - Easiest)
1. [ ] Sign up at https://railway.app
2. [ ] Connect GitHub account
3. [ ] Add credit card (won't be charged on free tier)

### Option B: Render
1. [ ] Sign up at https://render.com
2. [ ] Connect GitHub account

### Frontend: Vercel (Recommended)
1. [ ] Sign up at https://vercel.com
2. [ ] Connect GitHub account

---

## 9. Post-Deployment Testing

Once deployed, test:

1. [ ] Visit your live frontend URL
2. [ ] Open browser DevTools (F12) → Console
3. [ ] Check for any errors
4. [ ] Fill out profile form
5. [ ] Verify OpenAI validation works
6. [ ] Submit profile
7. [ ] Check matches appear
8. [ ] Test on mobile device
9. [ ] Test in different browsers (Chrome, Firefox, Safari)

---

## 10. Monitoring Setup

### Free Monitoring Tools
- [ ] Vercel Analytics (built-in)
- [ ] Railway/Render Logs (built-in)
- [ ] Supabase Dashboard (built-in)
- [ ] OpenAI Usage Dashboard: https://platform.openai.com/usage

### Optional (Recommended for Production)
- [ ] Sentry for error tracking: https://sentry.io
- [ ] LogRocket for session replay: https://logrocket.com
- [ ] UptimeRobot for uptime monitoring: https://uptimerobot.com

---

## 11. Documentation

- [ ] Update README with live app URL
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Note any known issues

---

## 12. Backup Plan

- [ ] Export Supabase data (Settings → Database → Backups)
- [ ] Keep local copy of code
- [ ] Document all environment variables
- [ ] Save API keys in password manager

---

## Common Issues & Solutions

### Issue: "CORS Error"
**Solution**: Add your frontend URL to backend CORS settings

### Issue: "Failed to fetch"
**Solution**: Check VITE_API_URL is correct, backend is running

### Issue: "OpenAI API Error"
**Solution**: Check API key is valid, you have credits

### Issue: "Supabase Error"
**Solution**: Check table exists, RLS policies are correct

### Issue: "Module not found"
**Solution**: Run `pip install -r requirements.txt` or `npm install`

---

## Ready to Deploy?

Once all checkboxes are ticked:

1. Choose your path:
   - **Quick (10 min)**: Follow `QUICK_START.md`
   - **Detailed**: Follow `DEPLOYMENT_GUIDE.md`

2. Deploy backend first, then frontend

3. Test thoroughly

4. Share your app! 🚀

---

## Estimated Deployment Time

- First time: 30-45 minutes
- With this checklist: 15-20 minutes
- Quick deploy: 10 minutes

## Cost Estimate (Monthly)

- Railway/Render: $0 (free tier)
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- OpenAI: $5-20 (usage-based)

**Total: $5-20/month** for first 100-1000 users
