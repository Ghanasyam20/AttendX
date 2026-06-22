# Vercel Deployment Guide for AttendX

## Prerequisites

- Vercel account (free at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js and npm installed locally (for Vercel CLI)

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy Your Project

```bash
vercel
```

Follow the prompts:

- Choose "Y" to create a new project
- Select your project name (e.g., "attendx")
- Select the directory containing your code
- Select "Other" for the framework
- Select deployment region

### 4. Set Environment Variables (if needed)

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add any required environment variables:
   - `ATTENDX_SESSION_COOKIE_DOMAIN` (if using custom domain)
   - `ATTENDX_CORS_ORIGINS` (if using CORS)
   - Other sensitive data

### 5. Configure Custom Domain (Optional)

In Vercel dashboard:

1. Go to your project → Settings → Domains
2. Add your custom domain and follow DNS setup instructions

## Important Notes for Face Recognition Features

⚠️ **Important Limitation**: Face recognition features that require real-time camera access (like live face detection and registration) will NOT work on Vercel's serverless platform because:

- Vercel functions are stateless and have no camera/webcam access
- Face recognition requires continuous frame processing
- Database operations need persistent storage (currently SQLite)

### Recommended Solution for Full Functionality:

For a production system with real-time face recognition:

1. **Keep face detection local**: Run the face registration and live recognition on local machines or dedicated servers
2. **Use cloud database**: Switch from SQLite to a cloud database (PostgreSQL, MySQL) for Vercel compatibility
3. **API separation**:
   - Frontend/Dashboard: Deploy on Vercel (web interface)
   - Face Recognition Service: Run on dedicated hardware or local server
   - Database: Cloud-hosted (PostgreSQL, Firebase, etc.)

## Database Considerations

### Current Setup (SQLite)

SQLite works on Vercel but has limitations:

- File-based storage on ephemeral filesystem
- Data persists only during function execution
- Not suitable for multi-instance deployments

### Recommended: Cloud Database

Update `db_utils.py` to use PostgreSQL or MySQL:

```python
import psycopg2
import os

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT', 5432)
    )
```

## File Structure After Configuration

```
AttendX/
├── api/
│   └── index.py           # Vercel serverless handler
├── templates/             # Flask templates
├── static/               # CSS, JS, images
├── logic/                # Attendance logic
├── ai/                   # AI/ML modules
├── db/                   # Database scripts
├── app.py                # Main Flask app
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to ignore in deployment
└── README.md
```

## Troubleshooting

### Build Failures

- **OpenCV issues**: opencv-python is heavy (~50MB). If build fails, consider using opencv-python-headless
- **Face-recognition library**: May fail on ARM servers. Use compatible versions.

Solution:

```txt
opencv-python-headless==4.8.1.78  # Use instead of opencv-python
```

### Database Connection Issues

- Ensure environment variables are set in Vercel dashboard
- Use absolute paths for database files (not recommended for Vercel)
- Switch to cloud database for production

### CORS Issues

- Update `ATTENDX_CORS_ORIGINS` environment variable
- Ensure browser requests match allowed origins

## Monitoring and Logs

View deployment logs:

```bash
vercel logs
```

Or in Vercel Dashboard:

1. Select your project
2. Go to Deployments → Select a deployment → Logs

## Rollback

To rollback to a previous deployment:

```bash
vercel rollback
```

## Tips for Production

1. ✅ Use environment variables for sensitive data
2. ✅ Set up proper logging and monitoring
3. ✅ Use a cloud database instead of SQLite
4. ✅ Enable HTTPS (automatic with Vercel)
5. ✅ Set up proper authentication
6. ✅ Consider rate limiting for API endpoints
7. ✅ Use a CDN for static assets (Vercel handles this)
8. ✅ Set up proper error handling and alerts

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://vercel.com/support
- AttendX GitHub: [Your repo URL]
