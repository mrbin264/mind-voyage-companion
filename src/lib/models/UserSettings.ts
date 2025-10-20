import mongoose, { Schema, model, models } from 'mongoose'

export interface IUserSettings {
  userId: string
  theme?: string
  notifications?: boolean
  exportData?: Record<string, unknown>
  createdAt?: Date
  updatedAt?: Date
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      default: 'dark',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    exportData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

export const UserSettingsModel =
  models.UserSettings ||
  model<IUserSettings>('UserSettings', UserSettingsSchema)

export function getUserSettingsModel() {
  return UserSettingsModel
}

export default UserSettingsModel
