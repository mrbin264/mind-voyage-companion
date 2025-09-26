'use client'

import React from 'react'
import { Upload, Mail, Calendar, MapPin, Globe, Clock } from 'lucide-react'
import {
  SettingsCard,
  SettingsField,
  SettingsInput,
  SettingsSelect,
  SettingsTextarea,
} from './SettingsComponents'
import {
  useProfileForm,
  timezoneOptions,
  languageOptions,
} from '@/hooks/useSettings'
import type { UserProfile } from '@/types/settings'

interface ProfileFormProps {
  profile: UserProfile
  onUpdate: (profile: Partial<UserProfile>) => void
  onSave: () => void
  isDirty: boolean
  isSaving: boolean
  className?: string
}

export function ProfileForm({
  profile,
  onUpdate,
  onSave,
  isDirty,
  isSaving,
  className = '',
}: ProfileFormProps) {
  const { formData, updateField, submit, error } = useProfileForm(profile)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submit()
      onSave()
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like AWS S3 or Cloudinary
      const reader = new FileReader()
      reader.onload = () => {
        updateField('avatar', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className={className}>
      <div className="space-y-6">
        {/* Profile Photo */}
        <SettingsCard
          title="Profile Photo"
          description="Upload a photo to personalize your account"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {formData.firstName?.[0] ||
                      formData.email?.[0]?.toUpperCase() ||
                      '?'}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Upload className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-1">
                Choose a new profile photo
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max file size 2MB.
              </p>
            </div>
          </div>
        </SettingsCard>

        {/* Personal Information */}
        <SettingsCard
          title="Personal Information"
          description="Basic information about yourself"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsField label="First Name" required>
              <SettingsInput
                type="text"
                value={formData.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
            </SettingsField>

            <SettingsField label="Last Name" required>
              <SettingsInput
                type="text"
                value={formData.lastName}
                onChange={e => updateField('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            </SettingsField>

            <SettingsField
              label="Email Address"
              required
              description="This is your login email and where we'll send notifications"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SettingsInput
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
            </SettingsField>

            <SettingsField label="Date of Birth">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SettingsInput
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={e => updateField('dateOfBirth', e.target.value)}
                  className="pl-10"
                />
              </div>
            </SettingsField>
          </div>

          <SettingsField
            label="Bio"
            description="Tell others a little about yourself (optional)"
          >
            <SettingsTextarea
              value={formData.bio}
              onChange={e => updateField('bio', e.target.value)}
              placeholder="Write a brief description about yourself..."
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                Share your interests, goals, or philosophy
              </span>
              <span className="text-xs text-gray-500">
                {formData.bio.length}/500
              </span>
            </div>
          </SettingsField>
        </SettingsCard>

        {/* Location & Preferences */}
        <SettingsCard
          title="Location & Preferences"
          description="Set your location and regional preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsField label="Location">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <SettingsInput
                  type="text"
                  value={formData.location || ''}
                  onChange={e => updateField('location', e.target.value)}
                  placeholder="City, Country"
                  className="pl-10"
                />
              </div>
            </SettingsField>

            <SettingsField label="Timezone">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <SettingsSelect
                  value={formData.timezone}
                  onChange={e => updateField('timezone', e.target.value)}
                  options={timezoneOptions}
                  className="pl-10"
                />
              </div>
            </SettingsField>

            <SettingsField label="Language">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <SettingsSelect
                  value={formData.language}
                  onChange={e => updateField('language', e.target.value)}
                  options={languageOptions}
                  className="pl-10"
                />
              </div>
            </SettingsField>

            <SettingsField label="Website">
              <SettingsInput
                type="url"
                value={formData.website || ''}
                onChange={e => updateField('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </SettingsField>
          </div>
        </SettingsCard>

        {/* Social Links */}
        <SettingsCard
          title="Social Links"
          description="Connect your social media profiles (optional)"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsField label="Twitter">
              <SettingsInput
                type="text"
                value={formData.socialLinks?.twitter || ''}
                onChange={e =>
                  updateField('socialLinks', {
                    ...formData.socialLinks,
                    twitter: e.target.value,
                  })
                }
                placeholder="@username or profile URL"
              />
            </SettingsField>

            <SettingsField label="LinkedIn">
              <SettingsInput
                type="text"
                value={formData.socialLinks?.linkedin || ''}
                onChange={e =>
                  updateField('socialLinks', {
                    ...formData.socialLinks,
                    linkedin: e.target.value,
                  })
                }
                placeholder="LinkedIn profile URL"
              />
            </SettingsField>

            <SettingsField label="GitHub">
              <SettingsInput
                type="text"
                value={formData.socialLinks?.github || ''}
                onChange={e =>
                  updateField('socialLinks', {
                    ...formData.socialLinks,
                    github: e.target.value,
                  })
                }
                placeholder="GitHub username or profile URL"
              />
            </SettingsField>

            <SettingsField label="Instagram">
              <SettingsInput
                type="text"
                value={formData.socialLinks?.instagram || ''}
                onChange={e =>
                  updateField('socialLinks', {
                    ...formData.socialLinks,
                    instagram: e.target.value,
                  })
                }
                placeholder="@username or profile URL"
              />
            </SettingsField>
          </div>
        </SettingsCard>
      </div>
    </form>
  )
}

export default ProfileForm
