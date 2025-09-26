'use client'

import React from 'react'
import { 
  User, 
  Bell, 
  Lock, 
  PenTool, 
  Database, 
  Shield, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react'
import type { SettingsSection } from '@/types/settings'

interface SettingsNavigationProps {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
  className?: string
}

const navigationItems = [
  { 
    id: 'profile' as const, 
    label: 'Profile', 
    icon: User,
    description: 'Personal information and account details'
  },
  { 
    id: 'notifications' as const, 
    label: 'Notifications', 
    icon: Bell,
    description: 'Email, push, and in-app notification preferences'
  },
  { 
    id: 'privacy' as const, 
    label: 'Privacy', 
    icon: Lock,
    description: 'Data sharing and visibility settings'
  },
  { 
    id: 'preferences' as const, 
    label: 'Preferences', 
    icon: PenTool,
    description: 'App behavior and personal customizations'
  },
  { 
    id: 'data' as const, 
    label: 'Data', 
    icon: Database,
    description: 'Export, backup, and data management'
  },
  { 
    id: 'security' as const, 
    label: 'Security', 
    icon: Shield,
    description: 'Password, 2FA, and login security'
  },
  { 
    id: 'subscription' as const, 
    label: 'Subscription', 
    icon: CreditCard,
    description: 'Billing, plans, and subscription management'
  },
  { 
    id: 'support' as const, 
    label: 'Support', 
    icon: HelpCircle,
    description: 'Help, contact, and troubleshooting'
  },
]

export function SettingsNavigation({ 
  activeSection, 
  onSectionChange, 
  className = '' 
}: SettingsNavigationProps) {
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border border-gray-700 ${className}`}>
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
              title={item.description}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

interface SettingsHeaderProps {
  section: SettingsSection
  onSave?: () => void
  isDirty?: boolean
  isSaving?: boolean
  className?: string
}

const sectionTitles: Record<SettingsSection, { title: string; subtitle: string }> = {
  profile: {
    title: 'Account & Profile',
    subtitle: 'Manage your personal information and account settings'
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Control how and when you receive notifications'
  },
  privacy: {
    title: 'Privacy & Data',
    subtitle: 'Manage your privacy settings and data sharing preferences'
  },
  preferences: {
    title: 'App Preferences',
    subtitle: 'Customize your app experience and default behaviors'
  },
  data: {
    title: 'Data Management',
    subtitle: 'Export, backup, and manage your personal data'
  },
  security: {
    title: 'Security Settings',
    subtitle: 'Protect your account with security features'
  },
  subscription: {
    title: 'Subscription & Billing',
    subtitle: 'Manage your plan, billing, and subscription features'
  },
  support: {
    title: 'Help & Support',
    subtitle: 'Get help, report issues, and contact support'
  },
  statistics: {
    title: 'Account Statistics',
    subtitle: 'View your account usage and activity statistics'
  }
}

export function SettingsHeader({ 
  section, 
  onSave, 
  isDirty = false, 
  isSaving = false,
  className = '' 
}: SettingsHeaderProps) {
  const { title, subtitle } = sectionTitles[section]
  
  return (
    <header className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
          ⚙️ {title}
        </h2>
        <p className="text-gray-400 mt-1">{subtitle}</p>
      </div>
      
      {onSave && (
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-sm text-yellow-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Unsaved changes
            </span>
          )}
          
          <button
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${
              isDirty && !isSaving
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </header>
  )
}

interface SettingsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function SettingsCard({ 
  title, 
  description, 
  children, 
  className = '',
  headerAction 
}: SettingsCardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
        {headerAction && (
          <div className="ml-4">
            {headerAction}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

interface SettingsFieldProps {
  label: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}

export function SettingsField({ 
  label, 
  description, 
  required = false, 
  error, 
  children, 
  className = '' 
}: SettingsFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}

interface SettingsToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function SettingsToggle({ 
  label, 
  description, 
  checked, 
  onChange, 
  disabled = false,
  className = '' 
}: SettingsToggleProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-300 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
          checked 
            ? 'bg-blue-600' 
            : 'bg-gray-600'
        } ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

interface SettingsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function SettingsInput({ error, className = '', ...props }: SettingsInputProps) {
  return (
    <input
      className={`w-full bg-gray-700 border text-gray-100 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error 
          ? 'border-red-500 focus:border-red-500' 
          : 'border-gray-600 focus:border-blue-500'
      } ${className}`}
      {...props}
    />
  )
}

interface SettingsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { value: string; label: string }[]
}

export function SettingsSelect({ 
  error, 
  options, 
  className = '', 
  ...props 
}: SettingsSelectProps) {
  return (
    <select
      className={`w-full bg-gray-700 border text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none cursor-pointer ${
        error 
          ? 'border-red-500 focus:border-red-500' 
          : 'border-gray-600 focus:border-blue-500'
      } ${className}`}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface SettingsTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function SettingsTextarea({ error, className = '', ...props }: SettingsTextareaProps) {
  return (
    <textarea
      className={`w-full bg-gray-700 border text-gray-100 rounded-lg px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
        error 
          ? 'border-red-500 focus:border-red-500' 
          : 'border-gray-600 focus:border-blue-500'
      } ${className}`}
      {...props}
    />
  )
}