import mongoose, { Schema, Document, Model } from 'mongoose'
import type { JournalEntry, JournalPrompt } from '@/types/journal'

// Interface extending Document for Mongoose
export interface IJournalEntry extends Omit<JournalEntry, '_id' | 'userId'>, Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  toSafeObject(): any
}

export interface IJournalPrompt extends Omit<JournalPrompt, '_id'>, Document {
  _id: mongoose.Types.ObjectId
}

// Interface for static methods
interface IJournalEntryModel extends Model<IJournalEntry> {
  findByUserId(userId: string, options?: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<IJournalEntry[]>
  
  findByUserIdAndDateRange(userId: string, startDate: string, endDate: string): Promise<IJournalEntry[]>
  
  searchEntries(userId: string, searchParams: {
    query?: string
    mood?: number[]
    tags?: string[]
    dateFrom?: string
    dateTo?: string
    favorite?: boolean
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    entries: IJournalEntry[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>
}

// Journal Entry Schema
const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50000, // 50k characters limit
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v: number) {
          return v >= 1 && v <= 5
        },
        message: 'Mood must be between 1 and 5'
      }
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 20 // Max 20 tags per entry
        },
        message: 'Maximum 20 tags allowed per entry'
      }
    },
    date: {
      type: String,
      required: true,
      index: true,
      validate: {
        validator: function(v: string) {
          return /^\d{4}-\d{2}-\d{2}$/.test(v)
        },
        message: 'Date must be in YYYY-MM-DD format'
      }
    },
    wordCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    favorite: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Add compound indexes manually after schema creation
JournalEntrySchema.index({ userId: 1, date: -1 }) // Primary sorting and user isolation
JournalEntrySchema.index({ userId: 1, favorite: 1, date: -1 }) // Favorite entries
JournalEntrySchema.index({ userId: 1, mood: 1, date: -1 }) // Mood-based queries
JournalEntrySchema.index({ userId: 1, tags: 1, date: -1 }) // Tag-based queries

// Journal Prompt Schema
const JournalPromptSchema = new Schema<IJournalPrompt>(
  {
    category: {
      type: String,
      enum: ['reflection', 'gratitude', 'intention', 'stoic', 'general'],
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save middleware to calculate word count and reading time
JournalEntrySchema.pre('save', function(this: IJournalEntry, next) {
  if (this.isModified('content')) {
    // Calculate word count (simple word splitting)
    const words = this.content.trim().split(/\s+/).filter((word: string) => word.length > 0)
    this.wordCount = words.length
    
    // Calculate reading time (average 200 words per minute)
    this.readingTime = Math.max(1, Math.ceil(this.wordCount / 200))
  }
  next()
})

// Instance methods
JournalEntrySchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  return {
    ...obj,
    _id: obj._id.toString(),
    userId: obj.userId.toString(),
  }
}

// Static methods for common queries
JournalEntrySchema.statics.findByUserId = function(userId: string, options: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} = {}) {
  const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = options
  const skip = (page - 1) * limit
  const sort: any = {}
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1
  
  return this.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec()
}

JournalEntrySchema.statics.findByUserIdAndDateRange = function(
  userId: string, 
  startDate: string, 
  endDate: string
) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  })
  .sort({ date: -1 })
  .exec()
}

JournalEntrySchema.statics.searchEntries = function(
  userId: string,
  searchParams: {
    query?: string
    mood?: number[]
    tags?: string[]
    dateFrom?: string
    dateTo?: string
    favorite?: boolean
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
) {
  const {
    query,
    mood,
    tags,
    dateFrom,
    dateTo,
    favorite,
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'desc'
  } = searchParams
  
  // Build query conditions
  const conditions: any = { userId }
  
  if (query) {
    conditions.$or = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  }
  
  if (mood && mood.length > 0) {
    conditions.mood = { $in: mood }
  }
  
  if (tags && tags.length > 0) {
    conditions.tags = { $in: tags }
  }
  
  if (dateFrom || dateTo) {
    conditions.date = {}
    if (dateFrom) conditions.date.$gte = dateFrom
    if (dateTo) conditions.date.$lte = dateTo
  }
  
  if (favorite !== undefined) {
    conditions.favorite = favorite
  }
  
  const skip = (page - 1) * limit
  const sort: any = {}
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1
  
  return Promise.all([
    this.find(conditions).sort(sort).skip(skip).limit(limit).exec(),
    this.countDocuments(conditions).exec()
  ]).then(([entries, total]) => ({
    entries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }))
}

// Ensure models are only compiled once
export const JournalEntryModel = (mongoose.models.JournalEntry || 
  mongoose.model<IJournalEntry, IJournalEntryModel>('JournalEntry', JournalEntrySchema)) as IJournalEntryModel

export const JournalPromptModel = mongoose.models.JournalPrompt || 
  mongoose.model<IJournalPrompt>('JournalPrompt', JournalPromptSchema)