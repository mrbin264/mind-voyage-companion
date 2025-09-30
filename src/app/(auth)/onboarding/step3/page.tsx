'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Globe, Clock } from 'lucide-react'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { timezoneOptions, languageOptions } from '@/hooks/useSettings'

export default function OnboardingStep3() {
  const [timezone, setTimezone] = useState('(GMT-8) Pacific Time')
  const [language, setLanguage] = useState('en-US')
  const [wakeUpTime, setWakeUpTime] = useState('07:00')
  const [sleepTime, setSleepTime] = useState('23:00')

  const handleGoToDashboard = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            timezone,
            language,
            wakeUpTime,
            sleepTime,
          },
          habit: {
            habitId: 1, // Default habit
            reminderTime: '09:00', // 24-hour format as expected by validation
            frequency: 'daily',
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Onboarding completion failed:', errorData.message)
        return
      }

      const result = await response.json()
      console.log('Onboarding completed successfully:', result)

      // Redirect to habits page
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Network error:', error)
      // Redirect anyway for now
      window.location.href = '/dashboard'
    }
  }

  return (
    <OnboardingLayout currentStep={3} totalSteps={3}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start py-12 md:py-16">
        {/* Left Column: Preferences Setup */}
        <div className="lg:col-span-3">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-100">Final Setup</h2>
            <p className="text-gray-400 mt-3 mb-8">
              Let&apos;s personalize your experience with your timezone,
              language, and schedule preferences.
            </p>

            {/* Preferences Form */}
            <div className="space-y-6 bg-gray-800/30 p-6 rounded-xl mb-8">
              <h3 className="font-semibold text-gray-300 mb-4">
                Regional Preferences
              </h3>

              {/* Timezone Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  {timezoneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Preferences */}
              <h3 className="font-semibold text-gray-300 mb-4 mt-6">
                Daily Schedule
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wake Up Time
                  </label>
                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={e => setWakeUpTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sleep Time
                  </label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={e => setSleepTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Setup Summary */}
            <div className="space-y-6 bg-gray-800/30 p-6 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">
                  🎉 You&apos;re all set! Here&apos;s your setup:
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">Timezone:</span>{' '}
                    {timezoneOptions
                      .find(opt => opt.value === timezone)
                      ?.label?.split(' ')
                      .slice(0, 2)
                      .join(' ') || timezone}
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">Language:</span>{' '}
                    {languageOptions.find(opt => opt.value === language)
                      ?.label || language}
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">Schedule:</span>{' '}
                    {wakeUpTime} - {sleepTime}
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">First habit:</span> Ready
                    to start
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">
                  🎯 Your next steps:
                </h3>
                <ul className="space-y-2 text-gray-400 list-decimal list-inside">
                  <li>Complete your first habit today</li>
                  <li>Write your first journal entry</li>
                  <li>Explore the daily wisdom quotes</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Complete Setup & Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Preview & Tips */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full justify-start">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-200">Almost Ready!</h3>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Your Journey Awaits
            </p>
          </div>

          <div className="bg-white/[0.03] border border-blue-500/30 backdrop-blur-sm p-6 rounded-xl">
            <h4 className="font-bold text-gray-200 mb-4">
              🎛️ Personalization Benefits
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-300 text-sm">
                    Smart Scheduling
                  </p>
                  <p className="text-xs text-gray-400">
                    Habits and reminders aligned with your timezone and sleep
                    schedule
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-300 text-sm">
                    Localized Experience
                  </p>
                  <p className="text-xs text-gray-400">
                    Interface and content in your preferred language
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-purple-400 text-lg mt-0 flex-shrink-0">
                  🎯
                </span>
                <div>
                  <p className="font-semibold text-gray-300 text-sm">
                    Optimal Timing
                  </p>
                  <p className="text-xs text-gray-400">
                    Habit reminders based on your daily routine
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-orange-400 text-lg mt-0 flex-shrink-0">
                  📊
                </span>
                <div>
                  <p className="font-semibold text-gray-300 text-sm">
                    Better Analytics
                  </p>
                  <p className="text-xs text-gray-400">
                    Progress tracking adjusted to your local time
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-gray-800/50 p-4 rounded-xl text-center">
              <p className="text-gray-400">
                <span className="font-bold text-gray-200">🎁 Pro Tip:</span> Try
                journaling after completing habits to reflect on your progress!
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl text-center">
              <p className="text-gray-400">
                <span className="font-bold text-gray-200">🔔 Reminder:</span>{' '}
                We&apos;ll send gentle reminders to help you stay on track.
              </p>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
