import mongoose from 'mongoose'

// MongoDB Memory Server for development (only on server-side)
let mongoMemoryServer: any = null

declare global {
  var mongoose: any
}

async function getMongoUri() {
  // Check if we're in edge runtime or client-side - use fallback URI
  if (typeof window !== 'undefined' || process.env.NEXT_RUNTIME === 'edge') {
    // Fallback for edge runtime - use a dummy URI (shouldn't be used)
    return 'mongodb://localhost:27017/mind-voyage-companion'
  }

  if (process.env.NODE_ENV === 'development') {
    // Use MongoDB Memory Server in development (server-side only)
    if (!mongoMemoryServer) {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.0', // Use a stable MongoDB version
        },
      })
      console.log('📝 MongoDB Memory Server started for development')
    }
    return mongoMemoryServer.getUri()
  }

  // Use regular MongoDB URI in production
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable for production'
    )
  }
  return MONGODB_URI
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const mongoUri = await getMongoUri()
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(mongoUri, opts).then(mongoose => {
      console.log(
        `📝 Connected to MongoDB: ${process.env.NODE_ENV === 'development' ? 'Memory Server' : 'Production'}`
      )
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
