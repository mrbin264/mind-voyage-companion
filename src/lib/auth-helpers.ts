export async function findUserByEmail(email: string) {
  // Only import database modules on server-side
  if (typeof window !== 'undefined' || process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Database operations not available in edge runtime')
  }

  const connectDB = await import('@/lib/db').then(m => m.default)
  const { User } = await import('@/lib/models/user')

  await connectDB()
  return await User.findOne({ email }).select('+password')
}