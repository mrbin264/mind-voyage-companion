import React from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  type?: 'register' | 'login' | 'reset'
}

export function AuthLayout({ children, type = 'register' }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/60 to-slate-100/80 flex flex-col">
      {/* Header Navigation */}
      <header className="w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-primary-500/30 transition-all duration-200">
              <span className="text-white font-bold text-2xl">🧠</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              Mind Voyage Companion
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {type === 'register' ? (
              <Link
                href="/login"
                className="px-5 py-2 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/register"
                className="px-5 py-2 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
              >
                Create Account
              </Link>
            )}
            <Link
              href="/help"
              className="px-5 py-2 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
            >
              Help
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Forms handle their own layout */}
      {children}

      {/* Footer Security Notice */}
      <footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Your data is encrypted and secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
