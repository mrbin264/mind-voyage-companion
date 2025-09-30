/**
 * Enhanced MongoDB Database Connection - Production Ready
 * Removed MongoDB Memory Server dependencies for Docker deployment
 */
import mongoose from 'mongoose'

// Connection state tracking
interface ConnectionState {
  isConnected: boolean
  isConnecting: boolean
  connectionCount: number
  lastConnected: Date | null
  lastError: Error | null
  retryCount: number
}

let connectionState: ConnectionState = {
  isConnected: false,
  isConnecting: false,
  connectionCount: 0,
  lastConnected: null,
  lastError: null,
  retryCount: 0
}

// Connection configuration optimized for production
const CONNECTION_OPTIONS = {
  // Connection pool settings
  maxPoolSize: 10,              // Maximum number of connections
  minPoolSize: 5,               // Minimum number of connections
  maxIdleTimeMS: 30000,         // Close connections after 30s of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000,       // How long a send or receive on a socket can take
  
  // Performance optimizations
  bufferCommands: false,        // Disable mongoose buffering
  
  // Reliability settings
  retryWrites: true,           // Enable retryable writes
  retryReads: true,            // Enable retryable reads
  
  // Connection behavior
  connectTimeoutMS: 10000,     // How long to wait for initial connection
  heartbeatFrequencyMS: 10000, // How often to check server status
  
  // Authentication
  authSource: 'mind_voyage_companion', // Database to authenticate against
}

/**
 * Get MongoDB URI with proper error handling
 */
function getMongoURI(): string {
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    throw new Error(
      'MONGODB_URI environment variable is required. ' +
      'Please set it in your .env.local file or environment.'
    )
  }

  // Validate URI format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://'
    )
  }

  return uri
}

/**
 * Enhanced connection function with retry logic and monitoring
 */
async function connectDB(): Promise<typeof mongoose> {
  try {
    // Return existing connection if already connected
    if (connectionState.isConnected && mongoose.connection.readyState === 1) {
      return mongoose
    }

    // Prevent multiple simultaneous connection attempts
    if (connectionState.isConnecting) {
      // Wait for ongoing connection attempt
      await new Promise((resolve) => {
        const checkConnection = () => {
          if (!connectionState.isConnecting || connectionState.isConnected) {
            resolve(void 0)
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
      })
      return mongoose
    }

    connectionState.isConnecting = true
    const mongoUri = getMongoURI()

    console.log('🔌 Connecting to MongoDB...', {
      environment: process.env.NODE_ENV,
      uri: mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'), // Hide password
      options: CONNECTION_OPTIONS
    })

    // Set mongoose configuration
    mongoose.set('strictQuery', true)
    mongoose.set('bufferCommands', false)
    
    // Connect with retry logic
    let connection: typeof mongoose
    const maxRetries = 3
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        connection = await mongoose.connect(mongoUri, CONNECTION_OPTIONS)
        break
      } catch (error) {
        console.warn(`🔄 Connection attempt ${attempt}/${maxRetries} failed:`, error)
        
        if (attempt === maxRetries) {
          throw error
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // Update connection state
    connectionState.isConnected = true
    connectionState.isConnecting = false
    connectionState.connectionCount++
    connectionState.lastConnected = new Date()
    connectionState.lastError = null
    connectionState.retryCount = 0

    console.log('✅ MongoDB connected successfully', {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      connectionCount: connectionState.connectionCount
    })

    // Set up connection event listeners
    setupConnectionListeners()

    return connection!

  } catch (error) {
    connectionState.isConnecting = false
    connectionState.lastError = error as Error
    connectionState.retryCount++
    
    console.error('❌ MongoDB connection failed:', {
      error: (error as Error).message,
      retryCount: connectionState.retryCount,
      uri: getMongoURI().replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
    })
    
    throw new Error(`Database connection failed: ${(error as Error).message}`)
  }
}

/**
 * Set up MongoDB connection event listeners
 */
function setupConnectionListeners(): void {
  const db = mongoose.connection

  // Remove existing listeners to prevent duplicates
  db.removeAllListeners()

  db.on('connected', () => {
    console.log('🔗 MongoDB connected')
    connectionState.isConnected = true
  })

  db.on('disconnected', () => {
    console.warn('🔌 MongoDB disconnected')
    connectionState.isConnected = false
  })

  db.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error)
    connectionState.lastError = error
    connectionState.isConnected = false
  })

  db.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected')
    connectionState.isConnected = true
    connectionState.lastError = null
  })

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down MongoDB connection...')
    await mongoose.connection.close()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('🛑 Terminating MongoDB connection...')
    await mongoose.connection.close()
    process.exit(0)
  })
}

/**
 * Get connection health information
 */
export function getConnectionHealth() {
  return {
    ...connectionState,
    readyState: mongoose.connection.readyState,
    readyStateText: getReadyStateText(mongoose.connection.readyState),
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    database: mongoose.connection.name,
  }
}

/**
 * Convert mongoose ready state to human readable text
 */
function getReadyStateText(state: number): string {
  switch (state) {
    case 0: return 'disconnected'
    case 1: return 'connected'
    case 2: return 'connecting'
    case 3: return 'disconnecting'
    default: return 'unknown'
  }
}

/**
 * Force disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close()
      connectionState.isConnected = false
      console.log('🔌 MongoDB disconnected')
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
    throw error
  }
}

/**
 * Health check endpoint data
 */
export async function healthCheck() {
  const health = getConnectionHealth()
  
  return {
    database: {
      status: health.isConnected ? 'connected' : 'disconnected',
      readyState: health.readyStateText,
      host: health.host,
      database: health.database,
      lastConnected: health.lastConnected,
      connectionCount: health.connectionCount,
      ...(health.lastError && {
        lastError: health.lastError.message
      })
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }
}

// Export the enhanced connection function
export default connectDB

/**
 * Migration Helper: Check if we can connect to Docker MongoDB
 */
export async function validateDockerConnection(): Promise<boolean> {
  try {
    const uri = getMongoURI()
    console.log('🔍 Validating Docker MongoDB connection...')
    
    // Test connection
    const testConnection = await mongoose.createConnection(uri, {
      ...CONNECTION_OPTIONS,
      serverSelectionTimeoutMS: 3000 // Shorter timeout for validation
    })
    
    // Test basic operation
    await testConnection.db?.admin().ping()
    await testConnection.close()
    
    console.log('✅ Docker MongoDB connection validated')
    return true
    
  } catch (error) {
    console.error('❌ Docker MongoDB connection validation failed:', {
      error: (error as Error).message,
      suggestion: 'Make sure Docker MongoDB is running: docker-compose up mongodb -d'
    })
    return false
  }
}

/**
 * Setup database indexes for optimal performance
 */
export async function setupDatabaseIndexes(): Promise<void> {
  try {
    console.log('📊 Setting up database indexes...')
    
    const db = mongoose.connection.db
    if (!db) {
      throw new Error('Database connection not available')
    }
    
    // Habits collection indexes
    const habitsCollection = db.collection('habits')
    await Promise.all([
      habitsCollection.createIndex({ userId: 1, 'status.active': 1 }),
      habitsCollection.createIndex({ userId: 1, category: 1 }),
      habitsCollection.createIndex({ userId: 1, priority: 1, createdAt: -1 })
    ])

    // HabitLogs collection indexes
    const habitLogsCollection = db.collection('habitlogs')
    await Promise.all([
      habitLogsCollection.createIndex({ userId: 1, date: -1 }),
      habitLogsCollection.createIndex({ habitId: 1, date: -1 }),
      habitLogsCollection.createIndex({ userId: 1, completed: 1, date: -1 }),
      habitLogsCollection.createIndex({ habitId: 1, userId: 1, date: 1 }, { unique: true })
    ])

    // Users collection indexes
    const usersCollection = db.collection('users')
    await Promise.all([
      usersCollection.createIndex({ email: 1 }, { unique: true }),
      usersCollection.createIndex({ createdAt: -1 })
    ])

    console.log('✅ Database indexes created successfully')
    
  } catch (error) {
    console.error('❌ Failed to setup database indexes:', error)
    // Don't throw - indexes are performance optimization, not critical
  }
}