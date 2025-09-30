import { NextRequest, NextResponse } from 'next/server'
import { getConnectionHealth, healthCheck } from '@/lib/db'

/**
 * Database Health Check Endpoint
 * GET /api/health/db
 *
 * Returns current database connection status and metrics
 * Useful for monitoring and alerting systems
 */
export async function GET(req: NextRequest) {
  try {
    const health = getConnectionHealth()
    const healthCheckData = await healthCheck()

    const status = health.isConnected ? 'healthy' : 'unhealthy'
    const httpStatus = health.isConnected ? 200 : 503 // Service Unavailable if DB is down

    const response = {
      status,
      database: {
        connected: health.isConnected,
        readyState: health.readyState,
        readyStateText: health.readyStateText,
        host: health.host,
        port: health.port,
        databaseName: health.database,
        lastConnected: health.lastConnected,
        lastConnectedAt: health.lastConnected
          ? health.lastConnected.toISOString()
          : null,
        connectionCount: health.connectionCount,
        uptime: health.lastConnected ? Date.now() - health.lastConnected.getTime() : null,
        retryCount: health.retryCount,
        ...(health.lastError && {
          lastError: health.lastError.message
        })
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }

    return NextResponse.json(response, { status: httpStatus })
  } catch (error) {
    console.error('Database health check error:', error)

    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to check database health',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    )
  }
}



/**
 * Optional: Add a POST endpoint to force reconnection (useful for testing)
 * Only available in development environment
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Force reconnection only available in development' },
      { status: 403 }
    )
  }

  try {
    const { disconnectDB } = await import('@/lib/db')
    const connectDB = (await import('@/lib/db')).default
    
    await disconnectDB()
    await connectDB()

    return NextResponse.json({
      status: 'success',
      message: 'Database reconnection forced',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Force reconnection error:', error)

    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to force reconnection',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
