"""
Vercel serverless handler for AttendX Flask application
"""
import sys
import os
from pathlib import Path

# Add parent directory to path to import app modules
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Import the Flask app
from app import app

# Export the app for Vercel
__all__ = ['app']
