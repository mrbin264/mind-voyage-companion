'use client'

import React from 'react'
import Link from 'next/link'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

export default function OnboardingStep1() {
  return (
    <OnboardingLayout currentStep={1} totalSteps={4}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12 md:py-16">
        {/* Left Column: Welcome Message */}
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100">
            Welcome to Mind Voyage! 👋
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Let&apos;s set up your personal growth journey in just a few simple
            steps.
          </p>

          <div className="space-y-4 my-8 text-gray-300">
            <p className="flex items-start gap-3 text-lg">
              🎯{' '}
              <span className="text-gray-400">
                Set meaningful goals that align with your values
              </span>
            </p>
            <p className="flex items-start gap-3 text-lg">
              📊{' '}
              <span className="text-gray-400">
                Track your progress with beautiful visualizations
              </span>
            </p>
            <p className="flex items-start gap-3 text-lg">
              🧠{' '}
              <span className="text-gray-400">
                Reflect and grow through guided journaling
              </span>
            </p>
            <p className="flex items-start gap-3 text-lg">
              🏛️{' '}
              <span className="text-gray-400">
                Discover wisdom from philosophers and thinkers
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Link
              href="/onboarding/step2"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Let&apos;s Start{' '}
              <span className="font-normal text-blue-200">(2 minutes)</span>
            </Link>
            <button className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors">
              Take the Tour
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Preview */}
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-200 mb-4 text-center">
              Interactive Preview
            </h3>
            <div className="bg-white/[0.03] border border-blue-500/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl shadow-blue-500/10">
              <h4 className="font-bold text-lg text-gray-100 mb-4">
                📊 Your Future Dashboard
              </h4>
              <div className="space-y-3 text-gray-300">
                <p className="text-lg">Good morning! ☀️</p>
                <p>
                  <span className="font-semibold text-gray-200">
                    Today&apos;s Habits:
                  </span>{' '}
                  ✓ ○ 📚
                </p>
                <p>
                  <span className="font-semibold text-gray-200">Journal:</span>{' '}
                  &ldquo;Today I practiced...&rdquo;
                </p>
                <p>
                  <span className="font-semibold text-gray-200">Wisdom:</span>{' '}
                  &ldquo;The best time to...&rdquo;
                </p>
                <div className="pt-2">
                  <p className="inline-block bg-orange-500/20 text-orange-300 font-bold py-1 px-3 rounded-full">
                    Streak: 🔥 7 days
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 space-y-3 max-w-md">
            <p>
              This is what your personalized dashboard will look like once you
              complete the setup!
            </p>
            <div className="flex justify-center items-center gap-6 text-sm pt-2">
              <span>⏱️ 2 min setup</span>
              <span>📱 All devices</span>
              <span>🔒 Private data</span>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
