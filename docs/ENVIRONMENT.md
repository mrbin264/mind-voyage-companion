# Environment Configuration

This document explains the environment variable setup for the Mind Voyage Companion application.

## Files Overview

- `.env` - Main environment configuration (Git ignored)
- `.env.local` - Local overrides (Git ignored, optional)
- `.env.example` - Template for new developers

## Configuration Migration

All environment variables have been consolidated from `.env.local` into `.env` for better development experience and team coordination.

## MongoDB Configuration

The application is configured to use Docker MongoDB with authentication:

```bash
# Development MongoDB (Docker container)
MONGODB_URI=mongodb://mindvoyage_user:secret_key@localhost:27017/mind_voyage_companion?authSource=mind_voyage_companion

# Docker Compose (internal network)
# MONGODB_URI=mongodb://mindvoyage_user:secret_key@mongodb:27017/mind_voyage_companion?authSource=mind_voyage_companion
```

## Quick Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local  # For local overrides (optional)
   ```

2. **Start MongoDB:**
   ```bash
   ./scripts/setup-mongodb.sh
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Verify setup:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## Environment Priority

Next.js loads environment variables in this order:
1. `.env.local` (highest priority, Git ignored)
2. `.env.development` (when NODE_ENV=development)
3. `.env` (lowest priority, tracked in Git)

## Security Notes

- **Development**: Current secrets are safe for development
- **Production**: Generate new secure secrets for production deployment
- **Local overrides**: Use `.env.local` for personal configuration without affecting the team

## Docker Integration

The configuration supports both:
- **Local development** with Docker MongoDB (`localhost:27017`)
- **Docker Compose** with internal networking (`mongodb:27017`)

Simply uncomment the appropriate `MONGODB_URI` based on your setup.