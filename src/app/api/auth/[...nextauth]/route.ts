import { handlers } from '@/lib/auth'

// Use Node.js runtime for bcryptjs compatibility
export const runtime = 'nodejs'

export const { GET, POST } = handlers
