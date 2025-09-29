import mongoose, { Connection } from 'mongoose'

// MongoDB Memory Server for development (only on server-side)
let mongoMemoryServer: any = null
let mongoMemoryServerPromise: Promise<any> | null = null

// Connection state interface
interface ConnectionState {
  conn: Connection | null
  promise: Promise<Connection> | null
  uri: string | null
  isConnecting: boolean
  lastConnected: number | null
  connectionAttempts: number
}

/**
 * Connection metrics tracking interface
 */
interface ConnectionMetrics {
  totalConnections: number
  successfulConnections: number
  failedConnections: number
  averageConnectionTime: number
  longestConnectionTime: number
  lastConnectionTime: number
  connectionStartTime: number | null
  disconnectionCount: number
  reconnectionCount: number
  errors: Array<{
    timestamp: Date
    error: string
    type: 'connection' | 'disconnection' | 'operation'
  }>
}

/**
 * Performance metrics tracking
 */
interface PerformanceMetrics {
  queryCount: number
  averageQueryTime: number
  slowQueries: Array<{
    timestamp: Date
    duration: number
    operation: string
  }>
  activeConnections: number
  poolUtilization: number
}

// Global connection cache with enhanced state tracking
declare global {
  var __mongoConnection: ConnectionState | undefined
  var __mongoMetrics: ConnectionMetrics | undefined
  var __mongoPerformance: PerformanceMetrics | undefined
}

// Connection configuration with optimal settings (modern Mongoose options)
const CONNECTION_CONFIG = {
  // Connection pool settings
  maxPoolSize: 10, // Maximum number of connections
  minPoolSize: 2, // Minimum number of connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to wait for server selection
  socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timing out

  // Reliability settings
  retryWrites: true, // Automatically retry certain write operations
  retryReads: true, // Automatically retry certain read operations

  // Additional settings for production stability
  connectTimeoutMS: 10000, // How long to wait for initial connection
  family: 4, // Use IPv4, skip trying IPv6
}

// Development-specific configuration
const DEV_CONNECTION_CONFIG = {
  ...CONNECTION_CONFIG,
  maxPoolSize: 5, // Smaller pool for development
  minPoolSize: 1,
  maxIdleTimeMS: 10000, // Shorter idle time for development
}

/**
 * Create MongoDB Memory Server instance (development only)
 */
async function createMemoryServer(): Promise<any> {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const server = await MongoMemoryServer.create({
      binary: {
        version: '7.0.0', // Use a stable MongoDB version
        downloadDir: './mongodb-binaries', // Cache binaries locally
      },
      instance: {
        dbName: 'mind-voyage-companion-dev',
        storageEngine: 'wiredTiger',
      },
    })
    console.log('📝 MongoDB Memory Server started for development')
    return server
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error)
    throw new Error('Could not initialize development database')
  }
}

/**
 * Get MongoDB URI with environment-specific logic
 */
async function getMongoUri(): Promise<string> {
  // Runtime safety checks
  if (typeof window !== 'undefined') {
    throw new Error('Database connection attempted on client-side')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Database connection not supported in edge runtime')
  }

  // Check for explicit MONGODB_URI first (Docker or production)
  const MONGODB_URI = process.env.MONGODB_URI
  if (MONGODB_URI) {
    console.log('📝 Using MongoDB URI from environment variable')
    return MONGODB_URI
  }

  // Development fallback: Use Memory Server only if no MONGODB_URI is set
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '📝 No MONGODB_URI found, falling back to Memory Server for development'
    )

    // Use MongoDB Memory Server in development with proper singleton management
    if (!mongoMemoryServer) {
      // If a creation is already in progress, wait for it
      if (!mongoMemoryServerPromise) {
        mongoMemoryServerPromise = createMemoryServer()
      }
      mongoMemoryServer = await mongoMemoryServerPromise
      mongoMemoryServerPromise = null
    }
    return mongoMemoryServer.getUri()
  }

  // Production: Require MONGODB_URI
  throw new Error(
    'Please define the MONGODB_URI environment variable for production. ' +
      'For Docker: mongodb://username:password@mongodb:27017/database_name'
  )
}

/**
 * Initialize global connection state
 */
function initializeConnectionState(): ConnectionState {
  return {
    conn: null,
    promise: null,
    uri: null,
    isConnecting: false,
    lastConnected: null,
    connectionAttempts: 0,
  }
}

/**
 * Get or initialize the global connection state
 */
function getConnectionState(): ConnectionState {
  if (!global.__mongoConnection) {
    global.__mongoConnection = initializeConnectionState()
  }
  return global.__mongoConnection
}

/**
 * Check if the current connection is healthy
 */
function isConnectionHealthy(state: ConnectionState): boolean {
  return !!(
    state.conn &&
    state.conn.readyState === 1 && // Connected
    state.uri &&
    state.lastConnected &&
    Date.now() - state.lastConnected < 300000 // Connection is less than 5 minutes old
  )
}

/**
 * Initialize connection metrics tracking
 */
function initializeConnectionMetrics(): ConnectionMetrics {
  return {
    totalConnections: 0,
    successfulConnections: 0,
    failedConnections: 0,
    averageConnectionTime: 0,
    longestConnectionTime: 0,
    lastConnectionTime: 0,
    connectionStartTime: null,
    disconnectionCount: 0,
    reconnectionCount: 0,
    errors: [],
  }
}

/**
 * Initialize performance metrics tracking
 */
function initializePerformanceMetrics(): PerformanceMetrics {
  return {
    queryCount: 0,
    averageQueryTime: 0,
    slowQueries: [],
    activeConnections: 0,
    poolUtilization: 0,
  }
}

/**
 * Get or initialize connection metrics
 */
function getConnectionMetrics(): ConnectionMetrics {
  if (!global.__mongoMetrics) {
    global.__mongoMetrics = initializeConnectionMetrics()
  }
  return global.__mongoMetrics
}

/**
 * Get or initialize performance metrics
 */
function getPerformanceMetrics(): PerformanceMetrics {
  if (!global.__mongoPerformance) {
    global.__mongoPerformance = initializePerformanceMetrics()
  }
  return global.__mongoPerformance
}

/**
 * Record connection start for timing
 */
function recordConnectionStart(): void {
  const metrics = getConnectionMetrics()
  metrics.connectionStartTime = Date.now()
  metrics.totalConnections++
}

/**
 * Record successful connection and timing
 */
function recordConnectionSuccess(): void {
  const metrics = getConnectionMetrics()
  if (metrics.connectionStartTime) {
    const connectionTime = Date.now() - metrics.connectionStartTime
    metrics.lastConnectionTime = connectionTime
    metrics.longestConnectionTime = Math.max(
      metrics.longestConnectionTime,
      connectionTime
    )

    // Calculate running average
    metrics.averageConnectionTime =
      (metrics.averageConnectionTime * metrics.successfulConnections +
        connectionTime) /
      (metrics.successfulConnections + 1)

    metrics.connectionStartTime = null
  }
  metrics.successfulConnections++
}

/**
 * Record connection failure
 */
function recordConnectionFailure(error: string): void {
  const metrics = getConnectionMetrics()
  metrics.failedConnections++
  metrics.connectionStartTime = null

  // Store error (keep last 10 errors)
  metrics.errors.push({
    timestamp: new Date(),
    error,
    type: 'connection',
  })

  if (metrics.errors.length > 10) {
    metrics.errors.shift()
  }
}

/**
 * Record disconnection
 */
function recordDisconnection(reason?: string): void {
  const metrics = getConnectionMetrics()
  metrics.disconnectionCount++

  if (reason) {
    metrics.errors.push({
      timestamp: new Date(),
      error: reason,
      type: 'disconnection',
    })

    if (metrics.errors.length > 10) {
      metrics.errors.shift()
    }
  }
}

/**
 * Update active connections count
 */
function updateActiveConnections(count: number): void {
  const performance = getPerformanceMetrics()
  performance.activeConnections = count

  // Calculate pool utilization (assuming max pool size from config)
  const maxPoolSize = process.env.NODE_ENV === 'development' ? 5 : 10
  performance.poolUtilization = (count / maxPoolSize) * 100
}

/**
 * Record query performance
 */
function recordQueryPerformance(operation: string, duration: number): void {
  const performance = getPerformanceMetrics()
  performance.queryCount++

  // Calculate running average
  performance.averageQueryTime =
    (performance.averageQueryTime * (performance.queryCount - 1) + duration) /
    performance.queryCount

  // Record slow queries (>1000ms)
  if (duration > 1000) {
    performance.slowQueries.push({
      timestamp: new Date(),
      duration,
      operation,
    })

    // Keep only last 20 slow queries
    if (performance.slowQueries.length > 20) {
      performance.slowQueries.shift()
    }
  }
}

/**
 * Get comprehensive metrics report
 */
export function getConnectionMetricsReport(): {
  connection: ConnectionMetrics
  performance: PerformanceMetrics
  status: {
    isConnected: boolean
    readyState: number
    connectionAge: number
  }
} {
  const state = getConnectionState()
  const connectionMetrics = getConnectionMetrics()
  const performanceMetrics = getPerformanceMetrics()

  return {
    connection: connectionMetrics,
    performance: performanceMetrics,
    status: {
      isConnected: isConnectionHealthy(state),
      readyState: state.conn?.readyState || 0,
      connectionAge: state.lastConnected ? Date.now() - state.lastConnected : 0,
    },
  }
}

/**
 * Enhanced connection function with health monitoring and automatic reconnection
 */
async function connectDB(): Promise<Connection> {
  const state = getConnectionState()

  // Return existing healthy connection
  if (isConnectionHealthy(state)) {
    return state.conn!
  }

  // If connection is in progress, wait for it
  if (state.isConnecting && state.promise) {
    try {
      return await state.promise
    } catch (error) {
      // If waiting connection fails, continue to create new one
      console.warn(
        '⚠️ Previous connection attempt failed, creating new connection'
      )
      state.isConnecting = false
      state.promise = null
    }
  }

  // Double-check for existing connection after waiting
  if (isConnectionHealthy(state)) {
    return state.conn!
  }

  // Create new connection
  state.isConnecting = true
  state.connectionAttempts++

  try {
    const mongoUri = await getMongoUri()

    // Ensure mongoose is not already connected to a different URI
    if (mongoose.connection.readyState !== 0) {
      const currentUri = mongoose.connection.host
      if (currentUri && currentUri !== mongoUri) {
        console.log('🔄 Disconnecting from different MongoDB URI')
        await mongoose.disconnect()
      }
    }

    // Use different configs for dev/prod
    const config =
      process.env.NODE_ENV === 'development'
        ? DEV_CONNECTION_CONFIG
        : CONNECTION_CONFIG

    console.log(
      `📝 Connecting to MongoDB (attempt ${state.connectionAttempts})...`
    )

    // Record connection start for metrics
    recordConnectionStart()

    state.promise = mongoose
      .connect(mongoUri, config)
      .then(mongooseInstance => {
        const connection = mongooseInstance.connection

        // Set up connection event listeners for monitoring
        connection.on('connected', () => {
          console.log(
            `📝 Connected to MongoDB: ${process.env.NODE_ENV === 'development' ? 'Memory Server' : 'Production'}`
          )
          state.lastConnected = Date.now()
          state.connectionAttempts = 0 // Reset attempts on successful connection

          // Record successful connection metrics
          recordConnectionSuccess()
          updateActiveConnections(connection.readyState === 1 ? 1 : 0)
        })

        connection.on('disconnected', () => {
          console.warn('⚠️ MongoDB disconnected')
          state.conn = null
          state.lastConnected = null

          // Record disconnection metrics
          recordDisconnection('Connection lost')
          updateActiveConnections(0)
        })

        connection.on('error', error => {
          console.error('❌ MongoDB connection error:', error)
          state.conn = null
          state.promise = null
          state.lastConnected = null
        })

        connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected')
          state.lastConnected = Date.now()
        })

        // Set connection state
        state.conn = connection
        state.uri = mongoUri
        state.isConnecting = false

        return connection
      })

    const connection = await state.promise
    return connection
  } catch (error) {
    state.isConnecting = false
    state.promise = null
    state.conn = null

    console.error(
      `❌ Failed to connect to MongoDB (attempt ${state.connectionAttempts}):`,
      error
    )

    // Record connection failure metrics
    recordConnectionFailure(
      error instanceof Error ? error.message : String(error)
    )

    // Exponential backoff for connection retries
    if (state.connectionAttempts < 3) {
      const delay = Math.min(
        1000 * Math.pow(2, state.connectionAttempts - 1),
        10000
      )
      console.log(`🔄 Retrying connection in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return connectDB() // Recursive retry
    }

    throw new Error(
      `Failed to connect to MongoDB after ${state.connectionAttempts} attempts: ${error}`
    )
  }
}

/**
 * Gracefully disconnect from MongoDB
 */
async function disconnectDB(): Promise<void> {
  const state = getConnectionState()

  try {
    if (state.conn) {
      await mongoose.disconnect()
      console.log('📝 Disconnected from MongoDB')
    }

    // Clean up MongoDB Memory Server in development
    if (mongoMemoryServer && process.env.NODE_ENV === 'development') {
      await mongoMemoryServer.stop()
      mongoMemoryServer = null
      console.log('📝 MongoDB Memory Server stopped')
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  } finally {
    // Reset connection state
    Object.assign(state, initializeConnectionState())
  }
}

/**
 * Get connection health status for monitoring
 */
function getConnectionHealth(): {
  isConnected: boolean
  readyState: number | null
  host: string | null
  lastConnected: number | null
  connectionAttempts: number
} {
  const state = getConnectionState()

  return {
    isConnected: isConnectionHealthy(state),
    readyState: state.conn?.readyState || null,
    host: state.conn?.host || null,
    lastConnected: state.lastConnected,
    connectionAttempts: state.connectionAttempts,
  }
}

/**
 * Force reconnection (useful for testing or recovery)
 */
async function forceReconnectDB(): Promise<Connection> {
  const state = getConnectionState()

  // Disconnect current connection
  if (state.conn) {
    await mongoose.disconnect()
  }

  // Reset state and reconnect
  Object.assign(state, initializeConnectionState())
  return connectDB()
}

export default connectDB
export { disconnectDB, getConnectionHealth, forceReconnectDB }
