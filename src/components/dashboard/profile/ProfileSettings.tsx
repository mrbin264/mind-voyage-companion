'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { WidgetCard } from '@/components/ui/widget-card'
import { AvatarUpload } from './AvatarUpload'
import { User, Mail, Globe, Calendar, Shield, BarChart3 } from 'lucide-react'

interface AuthUser {
  userId: string
  email: string
  name: string
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  avatar?: string
  timezone: string
  joinedAt: Date
  lastLoginAt: Date
  // Statistics
  totalHabits: number
  totalJournalEntries: number
  currentStreak: number
  totalLoginDays: number
}

interface ProfileSettingsProps {
  user: AuthUser
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user.email,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
        
        // Parse name into first and last name
        const nameParts = user.name.split(' ')
        setFormData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          timezone: formData.timezone,
        }),
      })

      if (response.ok) {
        await fetchProfileData()
        setIsEditing(false)
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    if (profileData) {
      const nameParts = user.name.split(' ')
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email,
        timezone: profileData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Card */}
      <WidgetCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload
              currentAvatar={profileData?.avatar}
              userName={user.name}
              onAvatarChange={fetchProfileData}
              disabled={!isEditing}
            />
            <p className="text-sm text-gray-400 text-center">
              Click to change your profile photo
            </p>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-100">{formData.firstName || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-100">{formData.lastName || 'Not set'}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="text-gray-100 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2">
                {user.email}
                <span className="text-xs text-green-400 ml-2">✓ Verified</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Timezone
              </label>
              {isEditing ? (
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              ) : (
                <p className="text-gray-100">{formData.timezone}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </WidgetCard>

      {/* Account Statistics */}
      {profileData && (
        <WidgetCard className="p-8">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5" />
            Account Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {profileData.totalHabits || 0}
              </div>
              <p className="text-gray-400 text-sm">Total Habits</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {profileData.currentStreak || 0}
              </div>
              <p className="text-gray-400 text-sm">Current Streak</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {profileData.totalJournalEntries || 0}
              </div>
              <p className="text-gray-400 text-sm">Journal Entries</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">
                {profileData.totalLoginDays || 0}
              </div>
              <p className="text-gray-400 text-sm">Active Days</p>
            </div>
          </div>
        </WidgetCard>
      )}

      {/* Account Information */}
      <WidgetCard className="p-8">
        <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5" />
          Account Information
        </h2>

        <div className="space-y-4 text-sm">
          {profileData && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Member since:</span>
                <span className="text-gray-100">
                  {new Date(profileData.joinedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last login:</span>
                <span className="text-gray-100">
                  {new Date(profileData.lastLoginAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Account status:</span>
            <span className="text-green-400">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Plan:</span>
            <span className="text-gray-100">Free</span>
          </div>
        </div>
      </WidgetCard>
    </div>
  )
}