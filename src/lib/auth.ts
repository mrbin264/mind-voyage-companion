import { NextAuthConfig } from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { z } from 'zod'

// Configure auth to use Node.js runtime (bcryptjs needs Node.js APIs)
export const runtime = 'nodejs'

// Login schema for credential validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const authConfig: NextAuthConfig = {
  basePath: '/api/auth',
  // Use JWT sessions for simplicity (no database adapter needed)
  providers: [
    // Email/Password authentication
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log(
            'NextAuth authorize - received credentials for:',
            credentials?.email
          )

          // Validate input
          const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) {
            console.log('NextAuth authorize - validation failed:', parsed.error)
            return null
          }

          const { email, password } = parsed.data

          // Check if we're in edge runtime - if so, return null
          if (process.env.NEXT_RUNTIME === 'edge') {
            console.warn(
              'NextAuth authorize - Database access not available in edge runtime'
            )
            return null
          }

          // Dynamically import database helpers to avoid edge runtime issues
          const { findUserByEmail } = await import('@/lib/auth-helpers')

          console.log('NextAuth authorize - looking up user:', email)
          // Find user by email
          const user = await findUserByEmail(email)
          if (!user || !user.password) {
            console.log('NextAuth authorize - user not found or no password')
            return null
          }

          console.log('NextAuth authorize - found user, verifying password')
          // Verify password
          const isValidPassword = await compare(password, user.password)
          if (!isValidPassword) {
            console.log('NextAuth authorize - password invalid')
            return null
          }

          console.log(
            'NextAuth authorize - authentication successful for:',
            user.email
          )
          // Return user object for NextAuth
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('NextAuth authorize error:', error)
          return null
        }
      },
    }),

    // Microsoft Entra ID (Azure AD) authentication
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: process.env.AZURE_AD_TENANT_ID
        ? `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
        : undefined,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the user ID to the token right after signin
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Include user ID in session
      if (token.userId) {
        session.user.id = token.userId as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow sign in for both credentials and OAuth providers
      return true
    },
  },
  session: {
    strategy: 'jwt', // Use JWT sessions for better performance
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  trustHost: true, // Required for deployment
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
}

// Export auth functions for use in middleware and components
import NextAuth from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// Helper to get session in API routes
export async function getServerSession() {
  return await auth()
}

// Helper to get authenticated user or throw error
export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session.user
}
