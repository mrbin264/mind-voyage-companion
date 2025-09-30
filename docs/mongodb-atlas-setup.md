# MongoDB Atlas Integration Guide

This guide walks you through setting up MongoDB Atlas for production deployment of the Mind Voyage Companion application.

## Why MongoDB Atlas?

MongoDB Atlas is the recommended cloud database solution for production deployment because:

- **Fully Managed**: Automatic backups, updates, and maintenance
- **Global Clusters**: Multi-region deployment capabilities
- **Built-in Security**: Network isolation, encryption at rest and in transit
- **Monitoring**: Comprehensive performance monitoring and alerting
- **Scalability**: Easy vertical and horizontal scaling

## Setup Process

### 1. Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account or log in to existing account
3. Create a new project called "Mind Voyage Companion"

### 2. Create Database Cluster

#### Staging Environment
```bash
# Cluster Configuration
- Cluster Name: mind-voyage-staging
- Cloud Provider: Azure (recommended for consistency)
- Region: East US (match your App Service region)
- Cluster Tier: M0 (Free) or M2 (Shared) for staging
- MongoDB Version: 7.0
```

#### Production Environment
```bash
# Cluster Configuration
- Cluster Name: mind-voyage-production
- Cloud Provider: Azure
- Region: East US
- Cluster Tier: M10+ (Dedicated) for production
- MongoDB Version: 7.0
- Backup: Enabled
- Monitoring: Enabled
```

### 3. Configure Network Access

1. **IP Whitelist**: Add Azure App Service IP ranges
   ```
   # For Azure App Services, you may need to whitelist:
   0.0.0.0/0 (Allow access from anywhere)
   # Or configure VNet integration for enhanced security
   ```

2. **VNet Peering** (Production Recommended):
   - Set up VNet peering between Atlas and Azure
   - Provides private network connectivity
   - Enhanced security and performance

### 4. Create Database User

Create a dedicated database user for the application:

```javascript
// Database User Configuration
Username: mindvoyage_app_user
Password: <generate-secure-password>
Database Admin: false
Built-in Role: readWrite on mind_voyage_companion database
```

### 5. Database and Collections Setup

The application will automatically create collections, but you can pre-create them:

```javascript
// Database: mind_voyage_companion
// Collections:
- users          // User accounts and profiles
- habits         // Habit definitions and settings
- habit_logs     // Daily habit tracking logs
- journal_entries // Journal entries and reflections
- wisdom_quotes  // Stoic wisdom and quotes
- analytics      // User analytics and insights
```

### 6. Get Connection String

1. Navigate to your cluster in Atlas
2. Click "Connect" → "Connect your application"
3. Select "Node.js" and version 4.1 or later
4. Copy the connection string

Example connection string format:
```
mongodb+srv://mindvoyage_app_user:<password>@mind-voyage-staging.xxxxx.mongodb.net/mind_voyage_companion?retryWrites=true&w=majority&appName=mind-voyage-staging
```

## Environment Configuration

### Staging Environment Variables
```bash
MONGODB_URI=mongodb+srv://mindvoyage_app_user:<password>@mind-voyage-staging.xxxxx.mongodb.net/mind_voyage_companion?retryWrites=true&w=majority&appName=mind-voyage-staging
MONGODB_DB_NAME=mind_voyage_companion
```

### Production Environment Variables
```bash
MONGODB_URI=mongodb+srv://mindvoyage_app_user:<password>@mind-voyage-production.xxxxx.mongodb.net/mind_voyage_companion?retryWrites=true&w=majority&appName=mind-voyage-production
MONGODB_DB_NAME=mind_voyage_companion
```

## Security Best Practices

### Connection Security
- Always use SSL/TLS connections (built-in with Atlas)
- Use MongoDB Atlas IP whitelisting
- Consider VNet peering for production
- Rotate database passwords regularly

### Authentication
- Create application-specific database users
- Use least-privilege access (readWrite only)
- Avoid using cluster admin accounts for applications
- Enable MongoDB Atlas auditing for production

### Data Protection
- Enable automatic backups (included with dedicated clusters)
- Configure backup retention policies
- Set up monitoring and alerting
- Implement data encryption at rest (enabled by default)

## Performance Optimization

### Connection Pooling
The application uses Mongoose with built-in connection pooling:

```javascript
// Connection options in production
const options = {
  maxPoolSize: 10,          // Maximum number of connections
  serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,   // Close connections after 45 seconds of inactivity
  bufferMaxEntries: 0,      // Disable mongoose buffering
  bufferCommands: false,    // Disable mongoose buffering
};
```

### Indexing Strategy
Create indexes for common query patterns:

```javascript
// Recommended indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.habits.createIndex({ "userId": 1 })
db.habit_logs.createIndex({ "userId": 1, "date": 1 })
db.journal_entries.createIndex({ "userId": 1, "createdAt": -1 })
```

### Monitoring
- Enable MongoDB Atlas monitoring
- Set up alerts for high CPU, memory, and connection usage
- Monitor slow queries and optimize as needed

## Migration from Development

When migrating from local MongoDB Memory Server to Atlas:

1. **Export Development Data** (if needed):
   ```bash
   mongodump --uri="mongodb://localhost:27017/mind_voyage_companion"
   ```

2. **Import to Atlas** (if needed):
   ```bash
   mongorestore --uri="<atlas-connection-string>" dump/
   ```

3. **Update Environment Variables**:
   - Remove local `MONGODB_URI` from development
   - Add Atlas connection string to Key Vault

## Cost Considerations

### Staging Environment
- M0 (Free Tier): 512 MB storage, suitable for testing
- M2 (Shared): $9/month, 2 GB storage, better performance

### Production Environment
- M10 (Dedicated): $57/month minimum, dedicated resources
- M20: $120/month, better performance for higher loads
- M30+: Enterprise features, advanced monitoring

### Cost Optimization Tips
- Use free tier (M0) for staging/development
- Start with M10 for production and scale as needed
- Monitor usage and optimize queries to reduce data transfer
- Consider reserved instances for predictable workloads

## Troubleshooting

### Common Connection Issues
1. **IP Whitelist**: Ensure App Service IPs are whitelisted
2. **User Permissions**: Verify user has readWrite access to database
3. **Connection String**: Double-check URL encoding of special characters
4. **Network**: Test connection from Azure Cloud Shell

### Performance Issues
1. **Slow Queries**: Use MongoDB Atlas Performance Advisor
2. **High Connections**: Monitor connection pool usage
3. **Memory Usage**: Check for memory leaks in application code

### Monitoring Queries
Use MongoDB Atlas built-in monitoring or connect external tools:
- Real-time performance metrics
- Slow query analysis
- Index usage statistics
- Connection tracking