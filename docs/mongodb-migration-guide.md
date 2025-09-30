# MongoDB Memory Server to Docker Migration Guide

## 🎯 Migration Overview

This guide provides a complete step-by-step process to migrate your Mind Voyage application from MongoDB Memory Server to Docker MongoDB, ensuring zero downtime and data preservation.

## 📋 Pre-Migration Checklist

### System Requirements
- [ ] Docker Desktop installed and running
- [ ] pnpm package manager available
- [ ] Mind Voyage project at latest commit
- [ ] Backup of any important data

### Environment Verification
```bash
# Verify Docker is running
docker --version
docker info

# Verify project structure
ls -la package.json docker-compose.yml src/lib/db.ts

# Check current MongoDB Memory Server status
pnpm dev # Test current setup works
```

## 🚀 Migration Steps

### Step 1: Automated Migration (Recommended)

The fastest way to migrate is using our automated script:

```bash
# Run the automated migration script
./scripts/migrate-to-docker-mongodb.sh
```

This script will:
- ✅ Check system requirements
- ✅ Backup existing configuration  
- ✅ Setup Docker MongoDB
- ✅ Update database connection
- ✅ Test connections
- ✅ Create database indexes
- ✅ Clean up Memory Server

**If the automated script succeeds, skip to Step 6 (Verification).**

---

### Step 2: Manual Migration (If Automated Fails)

If you prefer manual control or the automated script fails:

#### 2.1 Backup Current Configuration

```bash
# Backup existing files
cp .env.local .env.local.backup-$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
cp src/lib/db.ts src/lib/db.ts.backup-$(date +%Y%m%d_%H%M%S)

# Stop any running development servers
pkill -f "next dev" || true
pkill -f mongod || true
```

#### 2.2 Setup Environment Configuration

Create or update your `.env.local` file:

```bash
# Copy Docker environment template
cp .env.docker.example .env.local

# Generate secure secrets (important!)
pnpm generate:secrets >> .env.local

# Edit .env.local to verify configuration
nano .env.local  # or your preferred editor
```

Your `.env.local` should contain:
```env
# MongoDB Docker Configuration
MONGODB_URI=mongodb://mindvoyage_user:mindvoyage_pass_2025@localhost:27017/mind_voyage_companion?authSource=mind_voyage_companion

# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# Generated secrets (from pnpm generate:secrets)
NEXTAUTH_SECRET=your_generated_secret
JWT_SECRET=your_generated_jwt_secret
```

#### 2.3 Start Docker MongoDB

```bash
# Create MongoDB data directory
mkdir -p data/mongodb

# Start MongoDB container
docker-compose up mongodb -d

# Verify MongoDB is starting
docker-compose logs mongodb

# Wait for MongoDB to be ready (may take 30-60 seconds)
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### 2.4 Update Database Connection

Replace the Memory Server configuration with Docker-optimized connection:

```bash
# Replace db.ts with Docker version
cp src/lib/db-docker.ts src/lib/db.ts

# Remove the temporary file
rm src/lib/db-docker.ts
```

### Step 3: Database Setup & Optimization

#### 3.1 Create Database Indexes

```bash
# Connect to MongoDB and create indexes for optimal performance
docker-compose exec mongodb mongosh mind_voyage_companion --eval "
// Habits collection indexes
db.habits.createIndex({ userId: 1, 'status.active': 1 });
db.habits.createIndex({ userId: 1, category: 1 });
db.habits.createIndex({ userId: 1, priority: 1, createdAt: -1 });

// HabitLogs collection indexes  
db.habitlogs.createIndex({ userId: 1, date: -1 });
db.habitlogs.createIndex({ habitId: 1, date: -1 });
db.habitlogs.createIndex({ userId: 1, completed: 1, date: -1 });
db.habitlogs.createIndex({ habitId: 1, userId: 1, date: 1 }, { unique: true });

// Users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

print('✅ Database indexes created successfully');
"
```

#### 3.2 Configure MongoDB User (Optional Security Enhancement)

```bash
# Create application-specific user (if not using default)
docker-compose exec mongodb mongosh mind_voyage_companion --eval "
db.createUser({
  user: 'mindvoyage_app',
  pwd: 'secure_app_password_2025',
  roles: [
    { role: 'readWrite', db: 'mind_voyage_companion' }
  ]
});
print('✅ Application user created');
"
```

### Step 4: Data Migration (If Existing Data)

If you have existing data that needs to be migrated:

#### 4.1 Export from Memory Server (If Still Available)

```bash
# If you still have access to Memory Server data
# Note: Memory Server data typically doesn't persist, but if you have exports:

# Example: If you have JSON exports
docker-compose exec mongodb mongoimport --db mind_voyage_companion --collection habits --file /path/to/habits.json --jsonArray

# Example: If you have MongoDB dumps
docker-compose exec mongodb mongorestore --db mind_voyage_companion /path/to/dump
```

#### 4.2 Migrate from Production Backup

```bash
# If migrating from a production backup
# Replace with your actual backup file paths

docker cp backup.tar.gz mind-voyage-mongodb:/tmp/
docker-compose exec mongodb tar -xzf /tmp/backup.tar.gz -C /tmp/
docker-compose exec mongodb mongorestore --db mind_voyage_companion /tmp/backup
```

### Step 5: Application Configuration Updates

#### 5.1 Update Package Scripts (Optional)

Add MongoDB-specific scripts to your `package.json`:

```json
{
  "scripts": {
    "db:start": "docker-compose up mongodb -d",
    "db:stop": "docker-compose stop mongodb",  
    "db:logs": "docker-compose logs mongodb",
    "db:shell": "docker-compose exec mongodb mongosh mind_voyage_companion",
    "db:admin": "docker-compose --profile tools up mongo-express -d"
  }
}
```

#### 5.2 Update Development Workflow

Replace Memory Server commands with Docker commands:

```bash
# OLD: Memory Server (automatic)
pnpm dev

# NEW: Docker MongoDB
pnpm db:start  # Start MongoDB first
pnpm dev       # Then start application
```

### Step 6: Verification & Testing

#### 6.1 Connection Verification

```bash
# Test 1: MongoDB Connection
docker-compose exec mongodb mongosh mind_voyage_companion --eval "
  db.runCommand({ ping: 1 });
  print('✅ MongoDB connection successful');
"

# Test 2: Application Connection  
timeout 10 pnpm --silent tsx -e "
import('./src/lib/db.js').then(async (db) => {
  await db.default();
  console.log('✅ Application database connection successful');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Application connection failed:', err.message);
  process.exit(1);
});
"
```

#### 6.2 Application Testing

```bash
# Start your application
pnpm dev

# In another terminal, test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/debug/users  # Should return empty array for new DB
```

#### 6.3 Database Admin Interface

```bash
# Start Mongo Express (Web UI)
docker-compose --profile tools up mongo-express -d

# Access at: http://localhost:8081
# Username: admin
# Password: admin123
```

### Step 7: Cleanup & Optimization

#### 7.1 Remove Memory Server Dependencies

```bash
# Remove MongoDB Memory Server package (optional)
pnpm remove mongodb-memory-server

# Clean up any remaining Memory Server processes
pkill -f mongod || true

# Remove any Memory Server data directories
rm -rf node_modules/.cache/mongodb-memory-server || true
```

#### 7.2 Update Documentation

```bash
# Update your project README with new Docker commands
echo "
## Development Setup

1. Start MongoDB: \`pnpm db:start\`
2. Start application: \`pnpm dev\`  
3. Access admin UI: http://localhost:8081

## Database Commands

- Start MongoDB: \`pnpm db:start\`
- Stop MongoDB: \`pnpm db:stop\`
- View logs: \`pnpm db:logs\`
- Database shell: \`pnpm db:shell\`
" >> README-docker.md
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Check if MongoDB container is running
docker-compose ps

# Start MongoDB if not running
docker-compose up mongodb -d

# Check MongoDB logs
docker-compose logs mongodb

# Verify port is not in use
lsof -i :27017

# Reset containers if needed
docker-compose down && docker-compose up mongodb -d
```

#### Issue 2: Authentication Failed
```
Error: Authentication failed
```

**Solutions:**
```bash
# Verify credentials in .env.local
cat .env.local | grep MONGODB

# Reset MongoDB with clean data
docker-compose down -v
docker-compose up mongodb -d

# Check MongoDB initialization logs
docker-compose logs mongodb | grep -i "user\|auth"
```

#### Issue 3: Database Not Found
```
Error: Database 'mind_voyage_companion' not found
```

**Solutions:**
```bash
# Create database manually
docker-compose exec mongodb mongosh --eval "
  use mind_voyage_companion;
  db.createCollection('_init');
  db._init.insertOne({initialized: new Date()});
  print('Database created');
"

# Verify database exists
docker-compose exec mongodb mongosh --eval "show dbs"
```

#### Issue 4: Port Already in Use
```
Error: Port 27017 is already in use
```

**Solutions:**
```bash
# Find what's using the port
lsof -i :27017

# Kill MongoDB Memory Server processes
pkill -f mongod

# Use different port in docker-compose.yml
# Change: "27017:27017" to "27018:27017"
# Update MONGODB_URI accordingly
```

#### Issue 5: Application Won't Start
```
Error: Cannot connect to database
```

**Solutions:**
```bash
# Check environment variables
echo $MONGODB_URI

# Verify .env.local format
cat .env.local | grep -v "^#"

# Test connection manually
docker-compose exec mongodb mongosh "$MONGODB_URI"

# Check application logs
pnpm dev 2>&1 | grep -i mongo
```

## 🎉 Post-Migration Checklist

### Immediate Verification
- [ ] MongoDB container running: `docker-compose ps`
- [ ] Database accessible: `docker-compose exec mongodb mongosh mind_voyage_companion`
- [ ] Application starts: `pnpm dev` 
- [ ] API endpoints working: `curl http://localhost:3000/api/health`
- [ ] Admin UI accessible: http://localhost:8081

### Performance Verification
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Query performance acceptable
- [ ] Memory usage reasonable

### Security Verification  
- [ ] Unique database passwords set
- [ ] .env.local not committed to git
- [ ] MongoDB authentication enabled
- [ ] Admin UI secured (production)

### Documentation Updates
- [ ] README updated with Docker commands
- [ ] Team notified of new workflow
- [ ] Deployment instructions updated
- [ ] Backup procedures documented

## 🚀 Next Steps

### Immediate (Next 24 hours)
1. **Test thoroughly** - Run through all application features
2. **Monitor performance** - Check database response times
3. **Backup strategy** - Set up regular MongoDB backups

### Short Term (Next Week)
1. **Production deployment** - Update production environment
2. **Team training** - Ensure team knows new Docker workflow
3. **Performance optimization** - Implement caching and query optimization

### Long Term (Next Month)  
1. **API enhancements** - Implement rate limiting and validation
2. **Monitoring** - Set up database and application monitoring
3. **Scaling** - Consider MongoDB replica sets for production

## 📞 Support

If you encounter issues during migration:

1. **Check logs first**: `docker-compose logs mongodb`
2. **Verify configuration**: Ensure .env.local is correct
3. **Test connections**: Use the verification commands above
4. **Reset if needed**: `docker-compose down -v && ./scripts/migrate-to-docker-mongodb.sh`

---

**🎉 Congratulations! You've successfully migrated from MongoDB Memory Server to Docker MongoDB!**

Your application now has:
- ✅ Persistent database storage
- ✅ Production-ready MongoDB setup  
- ✅ Optimized database indexes
- ✅ Professional development workflow
- ✅ Scalable architecture foundation

The migration positions your application for production deployment and team collaboration. Your database will now persist between application restarts, and you have full control over MongoDB configuration and optimization.