# Mind Voyage Companion - Docker Guide

## 🐳 Docker Setup

This project includes comprehensive Docker support with MongoDB for both development and production environments.

### 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ available RAM
- 10GB+ available disk space

### 🚀 Quick Start

#### 1. Environment Setup
```bash
# Copy Docker environment template
cp .env.docker .env

# Edit environment variables as needed
nano .env
```

#### 2. Development with Docker
```bash
# Start development environment with MongoDB
docker-compose --profile development up -d

# View logs
docker-compose logs -f app-dev

# Access application: http://localhost:3000
# MongoDB Admin: http://localhost:8081 (optional)
```

#### 3. Production with Docker
```bash
# Start production environment
docker-compose --profile production up -d

# View logs
docker-compose logs -f app

# Access application: http://localhost:3000
```

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │    MongoDB      │    │  Mongo Express  │
│   (Port 3000)   │◄──►│   (Port 27017)  │◄──►│   (Port 8081)   │
│                 │    │                 │    │    (Optional)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                        │
          └────── Docker Network ──┘
                (mind-voyage-network)
```

### 📁 Directory Structure

```
├── Dockerfile                 # Multi-stage build configuration
├── docker-compose.yml         # Service orchestration
├── .dockerignore             # Build context optimization
├── .env.docker               # Environment template
└── docker/
    └── mongodb/
        ├── init-mongo.js     # Database initialization
        └── mongod.conf       # MongoDB configuration
```

### 🔧 Configuration

#### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | Database connection string | `mongodb://mindvoyage_user:pass@mongodb:27017/mind_voyage_companion` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | `your_nextauth_secret_here_min_32_chars` |
| `APP_PORT` | Application port | `3000` |
| `MONGODB_PORT` | MongoDB port | `27017` |

#### Profiles
- `development`: Hot-reload development environment
- `production`: Optimized production build
- `tools`: Additional tools (Mongo Express)

### 🛠️ Common Commands

#### Development
```bash
# Start development environment
docker-compose --profile development up -d

# Rebuild after code changes
docker-compose --profile development up --build -d

# View application logs
docker-compose logs -f app-dev

# Access container shell
docker-compose exec app-dev sh

# Stop development environment
docker-compose --profile development down
```

#### Production
```bash
# Build and start production
docker-compose --profile production up --build -d

# Scale application (multiple instances)
docker-compose --profile production up --scale app=3 -d

# Update production deployment
docker-compose --profile production pull
docker-compose --profile production up -d

# Stop production environment
docker-compose --profile production down
```

#### Database Management
```bash
# Start only MongoDB
docker-compose up mongodb -d

# Access MongoDB shell
docker-compose exec mongodb mongosh -u mindvoyage_user -p mindvoyage_pass_2025 mind_voyage_companion

# Backup database
docker-compose exec mongodb mongodump -u mindvoyage_user -p mindvoyage_pass_2025 -d mind_voyage_companion -o /data/backup

# Restore database
docker-compose exec mongodb mongorestore -u mindvoyage_user -p mindvoyage_pass_2025 -d mind_voyage_companion /data/backup/mind_voyage_companion

# View MongoDB logs
docker-compose logs -f mongodb
```

#### Admin Tools
```bash
# Start Mongo Express (web admin)
docker-compose --profile tools up mongo-express -d

# Access at: http://localhost:8081
# Username: admin, Password: admin123
```

### 🗄️ Data Persistence

- **MongoDB Data**: Stored in `./data/mongodb` (host-mounted volume)
- **Application Logs**: Available via `docker-compose logs`
- **Backups**: Use MongoDB tools or volume snapshots

### 🔐 Security

#### Production Security Checklist
- [ ] Change default passwords in `.env`
- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Limit MongoDB network exposure
- [ ] Enable SSL/TLS for production
- [ ] Regular security updates
- [ ] Monitor container logs

#### Network Security
- Services communicate via internal Docker network
- Only necessary ports exposed to host
- MongoDB not directly accessible from outside

### 📊 Monitoring

#### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Database health  
curl http://localhost:3000/api/health/db

# Container status
docker-compose ps
```

#### Performance Monitoring
```bash
# Resource usage
docker stats

# Container logs
docker-compose logs --tail=50 -f app

# MongoDB performance
docker-compose exec mongodb mongosh --eval "db.runCommand({serverStatus: 1})"
```

### 🐛 Troubleshooting

#### Common Issues

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000

# Kill process or change port
export APP_PORT=3001
```

**MongoDB Connection Failed**
```bash
# Check MongoDB status
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Reset MongoDB data (caution: deletes all data)
docker-compose down -v
rm -rf ./data/mongodb/*
docker-compose --profile development up -d
```

**Build Failures**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build --no-cache .
```

**Memory Issues**
```bash
# Increase Docker memory limit (Docker Desktop)
# Reduce MongoDB cache size in mongod.conf
# Use smaller Node.js image
```

### 🔄 Development Workflow

1. **Initial Setup**
   ```bash
   cp .env.docker .env
   docker-compose --profile development up -d
   ```

2. **Code Changes**
   - Edit source code (hot-reload enabled)
   - For dependency changes: rebuild container

3. **Database Changes**
   - Schema changes: Update `init-mongo.js`
   - Reset database: `docker-compose down -v && docker-compose --profile development up -d`

4. **Testing**
   ```bash
   # Run tests in container
   docker-compose exec app-dev npm test
   
   # Run specific test
   docker-compose exec app-dev npm test -- --testNamePattern="auth"
   ```

### 📈 Production Deployment

#### Single Server
```bash
# Clone repository
git clone <repository-url>
cd mind-voyage-companion

# Configure environment
cp .env.docker .env
nano .env  # Update production values

# Deploy
docker-compose --profile production up -d
```

#### Load Balancer Setup
```yaml
# Add to docker-compose.yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
  depends_on:
    - app
```

### 🔧 Customization

#### Custom MongoDB Configuration
Edit `docker/mongodb/mongod.conf` for MongoDB settings.

#### Custom Application Build
Modify `Dockerfile` for additional dependencies or build steps.

#### Environment-Specific Overrides
Create `docker-compose.override.yml` for local customizations.

### 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Next.js Docker Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Docker Compose Documentation](https://docs.docker.com/compose/)