import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface ISession extends Document {
  sessionToken: string
  userId: mongoose.Types.ObjectId
  expires: Date
}

export interface IUser extends Document {
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
  timezone: string
  preferences: Record<string, any>
}

export interface IVerificationToken extends Document {
  identifier: string
  token: string
  expires: Date
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
})

// Add compound index after schema creation
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true })

const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true },
})

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    emailVerified: Date,
    image: String,
    timezone: { type: String, default: 'UTC' },
    preferences: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
)

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
})

// Add compound index after schema creation
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true })

export const Account =
  mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema)
export const Session =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)
export const User =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    'VerificationToken',
    VerificationTokenSchema
  )
