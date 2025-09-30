import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User as UserModel } from '@/lib/models/user'
import { HabitModel } from '@/lib/models/habit'
import { secureEndpoint } from '@/lib/middleware/security'
import type { SecurityContext } from '@/lib/middleware/security'
import mongoose from 'mongoose'
import type {
  UserProfile,
  AccountStatistics,
  SettingsSection,
} from '@/types/settings'

/**
 * Enhanced error handler for settings API routes
 */
function handleSettingsError(error: unknown, operation: string) {
  console.error(`Settings API error during ${operation}:`, error)

  if (error instanceof mongoose.Error) {
    console.error('MongoDB connection issue in settings API')
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection error',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      },
      { status: 503 }
    )
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Data validation error',
        details: error.message,
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: `Failed to ${operation}`,
      details:
        process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : undefined,
    },
    { status: 500 }
  )
}

// GET /api/settings - Get user settings
export const GET = secureEndpoint.api(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  // Use enhanced connection manager
  await connectDB()

  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section') as SettingsSection | null

  if (section === 'profile') {
    const profileData = await getUserProfile(session!.user.id)
    return NextResponse.json({
      success: true,
      data: profileData,
      })
    } else if (section === 'statistics') {
      const statsData = await generateAccountStatistics(session!.user.id)
      return NextResponse.json({
        success: true,
        data: statsData,
      })
    } else {
      // For now, return basic profile data
      const profileData = await getUserProfile(session!.user.id)
      const statsData = await generateAccountStatistics(session!.user.id)

      return NextResponse.json({
        success: true,
        data: {
          profile: profileData,
          statistics: statsData,
          // Placeholder data for other sections
          notifications: getDefaultNotificationSettings(session!.user.id),
          privacy: getDefaultPrivacySettings(session!.user.id),
          preferences: getDefaultUserPreferences(session!.user.id),
          security: getDefaultSecuritySettings(session!.user.id),
          subscription: getDefaultSubscriptionInfo(session!.user.id),
        },
      })
    }
})

// PUT /api/settings - Update user settings
export const PUT = secureEndpoint.mutation(async (
  request: NextRequest,
  context: SecurityContext
): Promise<NextResponse> => {
  const { session } = context
  
  const { section, data } = await request.json()

  if (!section || !data) {
    return NextResponse.json(
      { success: false, error: 'Section and data are required' },
        { status: 400 }
      )
    }

    // Use enhanced connection manager
    await connectDB()

    if (section === 'profile') {
      const updatedProfile = await updateUserProfile(session!.user.id, data)
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      })
    } else {
      // For other sections, just return success for now
      return NextResponse.json({
        success: true,
        message: `${section} settings updated successfully`,
        data: data,
      })
    }
})

// Helper Functions
async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const user = await UserModel.findById(userId)

    // If user doesn't exist, try to create a basic profile
    if (!user) {
      console.log('User not found, creating basic profile for userId:', userId)

      // For now, return a default profile structure
      // In production, this should not happen if authentication is working correctly
      return {
        id: userId,
        firstName: '',
        lastName: '',
        email: '',
        profilePhoto: undefined,
        dateOfBirth: undefined,
        bio: '', // Changed from aboutMe
        location: undefined,
        timezone: '(GMT-8) Pacific Time',
        language: 'en-US',
        website: undefined,
        socialLinks: undefined,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    return {
      id: user._id.toString(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      profilePhoto: user.profilePhoto,
      dateOfBirth: user.dateOfBirth,
      bio: user.bio || '', // Changed from aboutMe to bio
      location: user.location,
      timezone: user.timezone || '(GMT-8) Pacific Time',
      language: user.preferences?.language || 'en-US', // Get language from preferences
      website: user.website,
      socialLinks: user.socialLinks,
      emailVerified: user.emailVerified || false,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    throw new Error(
      `Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
) {
  const updateData: any = {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    profilePhoto: profileData.profilePhoto,
    dateOfBirth: profileData.dateOfBirth,
    bio: profileData.bio, // Changed from aboutMe to bio
    location: profileData.location,
    timezone: profileData.timezone,
    website: profileData.website,
    socialLinks: profileData.socialLinks,
    updatedAt: new Date(),
  }

  // Update language in preferences if provided
  if (profileData.language) {
    updateData['preferences.language'] = profileData.language
  }

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData]
    }
  })

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  })

  if (!updatedUser) {
    throw new Error('Failed to update user profile')
  }

  return await getUserProfile(userId)
}

async function generateAccountStatistics(
  userId: string
): Promise<AccountStatistics> {
  try {
    const user = await UserModel.findById(userId)

    // Get habits count (even if user doesn't exist in users collection)
    const habitsCount = await HabitModel.countDocuments({ userId })
    const activeHabitsCount = await HabitModel.countDocuments({
      userId,
      archivedAt: { $exists: false },
    })

    return {
      userId,
      memberSince: user?.createdAt?.toISOString() || new Date().toISOString(),
      totalLoginDays: 78, // This would be calculated from login logs
      habitsCreated: habitsCount,
      journalEntries: 127, // This would be from journal entries collection
      longestStreak: 21, // This would be calculated from habit logs
      totalHabitsCompleted: 145, // This would be calculated from habit logs
      currentActiveHabits: activeHabitsCount,
      averageMoodRating: 3.8, // This would be calculated from journal entries
      streaksAchieved: 5, // This would be calculated from habit streaks
      lastActiveDate: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error generating account statistics:', error)
    // Return default statistics if there's an error
    return {
      userId,
      memberSince: new Date().toISOString(),
      totalLoginDays: 0,
      habitsCreated: 0,
      journalEntries: 0,
      longestStreak: 0,
      totalHabitsCompleted: 0,
      currentActiveHabits: 0,
      averageMoodRating: 0,
      streaksAchieved: 0,
      lastActiveDate: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
    }
  }
}

// Default settings functions (placeholder implementations)
function getDefaultNotificationSettings(userId: string) {
  return {
    userId,
    email: {
      habitReminders: true,
      journalReminders: true,
      weeklyReports: true,
      achievements: true,
      productUpdates: false,
      marketingEmails: false,
    },
    push: {
      habitReminders: true,
      journalReminders: true,
      achievements: true,
      streakMilestones: true,
    },
    inApp: {
      achievements: true,
      streakMilestones: true,
      tips: true,
    },
    reminderTimes: {
      morning: '08:00',
      evening: '20:00',
    },
    updatedAt: new Date().toISOString(),
  }
}

function getDefaultPrivacySettings(userId: string) {
  return {
    userId,
    dataSharing: {
      analytics: false,
      improvements: false,
      research: false,
    },
    visibility: {
      profile: 'private' as const,
      habits: 'private' as const,
      achievements: 'private' as const,
    },
    dataRetention: {
      deleteInactiveData: false,
      retentionPeriodDays: 365,
    },
    updatedAt: new Date().toISOString(),
  }
}

function getDefaultUserPreferences(userId: string) {
  return {
    userId,
    theme: 'dark' as const,
    dateFormat: 'MM/DD/YYYY' as const,
    timeFormat: '12h' as const,
    weekStartsOn: 'monday' as const,
    currency: 'USD',
    habitDefaults: {
      reminderTime: '08:00',
      difficulty: 'medium' as const,
      category: 'personal',
    },
    journalDefaults: {
      reminderTime: '21:00',
      defaultMood: 3,
      enablePrompts: true,
    },
    dashboard: {
      showWeather: true,
      showQuote: true,
      showStreak: true,
      defaultView: 'grid' as const,
    },
    updatedAt: new Date().toISOString(),
  }
}

function getDefaultSecuritySettings(userId: string) {
  return {
    userId,
    twoFactorAuth: {
      enabled: false,
      method: null,
    },
    passwordSettings: {
      lastChanged: new Date().toISOString(),
      requireChange: false,
    },
    loginSecurity: {
      logoutAfterInactivity: true,
      inactivityMinutes: 60,
      requirePasswordForSensitiveActions: true,
    },
    activeSessions: [],
    updatedAt: new Date().toISOString(),
  }
}

function getDefaultSubscriptionInfo(userId: string) {
  return {
    userId,
    plan: 'free' as const,
    status: 'active' as const,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    features: {
      aiInsights: false,
      unlimitedHabits: false,
      advancedAnalytics: false,
      exportData: false,
      prioritySupport: false,
      customThemes: false,
    },
    billing: {
      currency: 'USD',
    },
    updatedAt: new Date().toISOString(),
  }
}
