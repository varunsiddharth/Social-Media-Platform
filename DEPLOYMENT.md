# Django Social Media Platform - Render Deployment Guide

## Environment Variables for Render

Set these environment variables in your Render dashboard:

### Required Variables:
- `SECRET_KEY`: Generate a new secret key for production
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Set to your Render app URL (e.g., `your-app-name.onrender.com`)

### Optional Variables:
- `DATABASE_URL`: Automatically provided by Render when you add PostgreSQL service
- `STATIC_ROOT`: Set to `/opt/render/project/src/staticfiles` (default)

## Deployment Steps:

1. Connect your GitHub repository to Render
2. Set the environment variables listed above
3. Add a PostgreSQL database service (recommended)
4. Deploy! Render will automatically run the build script

## Local Development:

The project uses SQLite by default for local development. All environment variables have sensible defaults.

## Files Updated for Deployment:

- `requirements.txt`: Updated with Pillow 9.5.0 and production dependencies
- `settings.py`: Updated to use environment variables with os.environ
- `build.sh`: Build script with system dependencies
- `Procfile`: Process file for Render deployment
