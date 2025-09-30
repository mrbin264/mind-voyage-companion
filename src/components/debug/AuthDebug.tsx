'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    // Try to fetch session directly
    const testFetch = async () => {
      try {
        console.log('Testing NextAuth session endpoint...')
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        console.log('Session endpoint response:', data)
        setDebugInfo({
          status: response.status,
          data,
          url: '/api/auth/session'
        })
      } catch (error) {
        console.error('Session fetch error:', error)
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          url: '/api/auth/session'
        })
      }
    }

    testFetch()
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">NextAuth Debug Info</h3>
      <div className="space-y-2">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Session:</strong> {session ? 'Found' : 'None'}
        </div>
        {session && (
          <div>
            <strong>User:</strong> {session.user?.email || 'No email'}
          </div>
        )}
        {debugInfo && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <strong>Direct Fetch:</strong>
            <pre className="mt-1 text-xs overflow-auto max-h-32">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}