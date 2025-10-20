'use client'

import React, { useState } from 'react'
import {
  SettingsNavigation,
  SettingsHeader,
} from '@/components/dashboard/settings/SettingsComponents'
import { ProfileForm } from '@/components/dashboard/settings/ProfileForm'
import { useSettings } from '@/hooks/useSettings'
import type { SettingsSection } from '@/types/settings'

interface SettingsPageContentProps {
  user: {
    userId: string
    email: string
    name: string
  }
}

export function SettingsPageContent({ user }: SettingsPageContentProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const {
    settings,
    profile,
    statistics,
    loading,
    saving,
    error,
    updateProfile,
  } = useSettings()

  const handleSectionChange = (section: SettingsSection) => {
    setActiveSection(section)
  }

  const handleProfileUpdate = async (profileData: any) => {
    try {
      await updateProfile(profileData)
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleSave = () => {
    // Save action is handled by individual form components
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'profile':
        return profile ? (
          <ProfileForm
            profile={profile}
            onUpdate={handleProfileUpdate}
            onSave={handleSave}
            isDirty={false}
            isSaving={saving}
          />
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400">Profile data not available</p>
          </div>
        )

      case 'notifications':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Notification Settings
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Notification settings will be implemented here.
            </p>
          </div>
        )

      case 'privacy':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Privacy Settings
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Privacy settings will be implemented here.
            </p>
          </div>
        )

      case 'preferences':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              App Preferences
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              App preferences will be implemented here.
            </p>
          </div>
        )

      case 'data':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Data Management
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Data management options will be implemented here.
            </p>
          </div>
        )

      case 'security':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Security Settings
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Security settings will be implemented here.
            </p>
          </div>
        )

      case 'subscription':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Subscription & Billing
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Subscription management will be implemented here.
            </p>
          </div>
        )

      case 'support':
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
              Help & Support
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Support options will be implemented here.
            </p>
          </div>
        )

      case 'statistics':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                Account Statistics
              </h3>

              {statistics ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
                      {statistics.habitsCreated}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Total Habits Created
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                      {statistics.currentActiveHabits}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Active Habits
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
                      {statistics.journalEntries}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Journal Entries
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">
                      {statistics.totalHabitsCompleted}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Total Completed
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                      {statistics.longestStreak}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Longest Streak
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">
                      {statistics.totalLoginDays}
                    </div>
                    <p className="text-sm sm:text-base text-gray-400">
                      Login Days
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-sm sm:text-base">Loading statistics...</p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700 text-center">
            <p className="text-sm sm:text-base text-gray-400">
              Settings section not implemented yet
            </p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Settings Header */}
      <SettingsHeader
        section={activeSection}
        onSave={handleSave}
        isDirty={false}
        isSaving={saving}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-red-400 text-xs sm:text-sm">{error}</p>
        </div>
      )}

      {/* Settings Layout - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Settings Navigation - Sidebar */}
        <div className="lg:col-span-1">
          <SettingsNavigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            className="lg:sticky lg:top-8"
          />
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">{renderSettingsContent()}</div>
      </div>
    </div>
  )
}
