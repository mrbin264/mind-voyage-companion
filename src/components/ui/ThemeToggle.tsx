'use client'
import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  console.log('ThemeToggle render, current theme:', theme)

  return (
    <button
      onClick={() => {
        console.log('Toggle button clicked')
        toggleTheme()
      }}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 light:bg-gray-200 light:hover:bg-gray-300 transition-all duration-200 backdrop-blur-sm border border-white/10 dark:border-gray-700 light:border-gray-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Current theme: ${theme}. Click to switch.`}
    >
      {/* Sun icon for light mode */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          theme === 'light'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-75'
        } absolute text-yellow-500`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon icon for dark mode */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-75'
        } absolute text-blue-400`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  )
}
