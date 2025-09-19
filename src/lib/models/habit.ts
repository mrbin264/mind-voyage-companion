import mongoose, { Schema, Document } from 'mongoose'
import type { Habit, HabitLog, HabitFrequency, HabitTarget, HabitStatus } from '@/types/habit'

// Interfaces extending Document for Mongoose
export interface IHabit extends Omit<Habit, '_id' | 'userId'>, Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
}

export interface IHabitLog extends Omit<HabitLog, '_id' | 'habitId' | 'userId'>, Document {
  _id: mongoose.Types.ObjectId
  habitId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
}

// Subdocument schemas
const HabitFrequencySchema = new Schema<HabitFrequency>({
  type: { 
    type: String, 
    enum: ['daily', 'weekly', 'custom'], 
    required: true 
  },
  daysOfWeek: [{
    type: Number,
    min: 0,
    max: 6
  }],
  interval: {
    type: Number,
    min: 1,
    default: 1
  }
}, { _id: false })

const HabitTargetSchema = new Schema<HabitTarget>({
  type: {
    type: String,
    enum: ['boolean', 'count', 'duration', 'amount'],
    required: true
  },
  value: {
    type: Number,
    min: 0
  },
  unit: String
}, { _id: false })

const HabitStatusSchema = new Schema<HabitStatus>({
  active: {
    type: Boolean,
    default: true
  },
  archived: {
    type: Boolean,
    default: false
  },
  pausedAt: Date,
  pauseReason: String
}, { _id: false })

// Main Habit Schema
const HabitSchema = new Schema<IHabit>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  emoji: {
    type: String,
    maxlength: 10
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  frequency: {
    type: HabitFrequencySchema,
    required: true
  },
  target: {
    type: HabitTargetSchema,
    required: true
  },
  status: {
    type: HabitStatusSchema,
    default: () => ({
      active: true,
      archived: false
    })
  },
  color: {
    type: String,
    match: /^#[0-9A-F]{6}$/i,
    default: '#3B82F6'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reminderTime: {
    type: String,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Habit Log Schema
const HabitLogSchema = new Schema<IHabitLog>({
  habitId: {
    type: Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  value: {
    type: Number,
    min: 0
  },
  completedAt: Date,
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  skipped: {
    type: Boolean,
    default: false
  },
  skipReason: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
HabitSchema.index({ userId: 1, 'status.active': 1 })
HabitSchema.index({ userId: 1, category: 1 })
HabitSchema.index({ userId: 1, priority: 1 })

HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true })
HabitLogSchema.index({ userId: 1, date: 1 })
HabitLogSchema.index({ userId: 1, completed: 1, date: 1 })

// Validation middleware
HabitSchema.pre('save', function(next) {
  // Validate frequency-specific fields
  if (this.frequency.type === 'daily') {
    this.frequency.daysOfWeek = undefined
  } else if (this.frequency.type === 'weekly' && (!this.frequency.daysOfWeek || this.frequency.daysOfWeek.length === 0)) {
    return next(new Error('Weekly habits must specify days of week'))
  } else if (this.frequency.type === 'custom' && (!this.frequency.daysOfWeek || this.frequency.daysOfWeek.length === 0)) {
    return next(new Error('Custom habits must specify days of week'))
  }

  // Validate target-specific fields
  if (['count', 'duration', 'amount'].includes(this.target.type) && !this.target.value) {
    return next(new Error(`${this.target.type} habits must have a target value`))
  }

  next()
})

HabitLogSchema.pre('save', function(next) {
  if (this.completed && !this.completedAt) {
    this.completedAt = new Date()
  }
  next()
})

// Static methods for common queries
HabitSchema.statics.findActiveByUser = function(userId: mongoose.Types.ObjectId) {
  return this.find({
    userId,
    'status.active': true,
    'status.archived': false
  }).sort({ priority: -1, createdAt: -1 })
}

HabitLogSchema.statics.findByUserAndDateRange = function(
  userId: mongoose.Types.ObjectId, 
  startDate: string, 
  endDate: string
) {
  return this.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).populate('habitId')
}

// Virtual for habit completion rate
HabitSchema.virtual('completionRate').get(async function() {
  const HabitLog = mongoose.model('HabitLog')
  const logs = await HabitLog.find({ habitId: this._id })
  const completed = logs.filter(log => log.completed).length
  return logs.length > 0 ? (completed / logs.length) * 100 : 0
})

export const HabitModel = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema)
export const HabitLogModel = mongoose.models.HabitLog || mongoose.model<IHabitLog>('HabitLog', HabitLogSchema)