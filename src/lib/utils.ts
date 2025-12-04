import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Converts technical error messages into user-friendly text
 *
 * @param error - Error object to parse
 * @returns User-friendly error message
 *
 * @example
 * ```ts
 * const message = getUserFriendlyMessage(new Error('Network timeout'))
 * // Returns: "Unable to connect. Please check your internet connection."
 * ```
 */
export function getUserFriendlyMessage(error: Error): string {
  const message = error.message.toLowerCase()

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout')
  ) {
    return 'Unable to connect. Please check your internet connection.'
  }

  // Authentication errors
  if (
    message.includes('unauthorized') ||
    message.includes('authentication') ||
    message.includes('401')
  ) {
    return 'You need to be logged in to access this content.'
  }

  // Permission errors
  if (
    message.includes('forbidden') ||
    message.includes('permission') ||
    message.includes('403')
  ) {
    return "You don't have permission to access this content."
  }

  // Not found errors
  if (message.includes('not found') || message.includes('404')) {
    return 'The requested content could not be found.'
  }

  // Server errors
  if (
    message.includes('server') ||
    message.includes('500') ||
    message.includes('503')
  ) {
    return 'Our servers are experiencing issues. Please try again later.'
  }

  // Validation errors
  if (message.includes('invalid') || message.includes('validation')) {
    return 'Please check your input and try again.'
  }

  // Generic fallback
  return 'Something went wrong. Please try again.'
}
