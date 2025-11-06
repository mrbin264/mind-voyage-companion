'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  Home,
  TrendingUp,
  Edit3,
  BarChart2,
  Shield,
  Settings,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { UserProfileDropdown } from './UserProfileDropdown'
import { Sidebar } from './Sidebar'
import { MobileNav, MobileMenuOverlay } from './MobileNav'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
  }
  showDefaultHeader?: boolean
}

const navigationItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/dashboard/habits', icon: TrendingUp, label: 'Habits' },
  { href: '/journal', icon: Edit3, label: 'Journal' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/wisdom', icon: Shield, label: 'Wisdom' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function DashboardLayout({
  children,
  user,
  showDefaultHeader = true,
}: DashboardLayoutProps) {
  const pathname = usePathname()

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Tablet sidebar collapsed state
  const [isTabletCollapsed, setIsTabletCollapsed] = useState(false)

  // Format greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Format date
  const getFormattedDate = () => {
    const date = new Date()
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  // Keyboard shortcut: Ctrl+B to toggle sidebar (tablet/desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setIsTabletCollapsed(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Keyboard shortcut: Escape to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Focus trap: prevent tab outside mobile sidebar when open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const sidebar = document.querySelector('[aria-label="Main navigation"]')
      const focusableElements = sidebar?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
      )

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }

        document.addEventListener('keydown', handleTabKey)
        return () => document.removeEventListener('keydown', handleTabKey)
      }
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="dashboard-layout flex h-screen antialiased overflow-hidden">
      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        navigationItems={navigationItems}
        isCollapsed={isTabletCollapsed}
        isVisible={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Toggle Button (Tablet/Desktop) */}
      <button
        className="hidden md:flex lg:flex items-center justify-center absolute top-6 left-64 -translate-x-1/2 z-50 w-8 h-8 bg-[#18181B] border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsTabletCollapsed(prev => !prev)}
        aria-label={isTabletCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title="Toggle sidebar (Ctrl+B)"
        style={{
          left: isTabletCollapsed ? '4rem' : '16rem',
        }}
      >
        {isTabletCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#0A0A0A]"
        role="main"
      >
        {/* Top Header */}
        {showDefaultHeader && (
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-4 mb-2">
                {/* Mobile Menu Toggle */}
                <MobileNav
                  isOpen={isMobileMenuOpen}
                  onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
                  {getGreeting()}, {user.name}! ☀️
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 lg:ml-0 ml-10">
                {getFormattedDate()}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                <Search className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-gray-800 border-gray-700 text-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-[border-color,box-shadow] duration-200"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      alert(
                        "🔍 Global search coming soon! You'll be able to search across habits, journal entries, and wisdom quotes."
                      )
                    }
                  }}
                />
              </div>

              <button
                className="relative text-gray-400 hover:text-white p-2 transition-colors rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() =>
                  alert(
                    "🔔 Notifications coming soon! You'll get reminders for habits, journal prompts, and achievements."
                  )
                }
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-[#0A0A0A]"></span>
              </button>

              <ThemeToggle />
              <UserProfileDropdown user={user} />
            </div>
          </header>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  )
}
