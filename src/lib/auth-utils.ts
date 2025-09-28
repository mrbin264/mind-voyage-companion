

/**
 * Secure environment variable validation utility
 * Ensures critical environment variables are present and valid
 */
class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentError'
  }
}

/**
 * Validates and returns JWT_SECRET with strict security requirements
 * Throws EnvironmentError if missing or invalid
 */
export function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new EnvironmentError(
      'JWT_SECRET environment variable is required for authentication. ' +
      'Please set a strong, cryptographically secure secret (minimum 32 characters).'
    )
  }

  if (secret.length < 32) {
    throw new EnvironmentError(
      'JWT_SECRET must be at least 32 characters long for security. ' +
      `Current length: ${secret.length}`
    )
  }

  // Warn about weak secrets (but don't fail - allow flexibility)
  if (secret === 'your-secret-key-here' || secret.includes('example') || secret.includes('test')) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET appears to be a default/example value. ' +
      'Please use a cryptographically secure secret in production!'
    )
  }

  return secret
}


