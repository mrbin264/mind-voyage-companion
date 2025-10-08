/**
 * Sample Mongoose Model Template
 *
 * This demonstrates how to create a Mongoose schema and model.
 * Copy this template for your domain models.
 *
 * Examples: Product, Order, Category, Comment, etc.
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

// ============================================================================
// TypeScript Interface (matches your domain type)
// ============================================================================

export interface ISample {
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending'
  userId: string
  tags: string[]
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// Mongoose Document Interface (extends Document for MongoDB _id, etc.)
// ============================================================================

export interface ISampleDocument extends ISample, Document {
  // Add instance methods here
  isActive(): boolean
  activate(): Promise<ISampleDocument>
  deactivate(): Promise<ISampleDocument>
}

// ============================================================================
// Mongoose Model Interface (for static methods)
// ============================================================================

export interface ISampleModel extends Model<ISampleDocument> {
  // Add static methods here
  findByUserId(userId: string): Promise<ISampleDocument[]>
  findActive(): Promise<ISampleDocument[]>
  createForUser(
    userId: string,
    data: Partial<ISample>
  ): Promise<ISampleDocument>
}

// ============================================================================
// Mongoose Schema Definition
// ============================================================================

const SampleSchema = new Schema<ISampleDocument, ISampleModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      index: true, // Add index for faster queries
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'pending'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User', // Reference to User model
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: 'samples', // Explicit collection name
  }
)

// ============================================================================
// Indexes (for query optimization)
// ============================================================================

// Compound index for common queries
SampleSchema.index({ userId: 1, status: 1 })
SampleSchema.index({ userId: 1, createdAt: -1 })

// Text index for search functionality
SampleSchema.index({ name: 'text', description: 'text' })

// ============================================================================
// Instance Methods (called on document instances)
// ============================================================================

SampleSchema.methods.isActive = function (): boolean {
  return this.status === 'active'
}

SampleSchema.methods.activate = async function (): Promise<ISampleDocument> {
  this.status = 'active'
  return await this.save()
}

SampleSchema.methods.deactivate = async function (): Promise<ISampleDocument> {
  this.status = 'inactive'
  return await this.save()
}

// ============================================================================
// Static Methods (called on the model)
// ============================================================================

SampleSchema.statics.findByUserId = async function (
  userId: string
): Promise<ISampleDocument[]> {
  return await this.find({ userId }).sort({ createdAt: -1 })
}

SampleSchema.statics.findActive = async function (): Promise<
  ISampleDocument[]
> {
  return await this.find({ status: 'active' }).sort({ createdAt: -1 })
}

SampleSchema.statics.createForUser = async function (
  userId: string,
  data: Partial<ISample>
): Promise<ISampleDocument> {
  return await this.create({
    ...data,
    userId,
    status: data.status || 'active',
  })
}

// ============================================================================
// Middleware (Hooks)
// ============================================================================

// Pre-save hook
SampleSchema.pre('save', async function (next) {
  // Example: Auto-generate slug or perform validation
  if (this.isModified('name')) {
    // Do something when name changes
    console.log(`Name changed to: ${this.name}`)
  }
  next()
})

// Post-save hook
SampleSchema.post('save', function (doc) {
  console.log(`Sample document saved: ${doc._id}`)
})

// Pre-remove hook
SampleSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    console.log(`Deleting sample: ${this._id}`)
    // Cleanup related data here
    next()
  }
)

// ============================================================================
// Virtual Properties (computed fields)
// ============================================================================

SampleSchema.virtual('tagCount').get(function () {
  return this.tags.length
})

SampleSchema.virtual('isRecent').get(function () {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return this.createdAt > dayAgo
})

// Include virtuals in JSON output
SampleSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    // Remove sensitive or unnecessary fields
    // Type assertion needed for Mongoose internal types
    delete (ret as any).__v
    return ret
  },
})

// ============================================================================
// Query Helpers (for chaining queries)
// ============================================================================

// Note: Query helpers require proper typing for Mongoose queries
// For TypeScript strict mode, you may need to extend Query types
// Here's a simplified version without strict typing for the example:

// Example usage pattern (without query helpers):
// const userSamples = await Sample.find({ userId: 'user123', status: 'active' })

// ============================================================================
// Export Model
// ============================================================================

// Prevent model recompilation in development (Next.js hot reload)
export const Sample =
  (mongoose.models.Sample as ISampleModel) ||
  mongoose.model<ISampleDocument, ISampleModel>('Sample', SampleSchema)

// ============================================================================
// Example Usage:
// ============================================================================

/*
// In an API route:
import { Sample } from '@/lib/models/Sample'
import connectDB from '@/lib/db'

export async function GET(request: NextRequest) {
  await connectDB()
  
  // Use static methods
  const activeSamples = await Sample.findActive()
  const userSamples = await Sample.findByUserId('user123')
  
  // Use query helpers
  const filtered = await Sample.find().byUser('user123').active()
  
  // Use instance methods
  const sample = await Sample.findById('id')
  if (sample) {
    await sample.activate()
    const isActive = sample.isActive()
  }
  
  return NextResponse.json({ data: activeSamples })
}

// Create new document:
const newSample = await Sample.createForUser('user123', {
  name: 'Test Sample',
  description: 'A test',
  tags: ['test', 'example']
})

// Update document:
const updated = await Sample.findByIdAndUpdate(
  'id',
  { name: 'Updated Name' },
  { new: true, runValidators: true }
)

// Delete document:
await Sample.findByIdAndDelete('id')

// Complex query:
const results = await Sample.find({
  userId: 'user123',
  status: 'active',
  tags: { $in: ['important'] }
})
  .sort({ createdAt: -1 })
  .limit(10)
  .populate('userId', 'name email')
*/
