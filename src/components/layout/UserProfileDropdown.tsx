'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/LogoutButton'

interface UserProfileDropdownProps {
  user: {
    name: string
    email: string
  }
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown when pressing Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleCloseDropdown = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={handleToggleDropdown}
        className="flex items-center gap-3 p-2 rounded-lg light:bg-slate-100 light:hover:bg-slate-200 light:text-slate-800 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-0 focus:border-transparent border-0"
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{ border: 'none', outline: 'none' }}
      >
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <div className="font-semibold light:!text-slate-800 dark:text-gray-100">{user.name}</div>
          <div className="text-sm light:!text-slate-800 dark:text-gray-400">{user.email}</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 light:!text-slate-800 dark:text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 light:bg-white dark:bg-gray-900 light:border light:border-slate-200 dark:border-gray-700 rounded-lg light:shadow-md dark:shadow-lg z-50">
          <div className="py-2">
            {/* User Info Section */}
            <div className="px-4 py-2 border-b light:border-slate-200 dark:border-gray-700">
              <div className="font-medium light:!text-slate-800 dark:text-gray-100">{user.name}</div>
              <div className="text-sm light:!text-slate-500 dark:text-gray-400">{user.email}</div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href={'/dashboard/settings' as any}
                onClick={handleCloseDropdown}
                className="flex items-center gap-3 px-4 py-2 light:!text-slate-700 dark:text-gray-300 light:hover:bg-slate-100 dark:hover:bg-gray-800 light:hover:!text-slate-900 dark:hover:text-white transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>

              {/* Divider */}
              <div className="h-px light:bg-slate-200 light:border-t-transparent dark:bg-gray-700 my-1" />

              {/* Logout Button */}
              <div className="px-2 py-1">
                <LogoutButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start light:!text-red-600 dark:text-red-400 light:hover:!text-red-700 dark:hover:text-red-300 light:hover:bg-red-50 dark:hover:bg-red-500/10"
                  showIcon={true}
                >
                  Logout
                </LogoutButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
