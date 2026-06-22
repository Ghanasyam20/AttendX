# PostgreSQL Migration Guide for AttendX

## Why Migrate from SQLite to PostgreSQL?

| Feature                 | SQLite     | PostgreSQL   |
| ----------------------- | ---------- | ------------ |
| Serverless friendly     | ⚠️ Limited | ✅ Yes       |
| Concurrent users        | ⚠️ Limited | ✅ Unlimited |
| Multi-server sync       | ❌ No      | ✅ Yes       |
| Scalability             | ⚠️ Limited | ✅ Excellent |
| Vercel production-ready | ⚠️ No      | ✅ Yes       |

## Step 1: Choose PostgreSQL Provider

### Free Options:

1. **Render.com** (Recommended for free tier)
   - Free PostgreSQL database
   - Easy setup
   - Sign up: https://render.com

2. **Railway.app**
   - Free tier available
   - Good performance
   - Sign up: https://railway.app

3. **Supabase** (Firebase alternative)
   - 500MB free database
   - Full PostgreSQL features
   - Sign up: https://supabase.com

4. **Neon** (Free serverless PostgreSQL)
   - Serverless PostgreSQL
   - Perfect for Vercel
   - Sign up: https://neon.tech

### (Recommended: Render or Neon for best Vercel compatibility)

## Step 2: Set Up PostgreSQL Database

### Example: Using Render.com

1. Sign up at render.com
2. Click "New +" → "PostgreSQL"
3. Fill in name (e.g., "attendx-db")
4. Choose free tier
5. Create → Copy connection string

Connection string looks like:

```
postgresql://username:password@host:port/dbname
```

## Step 3: Update Your Code

### Install PostgreSQL driver:

```bash
pip install psycopg2-binary==2.9.9
# OR
pip install psycopg2==2.9.9  # (requires PostgreSQL client)
```

### Update `db_utils.py`:

```python
import psycopg2
from contextlib import contextmanager
import os
from urllib.parse import urlparse

def get_db_connection():
    """Get PostgreSQL database connection from environment variable."""
    database_url = os.getenv('DATABASE_URL')

    if database_url:
        # Parse DATABASE_URL format: postgresql://user:password@host:port/dbname
        parsed = urlparse(database_url)
        conn = psycopg2.connect(
            dbname=parsed.path[1:],  # Remove leading /
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port or 5432
        )
    else:
        # Fallback to individual environment variables
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME', 'attendx'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', ''),
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432')
        )

    return conn

@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
```

## Step 4: Migrate Database Schema

Create `migrate_db.py`:

```python
#!/usr/bin/env python3
"""Migrate SQLite database to PostgreSQL"""
import sqlite3
import psycopg2
import os
from urllib.parse import urlparse

def migrate():
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('db/attendance.db')
    sqlite_cursor = sqlite_conn.cursor()

    # Connect to PostgreSQL
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        parsed = urlparse(database_url)
        pg_conn = psycopg2.connect(
            dbname=parsed.path[1:],
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port or 5432
        )
    else:
        pg_conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )

    pg_cursor = pg_conn.cursor()

    # Get all tables
    sqlite_cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    )
    tables = sqlite_cursor.fetchall()

    for (table_name,) in tables:
        print(f"Migrating table: {table_name}")

        # Get schema
        sqlite_cursor.execute(f"PRAGMA table_info({table_name})")
        columns = sqlite_cursor.fetchall()

        # Get data
        sqlite_cursor.execute(f"SELECT * FROM {table_name}")
        rows = sqlite_cursor.fetchall()

        if rows:
            # Insert data
            placeholders = ','.join(['%s'] * len(columns))
            col_names = ','.join([col[1] for col in columns])
            insert_sql = f"INSERT INTO {table_name} ({col_names}) VALUES ({placeholders})"

            for row in rows:
                try:
                    pg_cursor.execute(insert_sql, row)
                except Exception as e:
                    print(f"Error inserting row in {table_name}: {e}")

        pg_conn.commit()

    sqlite_conn.close()
    pg_conn.close()
    print("Migration complete!")

if __name__ == '__main__':
    migrate()
```

Run migration:

```bash
python migrate_db.py
```

## Step 5: Update Environment Variables

### In Vercel Dashboard:

1. Go to Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL = postgresql://user:password@host:port/dbname
   ```
   OR individual variables:
   ```
   DB_NAME = attendx
   DB_USER = postgres
   DB_PASSWORD = your_password
   DB_HOST = your_host.render.com
   DB_PORT = 5432
   ```

### For Local Testing (`.env` file):

```
DATABASE_URL=postgresql://user:password@localhost:5432/attendx
```

## Step 6: Update requirements.txt

```
Flask==2.3.3
opencv-python==4.8.1.78
face-recognition==1.3.0
openpyxl==3.1.2
numpy==2.2.6
Pillow==12.1.0
Flask-WTF==1.2.1
python-dotenv==1.0.1
flask-cors==6.0.2
gunicorn==21.2.0
Werkzeug==2.3.7
psycopg2-binary==2.9.9
```

## Step 7: Create PostgreSQL Schema Script

Create `db/init_postgres.py`:

```python
import psycopg2
import os
from urllib.parse import urlparse

def init_schema():
    """Initialize PostgreSQL schema"""
    database_url = os.getenv('DATABASE_URL')

    if database_url:
        parsed = urlparse(database_url)
        conn = psycopg2.connect(
            dbname=parsed.path[1:],
            user=parsed.username,
            password=parsed.password,
            host=parsed.hostname,
            port=parsed.port or 5432
        )
    else:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )

    cursor = conn.cursor()

    # Create tables (adjust schema for PostgreSQL)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Student (
            student_id SERIAL PRIMARY KEY,
            roll_number VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            department VARCHAR(50),
            semester INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS StudentFace (
            student_id INTEGER PRIMARY KEY,
            encoding BYTEA NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES Student(student_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Attendance (
            attendance_id SERIAL PRIMARY KEY,
            student_id INTEGER NOT NULL,
            subject_id INTEGER,
            date DATE NOT NULL,
            schedule_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES Student(student_id),
            UNIQUE(student_id, schedule_id, date)
        )
    ''')

    # Add more tables as needed...

    conn.commit()
    conn.close()
    print("Schema initialized!")

if __name__ == '__main__':
    init_schema()
```

## Step 8: Deploy

```bash
git add .
git commit -m "Migrate to PostgreSQL"
git push
# Vercel auto-deploys!
```

## Troubleshooting

### "psycopg2: can't adapt type"

Your data types don't match. Ensure encodings are stored as bytea/blob in PostgreSQL.

### "Connection refused"

Check that:

1. Environment variables are set correctly
2. Database is running
3. IP is whitelisted (check database provider settings)

### "Unknown database 'attendx'"

Run `init_postgres.py` to create the database and schema.

## Rollback to SQLite

If you want to go back:

1. Revert `db_utils.py` to use sqlite3
2. Revert requirements.txt
3. Keep a backup of your PostgreSQL data first!

## Performance Tips

1. Add indexes: `CREATE INDEX idx_attendance_date ON Attendance(date);`
2. Use connection pooling for high traffic
3. Regular backups via your PostgreSQL provider
4. Monitor query performance

## Success! 🎉

Your AttendX now uses PostgreSQL and is production-ready for Vercel!
