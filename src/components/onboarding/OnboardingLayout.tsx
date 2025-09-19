'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep?: number
  totalSteps?: number
}

const steps = [
  { number: 1, path: '/onboarding/step1', title: 'Welcome' },
  { number: 2, path: '/onboarding/step2', title: 'Profile' },
  { number: 3, path: '/onboarding/step3', title: 'Habits' },
  { number: 4, path: '/onboarding/step4', title: 'Complete' }
]

export function OnboardingLayout({ 
  children, 
  currentStep = 1, 
  totalSteps = 4 
}: OnboardingLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-white antialiased">
      {/* Decorative Glow Effects - using simple background gradients */}
      <div className="absolute w-[500px] h-[500px] -top-40 -left-60 z-0 pointer-events-none opacity-30">
        <div className="w-full h-full bg-blue-500 blur-3xl rounded-full"></div>
      </div>
      <div className="absolute w-[500px] h-[500px] bottom-0 -right-40 z-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-blue-400 blur-3xl rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 flex flex-col flex-grow">
        {/* Header Section */}
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-200">Mind Voyage Companion</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/dashboard" 
              className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
            >
              Skip Tour
            </Link>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <span className={`
                  ml-2 text-sm font-medium hidden sm:block
                  ${currentStep >= step.number ? 'text-gray-200' : 'text-gray-500'}
                `}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 ml-4 transition-all
                    ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-500 text-sm">
          <p>Step {currentStep} of {totalSteps} • Mind Voyage Companion</p>
        </footer>
      </div>
    </div>
  )
}