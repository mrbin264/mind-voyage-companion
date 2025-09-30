/**
 * Database performance optimization utilities
 */
import mongoose from 'mongoose'

// Simple in-memory cache for development (use Redis in production)
class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number }>()
  private maxSize = 500

  private cleanup() {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    
    // Remove expired entries
    for (const [key, item] of entries) {
      if (now > item.expiry) {
        this.cache.delete(key)
      }
    }
    
    // If still too large, remove oldest entries
    if (this.cache.size > this.maxSize) {
      const remaining = Array.from(this.cache.entries())
      const toDelete = remaining.slice(0, remaining.length - this.maxSize)
      for (const [key] of toDelete) {
        this.cache.delete(key)
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    this.cleanup()
    const item = this.cache.get(key)
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    return item.value as T
  }

  async set(key: string, value: any, ttlSeconds: number = 600): Promise<void> {
    this.cleanup()
    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = Array.from(this.cache.keys())
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    
    for (const key of keys) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  userHabits: (userId: string) => `habits:${userId}`,
  userAnalytics: (userId: string, timeframe: string) => `analytics:${userId}:${timeframe}`,
  habitProgress: (habitId: string, userId: string) => `progress:${habitId}:${userId}`,
  userStreaks: (userId: string) => `streaks:${userId}`,
  journalAnalytics: (userId: string, period: string) => `journal:${userId}:${period}`,
  moodCorrelations: (userId: string) => `mood:${userId}`,
}

// Optimized database queries
export class OptimizedQueries {
  
  // Get habits with basic stats (avoiding complex aggregations)
  static async getHabitsWithBasicStats(
    userId: string,
    filters: any = {},
    limit: number = 50
  ) {
    const cacheKey = `${cacheKeys.userHabits(userId)}:${JSON.stringify(filters)}:${limit}`
    
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Simple query with lean() for better performance
    const habits = await mongoose.model('Habit')
      .find({ userId: new mongoose.Types.ObjectId(userId), ...filters })
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .lean()

    // Get recent logs in separate query
    const habitIds = habits.map(h => h._id)
    const recentLogs = await mongoose.model('HabitLog')
      .find({ 
        habitId: { $in: habitIds },
        userId: new mongoose.Types.ObjectId(userId)
      })
      .sort({ date: -1 })
      .limit(100)
      .lean()

    // Calculate stats in memory (faster for small datasets)
    const habitsWithStats = habits.map(habit => {
      const habitLogs = recentLogs.filter(
        (log: any) => log.habitId.toString() === (habit as any)._id.toString()
      )
      
      const completedCount = habitLogs.filter(log => log.completed).length
      const totalCount = habitLogs.length
      
      return {
        ...habit,
        recentStats: {
          completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
          totalLogs: totalCount,
          completedLogs: completedCount,
          lastLogDate: habitLogs[0]?.date || null
        }
      }
    })
    
    // Cache for 5 minutes
    await cache.set(cacheKey, habitsWithStats, 300)
    
    return habitsWithStats
  }

  // Efficient batch operations
  static async batchUpdateHabitLogs(updates: Array<{
    habitId: string,
    userId: string,
    date: string,
    completed: boolean,
    value?: number
  }>) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: {
          habitId: new mongoose.Types.ObjectId(update.habitId),
          userId: new mongoose.Types.ObjectId(update.userId),
          date: update.date
        },
        update: {
          $set: {
            completed: update.completed,
            ...(update.value !== undefined && { value: update.value }),
            completedAt: update.completed ? new Date() : undefined,
            updatedAt: new Date()
          }
        },
        upsert: true
      }
    }))

    const result = await mongoose.model('HabitLog').bulkWrite(bulkOps, {
      ordered: false // Allow parallel execution
    })
    
    // Invalidate related caches
    const userIds = Array.from(new Set(updates.map(u => u.userId)))
    for (const userId of userIds) {
      await CacheManager.invalidateUserData(userId)
    }
    
    return result
  }

  // Quick analytics summary
  static async getUserAnalyticsSummary(userId: string, days: number = 30) {
    const cacheKey = cacheKeys.userAnalytics(userId, `${days}d`)
    
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Parallel queries for better performance
    const [habitCount, logCount, journalCount] = await Promise.all([
      mongoose.model('Habit').countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        'status.active': true
      }),
      
      mongoose.model('HabitLog').countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDateStr },
        completed: true
      }),
      
      mongoose.model('JournalEntry') ? mongoose.model('JournalEntry').countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDateStr }
      }) : 0
    ])

    const summary = {
      activeHabits: habitCount,
      completedHabits: logCount,
      journalEntries: journalCount,
      period: `${days} days`
    }
    
    // Cache for 10 minutes
    await cache.set(cacheKey, summary, 600)
    
    return summary
  }
}

// Cache management
export class CacheManager {
  
  static async invalidateUserData(userId: string) {
    await Promise.all([
      cache.del(cacheKeys.userHabits(userId)),
      cache.del(cacheKeys.userStreaks(userId)),
      cache.invalidatePattern(`analytics:${userId}:*`),
      cache.invalidatePattern(`progress:*:${userId}`),
      cache.invalidatePattern(`journal:${userId}:*`)
    ])
  }

  static async invalidateHabitData(habitId: string, userId: string) {
    await Promise.all([
      cache.del(cacheKeys.userHabits(userId)),
      cache.del(cacheKeys.habitProgress(habitId, userId)),
      cache.del(cacheKeys.userStreaks(userId)),
      cache.invalidatePattern(`analytics:${userId}:*`)
    ])
  }

  static async getStats() {
    return {
      message: 'In-memory cache active - use Redis for production'
    }
  }
}

// Database optimization guide
export const OPTIMIZATION_GUIDE = `
📊 Database Performance Optimization Guide:
──────────────────────────────────────────

🔧 Connection Configuration:
Add these options to your MongoDB connection:
{
  maxPoolSize: 10,         // Max connections
  minPoolSize: 5,          // Min connections  
  maxIdleTimeMS: 30000,    // Close idle connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,   // Disable buffering
  bufferMaxEntries: 0
}

📈 Essential MongoDB Indexes:
db.habits.createIndex({ userId: 1, "status.active": 1 })
db.habits.createIndex({ userId: 1, category: 1 })
db.habits.createIndex({ userId: 1, priority: 1, createdAt: -1 })

db.habitlogs.createIndex({ userId: 1, date: -1 })
db.habitlogs.createIndex({ habitId: 1, date: -1 })
db.habitlogs.createIndex({ userId: 1, completed: 1, date: -1 })

db.journalentries.createIndex({ userId: 1, date: -1 })
db.journalentries.createIndex({ userId: 1, mood: 1, date: -1 })

⚡ Performance Best Practices:
• Use .lean() for read-only queries
• Implement pagination (limit/skip)
• Cache frequently accessed data
• Use bulk operations for multiple updates
• Avoid N+1 query patterns
• Consider read replicas for heavy workloads

🚀 Next Steps:
1. Add Redis for distributed caching
2. Implement connection pooling
3. Monitor slow queries
4. Set up database indexes
5. Add query performance tracking
`