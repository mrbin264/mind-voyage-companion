'use client'

import React from 'react'
import { WidgetCard } from '@/components/ui/widget-card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface QuickActionsSectionProps {
  onQuickJournal: () => void
  onGenerateWisdom: () => Promise<void>
  wisdomActionLoading: string | null
}

export default function QuickActionsSection({
  onQuickJournal,
  onGenerateWisdom,
  wisdomActionLoading,
}: QuickActionsSectionProps) {
  return (
    <WidgetCard className="p-4 sm:p-6 lg:col-span-3">
      <h3 className="font-bold text-lg sm:text-xl mb-4 text-gray-100">
        ⚡ Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onQuickJournal}
          className="p-3 sm:p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full touch-manipulation active:scale-95"
        >
          <h4 className="font-bold text-sm sm:text-base text-gray-200">
            📝 Journal
          </h4>
          <p className="text-xs sm:text-sm text-gray-400">Quick Entry</p>
        </button>
        <button
          onClick={onGenerateWisdom}
          disabled={wisdomActionLoading === 'generate'}
          className="p-3 sm:p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full disabled:opacity-50 touch-manipulation active:scale-95"
        >
          <h4 className="font-bold text-sm sm:text-base text-gray-200 flex items-center gap-2">
            {wisdomActionLoading === 'generate' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              '🏛️'
            )}
            <span className="hidden sm:inline">Get Daily Wisdom</span>
            <span className="sm:hidden">Wisdom</span>
          </h4>
          <p className="text-xs sm:text-sm text-gray-400">
            {wisdomActionLoading === 'generate' ? 'Generating...' : 'New Quote'}
          </p>
        </button>
        <Link href="/dashboard/analytics" className="block">
          <button className="p-3 sm:p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full touch-manipulation active:scale-95">
            <h4 className="font-bold text-sm sm:text-base text-gray-200">
              📊 Analytics
            </h4>
            <p className="text-xs sm:text-sm text-gray-400">View Reports</p>
          </button>
        </Link>
        <Link href="/dashboard/settings" className="block">
          <button className="p-3 sm:p-4 bg-[#18181B] border border-white/10 rounded-lg hover:border-blue-500 text-left transition-colors w-full touch-manipulation active:scale-95">
            <h4 className="font-bold text-sm sm:text-base text-gray-200">
              ⚙️ Settings
            </h4>
            <p className="text-xs sm:text-sm text-gray-400">Preferences</p>
          </button>
        </Link>
      </div>
    </WidgetCard>
  )
}
