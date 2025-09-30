'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  TrendingUp,
  Edit3,
  BarChart2,
  Shield,
  Settings,
  Star,
  Search,
  Bell,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserProfileDropdown } from './UserProfileDropdown'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white antialiased">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#101010] text-gray-300 p-6 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen
            ? 'fixed inset-y-0 left-0 translate-x-0'
            : 'fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0 lg:relative'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-200">Mind Voyage</h1>
          </div>
          {/* Mobile Close Button */}
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {navigationItems.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-white font-semibold'
                    : 'hover:bg-gray-700/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Upgrade Pro Button */}
        <div className="mt-auto">
          <Button
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            onClick={() =>
              alert(
                '🌟 Pro features coming soon! Stay tuned for advanced analytics, AI insights, and premium habit templates.'
              )
            }
          >
            <Star className="w-5 h-5" />
            Upgrade Pro
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        {/* Top Header */}
        {showDefaultHeader && (
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-4 mb-2">
                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden text-gray-400 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-gray-100">
                  {getGreeting()}, {user.name}! ☀️
                </h2>
              </div>
              <p className="text-gray-400 lg:ml-0 ml-10">
                {getFormattedDate()}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-grow">
                <Search className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="search"
                  placeholder="Search habits, journal entries, wisdom..."
                  className="w-full bg-gray-800 border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-500"
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
                className="relative text-gray-400 hover:text-white p-2"
                onClick={() =>
                  alert(
                    "🔔 Notifications coming soon! You'll get reminders for habits, journal prompts, and achievements."
                  )
                }
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"></span>
              </button>
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
