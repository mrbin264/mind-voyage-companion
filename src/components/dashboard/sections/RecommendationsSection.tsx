'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'

export default function RecommendationsSection() {
  return (
    <WidgetCard className="p-4 sm:p-6 lg:col-span-2">
      <h3 className="font-bold text-lg sm:text-xl mb-4 text-gray-100">
        🎯 Recommendations
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 mb-3">
        Based on your patterns:
      </p>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
        <li>• Try meditating after reading</li>
        <li>• Your hydration improves on journaling days</li>
        <li>• Consider an evening routine</li>
      </ul>
      <button className="text-xs sm:text-sm font-semibold text-purple-400 mt-4 hover:underline touch-manipulation">
        ✨ Get Pro AI Insights
      </button>
    </WidgetCard>
  )
}
