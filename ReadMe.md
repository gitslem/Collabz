@ -1,201 +0,0 @@
# 🎵 Music Collab - AI-Powered Collaboration Platform

Find your perfect music collaborator using AI-powered matching based on skills, genres, and preferences.

Access live url ( you might wait few seconds because it's deployed on free tier on Render and Supabase.
www.x.colsphere.com

![Status](https://img.shields.io/badge/status-ready%20to%20deploy-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---
<img width="1512" height="982" alt="Screenshot 2025-11-17 at 08 48 32" src="https://github.com/user-attachments/assets/48c60505-c4c4-4ade-b5d3-aa0e463755d8" />



## 🚀 Features

- **Smart Profiling**: Multi-step form to collect musician details
- **AI Validation**: Real-time OpenAI validation for genres, skills, and social links
- **Intelligent Matching**: GPT-4 powered matching algorithm
- **Beautiful UI**: Modern gradient design with smooth animations
- **Real-time Feedback**: Live validation and progress tracking

---

## 📋 Quick Deploy (Choose One)

### ⚡ Option 1: Quick Start (10 minutes)
**Follow [QUICK_START.md](QUICK_START.md)** for the fastest deployment.

**Steps:**
1. Get API keys (OpenAI, Supabase)
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Done! 🎉

### 📚 Option 2: Detailed Guide (30 minutes)
**Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for step-by-step instructions with screenshots.

### ✅ Option 3: Checklist First
**Start with [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)** to ensure you have everything ready.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key
- Supabase account

### Backend Setup
```bash
cd backend

# Create .env file
cp .env.example .env
# Edit .env with your keys

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup
```bash
cd frontend

# Create .env file
cp .env.example .env
# Edit .env with your keys

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```bash
OPENAI_API_KEY=sk-proj-...          # OpenAI API key
SUPABASE_URL=https://...            # Supabase project URL
SUPABASE_KEY=eyJ...                 # Supabase anon key
```

### Frontend (`frontend/.env`)
```bash
VITE_SUPABASE_KEY=eyJ...            # Supabase anon key
VITE_API_URL=http://localhost:8000  # Backend URL
```

**Get your keys from:**
- OpenAI: https://platform.openai.com/api-keys
- Supabase: https://app.supabase.com → Project Settings → API

---

## 🗄️ Database Setup

1. Go to https://app.supabase.com
2. Open your project
3. Go to **SQL Editor**
4. Run the schema from **[database/schema.sql](database/schema.sql)**
5. Verify table created in **Table Editor**

---

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS (via CDN)
- Lucide React (icons)
- Supabase JS

### Backend
- FastAPI
- OpenAI GPT-4
- Supabase
- Pydantic

---

## 📁 Project Structure

```
collabx/
├── backend/               # FastAPI backend
│   ├── main.py           # Main API application
│   ├── requirements.txt  # Python dependencies
│   └── render.yaml       # Render deployment config
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main application
│   │   └── main.jsx     # Entry point
│   └── vercel.json      # Vercel deployment config
│
└── database/
    └── schema.sql        # Supabase database schema
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/validate-field` | POST | Validate field with AI |
| `/save-profile` | POST | Save profile to database |
| `/find-matches` | POST | Find matching collaborators |

---

## 🔧 Troubleshooting

**"Failed to fetch"**
- Check backend is running
- Verify VITE_API_URL is correct

**"CORS Error"**
- Add your frontend URL to backend CORS settings
- Redeploy backend

**"OpenAI Error"**
- Verify API key is valid
- Check credits: https://platform.openai.com/usage

More help: [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)

---

## 📄 License

MIT License - feel free to use this project for anything!

---

## 🚀 Get Started Now!

Ready to deploy?

1. **Quick (10 min)**: [QUICK_START.md](QUICK_START.md)
2. **Thorough (30 min)**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. **Checklist**: [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)

**Let's connect musicians worldwide! 🎵**