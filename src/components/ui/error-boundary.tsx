'use client'

import { AlertCircle, RefreshCw, RotateCw } from 'lucide-react'
import { cn, getUserFriendlyMessage } from '@/lib/utils'
import type { ErrorBoundaryProps } from '@/types/ui'

/**
 * Error boundary component for graceful error handling
 *
 * Displays user-friendly error messages with retry mechanism.
 * Single manual retry per specification (no automatic retries).
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   error={error}
 *   retry={() => refetch()}
 *   context="loading habits"
 * />
 * ```
 */
export function ErrorBoundary({
  error,
  retry,
  context,
  children,
}: ErrorBoundaryProps) {
  // If no error, render children normally
  if (!error && children) {
    return <>{children}</>
  }

  // If error exists, display error UI
  if (error) {
    const userMessage = getUserFriendlyMessage(error)
    const isDev = process.env.NODE_ENV === 'development'

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col items-center justify-center p-8 bg-zinc-900 border border-red-500/20 rounded-lg"
      >
        {/* Error Icon */}
        <div className="mb-4 text-red-500">
          <AlertCircle size={48} />
        </div>

        {/* Error Title */}
        <h3 className="text-lg font-semibold text-zinc-100 mb-2">
          {context ? `Error ${context}` : 'Something went wrong'}
        </h3>

        {/* User-friendly Message */}
        <p className="text-sm text-zinc-400 mb-6 text-center max-w-md">
          {userMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {retry && (
            <button
              onClick={retry}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
                'bg-primary-500 text-white hover:bg-primary-600',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-zinc-900'
              )}
              aria-label="Retry loading"
              autoFocus
            >
              <RotateCw size={16} />
              Retry
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
              'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900'
            )}
            aria-label="Refresh page"
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>
        </div>

        {/* Development Mode: Show Error Stack */}
        {isDev && (
          <details className="mt-6 w-full max-w-2xl">
            <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-400 mb-2">
              Show technical details (dev only)
            </summary>
            <pre className="text-xs text-zinc-400 bg-zinc-950 p-4 rounded border border-zinc-800 overflow-auto max-h-48">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    )
  }

  return null
}
