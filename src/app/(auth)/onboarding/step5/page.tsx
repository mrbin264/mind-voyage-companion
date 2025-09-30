'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

interface ProfileFormData {
  firstName: string
  lastName: string
  timezone: string
  language: string
  wakeUpTime: string
  sleepTime: string
}

export default function OnboardingStep5() {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    timezone: 'America/New_York',
    language: 'en-US',
    wakeUpTime: '7:00 AM',
    sleepTime: '11:00 PM',
  })

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Profile update failed:', errorData.message)
        return
      }

      const result = await response.json()
      console.log('Profile updated successfully:', result)

      // Navigate to next step
      window.location.href = '/onboarding/step3'
    } catch (error) {
      console.error('Network error:', error)
    }
  }

  return (
    <OnboardingLayout currentStep={2} totalSteps={4}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start py-12 md:py-16">
        {/* Left Column: Profile Form */}
        <div className="lg:col-span-3">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-100">
              Set Up Your Profile ⚙️
            </h2>
            <p className="text-gray-400 mt-3 mb-8">
              Help us personalize your experience with these quick preferences.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    value={formData.firstName}
                    onChange={e =>
                      handleInputChange('firstName', e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    value={formData.lastName}
                    onChange={e =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  📍 Your Location
                </label>
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={e => handleInputChange('timezone', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200 appearance-none"
                >
                  <option value="America/New_York">
                    🌍 America/New_York (UTC-5)
                  </option>
                  <option value="Europe/London">
                    🌍 Europe/London (UTC+0)
                  </option>
                  <option value="Asia/Tokyo">🌍 Asia/Tokyo (UTC+9)</option>
                  <option value="Asia/Ho_Chi_Minh">
                    🌍 Asia/Ho_Chi_Minh (UTC+7)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  🗣️ Preferred Language
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('language', 'en-US')}
                    className={`w-full text-left overflow-hidden border-2 rounded-xl transition-all ${
                      formData.language === 'en-US'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="px-4 py-3">🇺🇸 English</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('language', 'vi-VN')}
                    className={`w-full text-left overflow-hidden border-2 rounded-xl transition-all ${
                      formData.language === 'vi-VN'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="px-4 py-3">🇻🇳 Tiếng Việt</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  🌅 Daily Rhythm (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="wake-up" className="sr-only">
                      I wake up at:
                    </label>
                    <select
                      id="wake-up"
                      value={formData.wakeUpTime}
                      onChange={e =>
                        handleInputChange('wakeUpTime', e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200 appearance-none"
                    >
                      <option value="6:00 AM">I wake up at: 6:00 AM</option>
                      <option value="7:00 AM">I wake up at: 7:00 AM</option>
                      <option value="8:00 AM">I wake up at: 8:00 AM</option>
                      <option value="9:00 AM">I wake up at: 9:00 AM</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sleep-at" className="sr-only">
                      I sleep at:
                    </label>
                    <select
                      id="sleep-at"
                      value={formData.sleepTime}
                      onChange={e =>
                        handleInputChange('sleepTime', e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200 appearance-none"
                    >
                      <option value="10:00 PM">I sleep at: 10:00 PM</option>
                      <option value="11:00 PM">I sleep at: 11:00 PM</option>
                      <option value="12:00 AM">I sleep at: 12:00 AM</option>
                      <option value="1:00 AM">I sleep at: 1:00 AM</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 mt-10"
              >
                Continue
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Personalization Tips */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full justify-center">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-200 mb-4">
              Personalization Tips
            </h3>
            <dl className="space-y-4 text-gray-300">
              <div>
                <dt className="font-semibold text-gray-200">👤 Name</dt>
                <dd className="text-sm text-gray-400">
                  This is how you&apos;ll appear in your journal entries and
                  dashboard.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-200">🌍 Timezone</dt>
                <dd className="text-sm text-gray-400">
                  Ensures accurate daily tracking and reminders.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-200">🗣️ Language</dt>
                <dd className="text-sm text-gray-400">
                  Choose your preferred language for the interface.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-200">📅 Daily Rhythm</dt>
                <dd className="text-sm text-gray-400">
                  Helps us suggest optimal reminder times for your habits.
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl text-center">
            <p className="font-semibold text-gray-200">
              💡 You can change these anytime in your settings.
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
