'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import type { HabitProgress } from '@/types/habit'

interface WeeklyProgressSectionProps {
  habits: HabitProgress[]
}

export default function WeeklyProgressSection({
  habits,
}: WeeklyProgressSectionProps) {
  return (
    <WidgetCard className="p-4 sm:p-6 lg:col-span-3">
      <h3 className="font-bold text-lg sm:text-xl mb-4 text-gray-100">
        📊 Weekly Progress
      </h3>
      <div className="space-y-3 text-sm">
        {habits.length > 0 ? (
          habits.slice(0, 4).map(habitProgress => (
            <div key={habitProgress.habit._id}>
              <div className="flex justify-between items-center mb-1 gap-2">
                <span className="text-gray-300 text-xs sm:text-sm truncate flex-1">
                  {habitProgress.habit.title}
                </span>
                <span className="font-semibold text-gray-200 text-xs sm:text-sm whitespace-nowrap">
                  {habitProgress.weeklyProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${habitProgress.weeklyProgress.percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm">
            No habits to display
          </div>
        )}
      </div>
      {habits.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h4 className="font-semibold text-sm sm:text-base text-gray-200 mb-2">
            🎖️ Achievements This Week:
          </h4>
          <ul className="space-y-1 text-xs sm:text-sm text-gray-400">
            <li>✓ 7-day Morning Pages streak</li>
            <li>✓ 5 consecutive journaling days</li>
            <li className="text-yellow-400">
              ⭐ Ready for: Consistency Champion
            </li>
          </ul>
        </div>
      )}
    </WidgetCard>
  )
}
