# Docker Quick Start Guide

## 🐳 Docker Setup

This project includes complete Docker support with MongoDB for development and production.

### Prerequisites
- Docker Desktop 4.0+
- 4GB+ available RAM

### Quick Commands

```bash
# Copy environment template
cp .env.docker .env

# Development with hot-reload
pnpm docker:dev

# Production deployment  
pnpm docker:prod

# Database admin interface
pnpm docker:admin

# View logs
pnpm docker:dev:logs

# Test Docker setup
pnpm docker:test

# Cleanup
pnpm docker:clean
```

### Access URLs
- Application: http://localhost:3000
- Admin Interface: http://localhost:8081
- Health Check: http://localhost:3000/api/health
- DB Health: http://localhost:3000/api/health/db

### Architecture
```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │◄──►│    MongoDB      │
│   (Port 3000)   │    │   (Port 27017)  │  
└─────────────────┘    └─────────────────┘
```

### Data Persistence
- MongoDB data: `./data/mongodb/`
- Automatic database initialization
- Schema validation included

For detailed documentation, see [DOCKER.md](./DOCKER.md)