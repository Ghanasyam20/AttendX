# AttendX Vercel Architecture

## 📊 Deployment Architecture

### Current Architecture (Vercel + SQLite)

```
┌─────────────────────────────────────────────────────┐
│                  User Browser                        │
│         (Chrome, Firefox, Safari, etc.)              │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│              Vercel Global CDN                       │
│          (Static files: CSS, JS, images)             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│       Vercel Serverless Functions                    │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  api/index.py (Entry Point)                 │   │
│  │  ↓                                            │   │
│  │  app.py (Flask Application)                 │   │
│  │  ├── Templates (HTML)                       │   │
│  │  ├── Routes & Logic                         │   │
│  │  └── Database Operations                    │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│            SQLite Database (Local)                   │
│  ⚠️  File persists only during execution            │
│  ⚠️  Not suitable for production                    │
└─────────────────────────────────────────────────────┘
```

---

## 🗄️ Recommended Production Architecture (with PostgreSQL)

```
┌─────────────────────────────────────────────────────┐
│                  User Browser                        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────┐
│        Vercel (Web Dashboard & API)                  │
│  ├── Dashboard (HTML/CSS/JS)                        │
│  ├── REST API endpoints                             │
│  └── Session management                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│     Cloud PostgreSQL Database                        │
│  ✅ Persistent data                                 │
│  ✅ Multi-user support                              │
│  ✅ Scalable & reliable                             │
│                                                      │
│  Options:                                           │
│  • Render.com                                       │
│  • Railway.app                                      │
│  • Supabase                                         │
│  • Neon                                             │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Hybrid Architecture (with Local Face Recognition)

For full functionality including real-time face recognition:

```
┌──────────────────────────────────────────────────────────────┐
│                      Users                                    │
│         (Web Browser + Local Face Recognition)                │
└──┬─────────────────────────────────────────────────────────┬─┘
   │ HTTPS                                      │ Local Network
   │                                            │
   ▼                                            ▼
┌──────────────────────┐        ┌─────────────────────────────┐
│  Vercel Dashboard &  │        │  Local Face Recognition     │
│  API                 │        │  Service                    │
│                      │        │                             │
│ ✅ Web interface     │        │ ✅ Real-time camera        │
│ ✅ Reports           │        │ ✅ Face detection          │
│ ✅ Student mgmt      │        │ ✅ Face registration       │
│ ✅ Authorization     │        │ ✅ Attendance marking      │
└──────────┬───────────┘        └────────────┬────────────────┘
           │                                  │
           └──────────────┬───────────────────┘
                          │
                          ▼
           ┌──────────────────────────────┐
           │  Cloud PostgreSQL Database   │
           │  (Single source of truth)    │
           │                              │
           │ • Student data              │
           │ • Face encodings             │
           │ • Attendance records         │
           │ • Schedules & subjects       │
           └──────────────────────────────┘
```

---

## 🔄 Request Flow

### Dashboard Access (Vercel)

```
1. User opens: https://attendx.vercel.app/
2. ↓
3. Vercel serves HTML/CSS/JS
4. ↓
5. Browser requests data from API
6. ↓
7. Vercel Function (api/index.py) processes request
8. ↓
9. Database query (SQLite or PostgreSQL)
10. ↓
11. Response returned to browser
12. ↓
13. Dashboard rendered with data
```

### Face Recognition (Local Service)

```
1. User runs local face_recognition service
2. ↓
3. Service captures frames from webcam
4. ↓
5. Processes face detection/recognition
6. ↓
7. Sends attendance data to Vercel API
8. ↓
9. Vercel stores in shared database
10. ↓
11. Dashboard updates automatically
```

---

## 📦 File Structure on Vercel

After deployment to Vercel, your project structure:

```
AttendX/
├── api/
│   └── index.py              ← Entry point
├── app.py                    ← Main Flask app
├── db_utils.py               ← Database connection
├── templates/                ← HTML templates (served)
├── static/                   ← CSS, JS, images (served)
├── logic/                    ← Business logic (imported)
├── requirements.txt          ← Dependencies (installed)
├── vercel.json              ← Vercel config
├── .vercelignore            ← Ignore patterns
└── .env (from dashboard)    ← Environment vars
```

---

## 🔐 Environment Variables Flow

```
┌─────────────────────────────────────────┐
│    Vercel Project Dashboard             │
│    Settings → Environment Variables     │
└──────────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Variable saved at:   │
    │ - Build time         │
    │ - Runtime            │
    │ - Preview/Prod       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Available in Flask app via:  │
    │ os.getenv('VAR_NAME')        │
    └──────────────────────────────┘
```

---

## 🚀 Deployment Flow

```
1. You: git push to GitHub
   ↓
2. GitHub notifies Vercel
   ↓
3. Vercel: Clone repository
   ↓
4. Vercel: Run build command
   - pip install -r requirements.txt
   - Create serverless bundle
   ↓
5. Vercel: Create deployment
   - Test preview URL
   ↓
6. Vercel: Deploy to production
   - Auto-assign domain
   - Setup SSL certificate
   - Deploy globally
   ↓
7. Live! 🎉
   Your app is available at: https://attendx.vercel.app
```

---

## 🔗 Integration Points

### With PostgreSQL (Recommended)

```
Vercel Function
    ↓
psycopg2 driver
    ↓
PostgreSQL (Render/Railway/Supabase)
    ↓
Data persisted & accessible
```

### With SQLite (Quick Start)

```
Vercel Function
    ↓
sqlite3 driver
    ↓
Ephemeral file system
    ↓
Data lost when function ends ⚠️
```

---

## 📈 Scaling Considerations

| Scenario          | SQLite     | PostgreSQL |
| ----------------- | ---------- | ---------- |
| 1-10 users        | ✅ Works   | ✅ Works   |
| 10-100 users      | ⚠️ Slow    | ✅ Good    |
| 100+ users        | ❌ Fails   | ✅ Scales  |
| Concurrent access | ❌ Locks   | ✅ Works   |
| Data persistence  | ❌ Limited | ✅ Full    |

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────┐
│      HTTPS/TLS                          │
│    (Automatic with Vercel)              │
└──────────┬──────────────────────────────┘
           ▼
┌─────────────────────────────────────────┐
│    Flask Session Management             │
│    - Secure cookies                     │
│    - CSRF protection                    │
└──────────┬──────────────────────────────┘
           ▼
┌─────────────────────────────────────────┐
│    Authentication                       │
│    - Login validation                   │
│    - Session checking                   │
└──────────┬──────────────────────────────┘
           ▼
┌─────────────────────────────────────────┐
│    Database                             │
│    - Parameterized queries              │
│    - No SQL injection                   │
└─────────────────────────────────────────┘
```

---

## 📊 Performance Profile

```
Dashboard Load Time:
- Initial load: ~2-3 seconds (global CDN)
- API requests: ~300-500ms
- Database query: ~50-200ms
- Rendering: ~100-200ms

Scaling:
- Vercel auto-scales
- Cold starts: ~1-2 seconds
- Warm requests: <500ms
- Parallel requests: Unlimited
```

---

## 🎯 Architecture Summary

| Layer         | Component                | Status              |
| ------------- | ------------------------ | ------------------- |
| Client        | Web Browser              | ✅ Fully supported  |
| Hosting       | Vercel Functions         | ✅ Fully supported  |
| Backend       | Flask Python             | ✅ Fully supported  |
| Database      | PostgreSQL (recommended) | ✅ Fully supported  |
| Database      | SQLite (quick start)     | ⚠️ Limited support  |
| AI/ML         | Face Recognition (local) | ✅ Works separately |
| Static Assets | CSS/JS/Images            | ✅ CDN delivered    |

---

**Key Insight**: Your web dashboard runs 100% on Vercel. Face recognition can run locally and sync data to the same database.

For questions, see [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) or [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md).
