# 🔑 How to Get Your API Keys

This guide shows you exactly how to get your Supabase and OpenAI API keys.

---

## Part 1: Get Supabase API Keys (5 minutes)

### Step 1: Sign Up for Supabase

1. Go to: **https://app.supabase.com**
2. Click **"Start your project"** or **"Sign In"**
3. Choose sign-in method:
   - **GitHub** (recommended - fastest)
   - **Google**
   - **Email**
4. Authorize Supabase to access your GitHub

### Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the details:
   - **Name**: `music-collab` (or any name you want)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you (e.g., `US West`, `Europe`, etc.)
   - **Pricing Plan**: Select **"Free"** (it's already selected)
3. Click **"Create new project"**
4. Wait 2-3 minutes for your project to set up

### Step 3: Get Your API Keys

Once your project is ready:

1. You should see your project dashboard
2. On the left sidebar, click the **Settings** icon (⚙️) at the bottom
3. Click **"API"** in the Settings menu
4. You'll see a page with your API credentials

### Step 4: Copy Your Keys

You'll see several sections. Here's what to copy:

#### A. Project URL
```
Configuration > URL
```
- Look for **"Project URL"**
- It looks like: `https://xiljhvtsanncqpjaydor.supabase.co`
- **Click the copy button** 📋
- Save it somewhere safe (this is your `SUPABASE_URL`)

#### B. API Key (anon/public)
```
Project API keys > anon public
```
- Scroll down to **"Project API keys"**
- Find the **"anon"** **"public"** key (it's a long string)
- It starts with: `eyJ...`
- **Click the copy button** 📋 next to `anon` `public`
- Save it somewhere safe (this is your `SUPABASE_KEY`)

**IMPORTANT**:
- ✅ Use the **"anon public"** key (safe for frontend)
- ❌ Do NOT use the **"service_role"** key (it's a secret!)

### Step 5: Set Up Your Database

1. On the left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Open the file `database/schema.sql` from your project
4. Copy ALL the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see: **"Success. No rows returned"**

### Step 6: Verify Database

1. On the left sidebar, click **"Table Editor"**
2. You should see a table called **"profiles"**
3. Click on it to see the columns (email, name, role, etc.)
4. ✅ Database is ready!

---

## Part 2: Get OpenAI API Key (5 minutes)

### Step 1: Sign Up for OpenAI

1. Go to: **https://platform.openai.com**
2. Click **"Sign up"** (top right)
3. Create account with:
   - **Email** (you'll need to verify)
   - **Google** account
   - **Microsoft** account
4. Verify your email if required
5. Complete the phone verification (they need a real phone number)

### Step 2: Add Billing Information

**IMPORTANT**: OpenAI is paid, but very cheap (~$0.10 per 100 profiles)

1. Once logged in, click your **profile icon** (top right)
2. Click **"Settings"**
3. In the left sidebar, click **"Billing"**
4. Click **"Add payment method"**
5. Enter your credit/debit card info
6. Click **"Continue"**

### Step 3: Add Credits (Optional but Recommended)

1. Still in Billing section
2. Click **"Add to credit balance"**
3. Add **$5-10** (this will last a long time)
4. Or skip this - it will charge as you use

### Step 4: Set Spending Limit (Recommended)

1. In Billing, find **"Usage limits"**
2. Set **"Hard limit"**: `$10` or `$20`
3. Set **"Soft limit"**: `$5`
4. Click **"Save"**
5. This prevents unexpected charges!

### Step 5: Create API Key

1. On the left sidebar, click **"API keys"** (or go to https://platform.openai.com/api-keys)
2. Click **"+ Create new secret key"**
3. A popup appears:
   - **Name**: `music-collab-production` (or any name)
   - **Permissions**: Leave as **"All"** (default)
   - **Project**: Leave as default
4. Click **"Create secret key"**

### Step 6: Copy Your API Key

**⚠️ IMPORTANT - READ THIS:**

1. A popup shows your API key
2. It looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **COPY IT IMMEDIATELY** - Click the copy button 📋
4. **SAVE IT SOMEWHERE SAFE** (you can only see it once!)
5. Paste it in a text file or password manager
6. Click **"Done"**

**You CANNOT see this key again!** If you lose it, you'll need to create a new one.

---

## Part 3: Save Your Keys Safely

### Option 1: Create a Local File

Create a text file to save your keys:

```bash
# Create a secure notes file
cat > ~/api-keys.txt << EOF
# Music Collab API Keys
# DO NOT SHARE THESE!

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

Created: $(date)
EOF

# Make it readable only by you
chmod 600 ~/api-keys.txt

echo "✅ Keys saved to ~/api-keys.txt"
```

### Option 2: Use Environment Variables Locally

For local development, create `.env` files:

#### Backend .env
```bash
cd backend

cat > .env << EOF
OPENAI_API_KEY=sk-proj-your-actual-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here
EOF

echo "✅ Backend .env created"
```

#### Frontend .env
```bash
cd ../frontend

cat > .env << EOF
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here
VITE_API_URL=http://localhost:8000
EOF

echo "✅ Frontend .env created"
```

---

## Part 4: Test Your Keys

### Test Supabase Connection

```bash
# Test with curl
curl "https://YOUR-PROJECT.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: YOUR-SUPABASE-KEY" \
  -H "Authorization: Bearer YOUR-SUPABASE-KEY"
```

Expected response: `[]` (empty array - that's good!)

### Test OpenAI API Key

```bash
# Test with curl
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR-OPENAI-KEY" \
  | grep -q "gpt-4" && echo "✅ OpenAI key works!" || echo "❌ OpenAI key failed"
```

Expected: "✅ OpenAI key works!"

---

## Quick Reference Card

After you get your keys, here's what you have:

```
┌─────────────────────────────────────────────────────────┐
│                     YOUR API KEYS                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SUPABASE_URL:                                          │
│  https://xiljhvtsanncqpjaydor.supabase.co              │
│                                                         │
│  SUPABASE_KEY:                                          │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...               │
│  (very long string)                                     │
│                                                         │
│  OPENAI_API_KEY:                                        │
│  sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx                      │
│  (starts with sk-proj-)                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Using Your Keys for Deployment

When you deploy to Railway/Render/Vercel, you'll add these as **Environment Variables**:

### Railway (Backend)
```
OPENAI_API_KEY=sk-proj-your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJ...your-supabase-key
```

### Vercel (Frontend)
```
VITE_SUPABASE_KEY=eyJ...your-supabase-key
VITE_API_URL=https://your-backend.railway.app
```

---

## Security Tips

### ✅ DO:
- Keep keys in password manager (1Password, LastPass, Bitwarden)
- Use environment variables (never hardcode)
- Add `.env` to `.gitignore`
- Rotate keys if they're exposed
- Use different keys for dev/prod

### ❌ DON'T:
- Commit keys to GitHub
- Share keys publicly
- Use service_role key in frontend
- Hardcode keys in your code
- Post screenshots with visible keys

---

## Troubleshooting

### "Invalid API key" (OpenAI)
1. Check you copied the full key (starts with `sk-proj-`)
2. No extra spaces before/after
3. Key might be expired - create a new one
4. Check you have credits: https://platform.openai.com/usage

### "Invalid JWT" (Supabase)
1. Make sure you used the **anon/public** key (not service_role)
2. Check you copied the full key
3. Verify project URL is correct
4. Check project isn't paused (Supabase pauses inactive free projects)

### "Failed to fetch" (Both)
1. Check internet connection
2. Verify URLs are correct
3. Check API service status:
   - OpenAI: https://status.openai.com
   - Supabase: https://status.supabase.com

---

## Cost Tracking

### Monitor OpenAI Usage
1. Go to: https://platform.openai.com/usage
2. See your spending in real-time
3. Estimated cost: **$0.10 per 100 profiles created**

### Monitor Supabase Usage
1. Go to your Supabase project
2. Click **"Settings"** → **"Billing"**
3. See database size, API requests, etc.
4. Free tier: 500MB database, 2GB bandwidth/month

---

## Next Steps

Once you have your keys:

1. ✅ Test them locally (see Part 4 above)
2. ✅ Follow [QUICK_START.md](QUICK_START.md) to deploy
3. ✅ Add keys to Railway/Vercel as environment variables
4. ✅ Test your live app

---

## Quick Command to Set Up Everything

Run this after getting your keys:

```bash
# Navigate to your project
cd /home/user/collabx

# Set up backend .env
cd backend
cat > .env << 'EOF'
# Replace these with your actual keys!
OPENAI_API_KEY=sk-proj-your-openai-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
EOF

# Set up frontend .env
cd ../frontend
cat > .env << 'EOF'
# Replace these with your actual keys!
VITE_SUPABASE_KEY=your-supabase-anon-key-here
VITE_API_URL=http://localhost:8000
EOF

echo ""
echo "✅ Environment files created!"
echo ""
echo "⚠️  IMPORTANT: Edit the .env files and replace the placeholder values with your actual API keys!"
echo ""
echo "Backend .env: backend/.env"
echo "Frontend .env: frontend/.env"
```

---

## Summary

You now have:
- ✅ Supabase account and API keys
- ✅ OpenAI account and API key
- ✅ Database set up
- ✅ Keys saved securely

**Time to deploy!** → [QUICK_START.md](QUICK_START.md)

Need help? Check [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
