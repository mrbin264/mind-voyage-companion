import { NextAuthConfig } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { MongoClient } from "mongodb"

// MongoDB Memory Server for development
let mongoMemoryServer: any = null

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

async function getMongoUri() {
  if (process.env.NODE_ENV === 'development') {
    // Use MongoDB Memory Server in development
    if (!mongoMemoryServer) {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      mongoMemoryServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.0', // Use a stable MongoDB version
        },
      })
    }
    return mongoMemoryServer.getUri()
  }
  
  // Use regular MongoDB URI in production
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable for production')
  }
  return process.env.MONGODB_URI
}

async function createMongoClient() {
  const uri = await getMongoUri()
  
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the client
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    // In production mode, create a new client for each request
    const client = new MongoClient(uri)
    return client.connect()
  }
}

// Initialize the client promise
const clientPromise: Promise<MongoClient> = createMongoClient()

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: process.env.AZURE_AD_TENANT_ID 
        ? `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
        : undefined,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
