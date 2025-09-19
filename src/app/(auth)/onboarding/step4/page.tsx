'use client'

import React from 'react'
import Link from 'next/link'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

export default function OnboardingStep4() {
  const handleGoToDashboard = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            displayName: 'User', // This would come from context/session in a real app
            timezone: 'America/New_York',
            language: 'english',
            wakeUpTime: '7:00 AM',
            sleepTime: '11:00 PM',
          },
          habit: {
            habitId: 1, // Default habit
            reminderTime: '9:00 AM',
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
      window.location.href = '/dashboard/habits'
    } catch (error) {
      console.error('Network error:', error)
      // Redirect anyway for now
      window.location.href = '/dashboard/habits'
    }
  }

  return (
    <OnboardingLayout currentStep={4} totalSteps={4}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center py-12 md:py-16">
        {/* Left Column: Welcome Message */}
        <div className="lg:col-span-3">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-100">
              🎉 Welcome to Mind Voyage!
            </h2>
            <p className="text-gray-400 mt-3 mb-8">
              You&apos;re all set up and ready to begin your personal growth
              journey!
            </p>

            <div className="space-y-6 bg-gray-800/30 p-6 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">
                  Here&apos;s what you&apos;ve set up:
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">Profile:</span> Your
                    personal settings
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">First habit:</span> 💧
                    Your chosen habit
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ <span className="text-gray-200">Preferences:</span> Daily
                    reminders enabled
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

            <div className="mt-10">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Preview & Tips */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-200">
              Your Journey Starts
            </h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Today!
            </p>
          </div>

          <div className="bg-white/[0.03] border border-blue-500/30 backdrop-blur-sm p-6 rounded-xl">
            <h4 className="font-bold text-gray-200 mb-4">
              📊 Today&apos;s Dashboard Preview
            </h4>
            <div className="space-y-3">
              <p className="text-lg">Good morning! ☀️</p>
              <div className="bg-gray-800/50 p-3 rounded-md">
                <p className="font-semibold text-gray-300">
                  🎯 Today&apos;s Focus:
                </p>
                <p className="text-sm text-gray-400">
                  Complete your first habit goal
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-300">
                  💧 Your Habit:{' '}
                  <span className="font-normal text-gray-400">
                    Ready to start
                  </span>
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">
                    Mark Complete
                  </button>
                  <button className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <p className="font-semibold text-gray-300 text-sm">
                  ✨ Quick Start:
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">
                    📝 Journal
                  </button>
                  <button className="text-xs bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-1 px-3 rounded-md transition-colors">
                    🏛️ Wisdom
                  </button>
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
