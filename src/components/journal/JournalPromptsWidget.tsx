'use client'

import React from 'react'
import { RefreshCw, Plus } from 'lucide-react'

interface JournalPrompt {
  category: string
  text: string
  emoji: string
}

interface JournalPromptsWidgetProps {
  prompts: JournalPrompt[]
  onUsePrompt?: (prompt: JournalPrompt) => void
  onRefreshPrompts?: () => void
  className?: string
}

export default function JournalPromptsWidget({
  prompts,
  onUsePrompt,
  onRefreshPrompts,
  className = '',
}: JournalPromptsWidgetProps) {
  const defaultPrompts: JournalPrompt[] = [
    {
      category: 'Reflection',
      emoji: '💭',
      text: 'What small action today moved you closer to your goals?',
    },
    {
      category: 'Gratitude',
      emoji: '🙏',
      text: 'What are you grateful for today?',
    },
    {
      category: 'Tomorrow',
      emoji: '🎯',
      text: 'What&apos;s your intention for tomorrow?',
    },
  ]

  const displayPrompts = prompts.length > 0 ? prompts : defaultPrompts

  return (
    <div
      className={`bg-zinc-900 border border-gray-700 rounded-xl p-6 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Today&apos;s Prompts</h3>
        {onRefreshPrompts && (
          <button
            onClick={onRefreshPrompts}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Get new prompts"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-4 text-sm">
        {displayPrompts.map((prompt, index) => (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-gray-300 flex items-center gap-2">
              <span>{prompt.emoji}</span>
              {prompt.category}:
            </h4>
            <p className="text-gray-400 leading-relaxed pl-6">
              &ldquo;{prompt.text}&rdquo;
            </p>
            {onUsePrompt && (
              <button
                onClick={() => onUsePrompt(prompt)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 pl-6 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Use This Prompt
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
        <button className="text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors">
          Get New Prompt
        </button>
        <span className="text-gray-600">•</span>
        <button className="text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors">
          Browse All Prompts
        </button>
      </div>
    </div>
  )
}
