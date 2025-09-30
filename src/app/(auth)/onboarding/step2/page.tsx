'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

interface Habit {
  id: number
  emoji: string
  name: string
  shortDesc: string
  longName: string
  longDesc: string
  popular: boolean
}

const defaultHabits: Habit[] = [
  {
    id: 1,
    emoji: '💧',
    name: 'Hydration',
    shortDesc: '8 glasses/day',
    longName: 'Drink 8 Glasses of Water',
    longDesc: 'Daily hydration goal',
    popular: true,
  },
  {
    id: 2,
    emoji: '📚',
    name: 'Reading',
    shortDesc: '20 minutes/day',
    longName: 'Read for 20 Minutes',
    longDesc: 'Expand your knowledge',
    popular: false,
  },
  {
    id: 3,
    emoji: '🚶',
    name: 'Exercise',
    shortDesc: 'Daily movement',
    longName: 'Daily Exercise',
    longDesc: 'Stay active and healthy',
    popular: false,
  },
  {
    id: 4,
    emoji: '📝',
    name: 'Journaling',
    shortDesc: 'Evening reflect',
    longName: 'Evening Journaling',
    longDesc: 'Reflect on your day',
    popular: true,
  },
  {
    id: 5,
    emoji: '🧘',
    name: 'Meditation',
    shortDesc: 'Mindfulness',
    longName: 'Mindful Meditation',
    longDesc: 'Practice daily mindfulness',
    popular: false,
  },
]

export default function OnboardingStep2() {
  const [selectedHabitId, setSelectedHabitId] = useState<number>(1)
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false)

  const selectedHabit = defaultHabits.find(h => h.id === selectedHabitId)

  const handleHabitSelect = (habitId: number) => {
    setSelectedHabitId(habitId)
    setShowCustomForm(false)
  }

  const handleCreateCustom = () => {
    setShowCustomForm(true)
  }

  const handleSubmit = () => {
    // TODO: Save habit data to backend
    console.log('Selected habit:', selectedHabit)
  }

  return (
    <OnboardingLayout currentStep={2} totalSteps={3}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 py-12 md:py-16">
        {/* Left Column: Habit Selection */}
        <div className="lg:col-span-3">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-100">
              Create Your First Habit 🎯
            </h2>
            <p className="text-gray-400 mt-3 mb-8">
              Choose from our most popular habits or create your own custom
              habit.
            </p>

            <h3 className="font-semibold text-gray-300 mb-4">
              Popular Starting Habits:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {defaultHabits.map(habit => (
                <div
                  key={habit.id}
                  onClick={() => handleHabitSelect(habit.id)}
                  className={`bg-white/[0.03] border border-white/10 backdrop-blur-sm p-4 rounded-xl cursor-pointer transition-all duration-200 hover:border-blue-500/50 ${
                    selectedHabitId === habit.id
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{habit.emoji}</span>
                    {habit.popular && (
                      <span className="text-yellow-400">⭐</span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-200 mt-2">{habit.name}</h4>
                  <p className="text-sm text-gray-400">{habit.shortDesc}</p>
                  <button className="text-sm font-semibold text-blue-400 mt-3">
                    Select
                  </button>
                </div>
              ))}

              {/* Custom Habit Card */}
              <div
                onClick={handleCreateCustom}
                className="bg-white/[0.03] border border-dashed border-gray-600 hover:border-blue-500 p-4 rounded-xl cursor-pointer transition-all duration-200"
              >
                <span className="text-2xl">➕</span>
                <h4 className="font-bold text-gray-200 mt-2">Custom</h4>
                <p className="text-sm text-gray-400">Create your own</p>
                <button className="text-sm font-semibold text-blue-400 mt-3">
                  Create
                </button>
              </div>
            </div>

            {!showCustomForm && selectedHabit && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <p className="text-gray-300 font-semibold">
                  Selected:{' '}
                  <span className="text-blue-400 font-bold">
                    {selectedHabit.emoji} {selectedHabit.longName}
                  </span>
                </p>
                <div className="mt-4 text-gray-400 text-sm space-y-2">
                  <p className="font-semibold text-gray-300">
                    ⚙️ Customize (optional):
                  </p>
                  <ul>
                    <li>
                      • Reminder time:{' '}
                      <span className="text-gray-200">9:00 AM</span>
                    </li>
                    <li>
                      • Frequency:{' '}
                      <span className="text-gray-200">Every day</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {showCustomForm && (
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="font-semibold text-gray-300 mb-4">
                  Create Custom Habit
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Habit name (e.g., 'Drink more water')"
                    className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200"
                  />
                  <select className="w-full bg-gray-800/50 border border-gray-600 text-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 transition-all duration-200 appearance-none">
                    <option>Choose an emoji</option>
                    <option>💧 Water</option>
                    <option>🥗 Food</option>
                    <option>🏃 Exercise</option>
                    <option>📚 Learning</option>
                    <option>😌 Mindfulness</option>
                  </select>
                </div>
              </div>
            )}

            <Link
              href="/onboarding/step3"
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 mt-10 block text-center"
            >
              Create Habit
            </Link>
          </div>
        </div>

        {/* Right Column: Popular Habits List */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full justify-start">
          <h3 className="text-xl font-bold text-gray-200">
            Popular Starter Habits
          </h3>
          <div className="flex flex-col gap-4">
            {defaultHabits.map(habit => (
              <div
                key={`large-${habit.id}`}
                onClick={() => handleHabitSelect(habit.id)}
                className={`bg-white/[0.03] border border-white/10 backdrop-blur-sm p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 hover:border-blue-500/50 ${
                  selectedHabitId === habit.id
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : ''
                }`}
              >
                <div>
                  <h4 className="font-bold text-gray-200">
                    {habit.emoji} {habit.longName}
                  </h4>
                  <p className="text-sm text-gray-400">{habit.longDesc}</p>
                </div>
                <button className="text-sm font-semibold text-blue-400 whitespace-nowrap ml-4">
                  Select This Habit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
