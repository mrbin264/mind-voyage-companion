/**
 * User data interface for type safety
 */
interface UserData {
  _id: string
  email: string
  name: string
  password?: string
  image?: string
  verified: boolean
  timezone?: string
  preferences?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * Find user by email with enhanced error handling and connection management
 */
export async function findUserByEmail(email: string): Promise<UserData | null> {
  // Runtime safety checks
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client-side')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Database operations not available in edge runtime')
  }

  try {
    // Dynamic imports to avoid edge runtime issues
    const connectDB = await import('@/lib/db').then(m => m.default)
    const { User } = await import('@/lib/models/user')

    // Use the enhanced connection manager
    await connectDB()

    // Find user with password field (normally excluded)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return null
    }

    // Convert to plain object and ensure proper type conversion
    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      image: user.image,
      verified: user.verified,
      timezone: user.timezone,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error('Error finding user by email:', error)

    // Re-throw with more context for debugging
    if (error instanceof Error) {
      throw new Error(`Database query failed: ${error.message}`)
    }

    throw new Error('Unknown database error occurred')
  }
}

/**
 * Create a new user with enhanced error handling
 */
export async function createUser(userData: {
  email: string
  name: string
  password: string
  timezone?: string
  verified?: boolean
}): Promise<UserData> {
  // Runtime safety checks
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client-side')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Database operations not available in edge runtime')
  }

  try {
    // Dynamic imports to avoid edge runtime issues
    const connectDB = await import('@/lib/db').then(m => m.default)
    const { User } = await import('@/lib/models/user')

    // Use the enhanced connection manager
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user
    const user = new User({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      timezone: userData.timezone || 'UTC',
      verified: userData.verified || false,
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: false,
        },
        privacy: {
          publicProfile: false,
        },
      },
    })

    const savedUser = await user.save()

    return {
      _id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      password: savedUser.password,
      image: savedUser.image,
      verified: savedUser.verified,
      timezone: savedUser.timezone,
      preferences: savedUser.preferences,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    }
  } catch (error) {
    console.error('Error creating user:', error)

    // Re-throw with more context for debugging
    if (error instanceof Error) {
      throw new Error(`User creation failed: ${error.message}`)
    }

    throw new Error('Unknown database error occurred during user creation')
  }
}

/**
 * Update user by ID with enhanced error handling
 */
export async function updateUser(
  userId: string,
  updateData: Partial<Omit<UserData, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<UserData | null> {
  // Runtime safety checks
  if (typeof window !== 'undefined') {
    throw new Error('Database operations not available on client-side')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('Database operations not available in edge runtime')
  }

  try {
    // Dynamic imports to avoid edge runtime issues
    const connectDB = await import('@/lib/db').then(m => m.default)
    const { User } = await import('@/lib/models/user')

    // Use the enhanced connection manager
    await connectDB()

    // Update user and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return null
    }

    return {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      password: updatedUser.password,
      image: updatedUser.image,
      verified: updatedUser.verified,
      timezone: updatedUser.timezone,
      preferences: updatedUser.preferences,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }
  } catch (error) {
    console.error('Error updating user:', error)

    // Re-throw with more context for debugging
    if (error instanceof Error) {
      throw new Error(`User update failed: ${error.message}`)
    }

    throw new Error('Unknown database error occurred during user update')
  }
}
