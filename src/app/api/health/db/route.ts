import { NextRequest, NextResponse } from 'next/server'
import { getConnectionHealth, getConnectionMetricsReport } from '@/lib/db'

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
    const metricsReport = getConnectionMetricsReport()

    const status = health.isConnected ? 'healthy' : 'unhealthy'
    const httpStatus = health.isConnected ? 200 : 503 // Service Unavailable if DB is down

    const response = {
      status,
      database: {
        connected: health.isConnected,
        readyState: health.readyState,
        readyStateText: getReadyStateText(health.readyState),
        host: health.host,
        lastConnected: health.lastConnected,
        lastConnectedAt: health.lastConnected
          ? new Date(health.lastConnected).toISOString()
          : null,
        connectionAttempts: health.connectionAttempts,
        uptime: health.lastConnected ? Date.now() - health.lastConnected : null,
      },
      metrics: {
        connection: {
          total: metricsReport.connection.totalConnections,
          successful: metricsReport.connection.successfulConnections,
          failed: metricsReport.connection.failedConnections,
          successRate:
            metricsReport.connection.totalConnections > 0
              ? (
                  (metricsReport.connection.successfulConnections /
                    metricsReport.connection.totalConnections) *
                  100
                ).toFixed(2) + '%'
              : 'N/A',
          averageTime: metricsReport.connection.averageConnectionTime + 'ms',
          longestTime: metricsReport.connection.longestConnectionTime + 'ms',
          disconnections: metricsReport.connection.disconnectionCount,
          reconnections: metricsReport.connection.reconnectionCount,
        },
        performance: {
          queryCount: metricsReport.performance.queryCount,
          averageQueryTime: metricsReport.performance.averageQueryTime + 'ms',
          slowQueries: metricsReport.performance.slowQueries.length,
          activeConnections: metricsReport.performance.activeConnections,
          poolUtilization:
            metricsReport.performance.poolUtilization.toFixed(1) + '%',
        },
        recentErrors: metricsReport.connection.errors.slice(-3).map(error => ({
          timestamp: error.timestamp,
          type: error.type,
          message: error.error,
        })),
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
 * Convert Mongoose ready state number to human-readable text
 */
function getReadyStateText(readyState: number | null): string {
  switch (readyState) {
    case 0:
      return 'disconnected'
    case 1:
      return 'connected'
    case 2:
      return 'connecting'
    case 3:
      return 'disconnecting'
    case 99:
      return 'uninitialized'
    default:
      return 'unknown'
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
    const { forceReconnectDB } = await import('@/lib/db')
    await forceReconnectDB()

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
