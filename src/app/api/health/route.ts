import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()

    // Determine actual MongoDB type based on connection string
    const mongodbUri = process.env.MONGODB_URI
    let dbType = 'MongoDB'

    if (mongodbUri) {
      if (mongodbUri.includes('127.0.0.1') && mongodbUri.includes('/?')) {
        dbType = 'MongoDB Memory Server'
      } else if (mongodbUri.includes('localhost:27017')) {
        dbType = 'MongoDB Docker'
      } else if (mongodbUri.includes('mongodb:27017')) {
        dbType = 'MongoDB Docker (Internal)'
      } else {
        dbType = 'MongoDB Production'
      }
    } else if (process.env.NODE_ENV === 'development') {
      dbType = 'MongoDB Memory Server'
    }

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: mongoose.connection.readyState === 1,
        environment: process.env.NODE_ENV,
        type: dbType,
        uri: mongodbUri
          ? mongodbUri.replace(/\/\/.*@/, '//***:***@')
          : 'Memory Server', // Mask credentials
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
