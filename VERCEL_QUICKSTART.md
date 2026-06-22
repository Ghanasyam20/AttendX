# Quick Start: Deploy AttendX to Vercel

## 🚀 Fastest Way (5 minutes)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/AttendX.git
git push -u origin main
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Paste your GitHub repo URL
4. Click "Import"
5. Vercel auto-detects your setup (no configuration needed!)
6. Click "Deploy"
7. Done! Your app is live! 🎉

## 📝 Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from your project directory
vercel

# For production deployment
vercel --prod
```

## 🔐 Setting Environment Variables

### Via Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add variables:
   - `ATTENDX_SESSION_COOKIE_DOMAIN` (your domain)
   - `ATTENDX_CORS_ORIGINS` (allowed origins)

### Via Vercel CLI:

```bash
vercel env add ATTENDX_SESSION_COOKIE_DOMAIN
vercel env add ATTENDX_CORS_ORIGINS
```

## ⚠️ Important: Database Setup

### Current (SQLite) - Limited on Vercel

SQLite will work but has limitations. Data persists only during execution.

### Recommended: PostgreSQL

For production, switch to a cloud database:

1. **Create a free PostgreSQL database:**
   - Render (https://render.com)
   - Railway (https://railway.app)
   - Heroku (https://heroku.com)
   - Supabase (https://supabase.com)

2. **Update `db_utils.py`:**

   ```python
   import psycopg2
   import os

   def get_db_connection():
       return psycopg2.connect(
           dbname=os.getenv('DB_NAME'),
           user=os.getenv('DB_USER'),
           password=os.getenv('DB_PASSWORD'),
           host=os.getenv('DB_HOST'),
           port=os.getenv('DB_PORT', '5432')
       )
   ```

3. **Add to requirements.txt:**

   ```
   psycopg2-binary==2.9.9
   ```

4. **Set environment variables in Vercel dashboard:**
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

## ✅ What Works on Vercel

- ✅ Web dashboard & UI
- ✅ Student management
- ✅ Attendance reports & Excel export
- ✅ Database operations
- ✅ Authentication/login
- ✅ API endpoints

## ❌ What Doesn't Work on Vercel

- ❌ Live camera/webcam access (serverless limitation)
- ❌ Real-time face detection
- ❌ Face registration from webcam

## 🔄 Solution: Hybrid Setup

For full functionality with face recognition:

**Architecture:**

```
User Browser
    ↓
Vercel (Dashboard, Reports)
    ↓
Cloud Database (PostgreSQL/MySQL)

Separate Deployment:
Local/Dedicated Server (Face Recognition, Camera)
    ↓
Same Cloud Database
```

**Steps:**

1. Deploy dashboard to Vercel
2. Run face recognition service locally or on dedicated hardware
3. Both share the same cloud database
4. Sync attendance data in real-time

## 📊 View Logs & Monitor

```bash
# View logs
vercel logs

# Monitor performance
vercel analytics
```

## 🔄 Auto-Deployment from Git

By default, every push to main/master auto-deploys!

To disable or change:

1. Go to Settings → Git
2. Configure deployment preferences

## 🆘 Troubleshooting

### Build Failed: "Module not found"

```bash
# Ensure all dependencies are in requirements.txt
pip freeze > requirements.txt
git add requirements.txt
git push
```

### CORS Errors

Update environment variable `ATTENDX_CORS_ORIGINS` with your domain.

### Database Connection Failed

1. Verify environment variables are set
2. Check database is running and accessible
3. For SQLite: Vercel has limited file write access

### 502 Bad Gateway

Check logs with `vercel logs` for errors.

## 📚 Documentation

- Full guide: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Vercel docs: https://vercel.com/docs
- Python runtime: https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python

## 💡 Next Steps

1. ✅ Deploy to Vercel (this guide)
2. Set up cloud database (optional but recommended)
3. Configure custom domain
4. Set up face recognition service (optional, can run locally)
5. Enable monitoring & analytics

## 🎯 Summary

```
3 Commands = Live App:
1. git push (push to GitHub)
2. Go to vercel.com/new
3. Click Deploy
```

Done! Your AttendX is now live on Vercel! 🎉
