import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: mongoose.connection.readyState === 1,
        environment: process.env.NODE_ENV,
        type:
          process.env.NODE_ENV === 'development'
            ? 'MongoDB Memory Server'
            : 'MongoDB',
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
