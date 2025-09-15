import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Shield, Users, Sparkles } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  type?: 'register' | 'login' | 'reset'
  showAside?: boolean
}

// Benefits data for the aside card
const authBenefits = {
  register: {
    title: "Join thousands building better habits",
    benefits: [
      { icon: CheckCircle2, text: "Track daily habits with ease" },
      { icon: Sparkles, text: "AI-powered insights & reflections" },
      { icon: Shield, text: "Your data stays private & secure" },
    ],
    testimonial: {
      text: "Mind Voyage transformed how I approach personal growth. The daily reflections help me stay mindful and intentional.",
      author: "Sarah Chen",
      role: "Product Designer"
    },
    stats: "Join 10,000+ users building better habits"
  },
  login: {
    title: "Welcome back to your journey",
    benefits: [
      { icon: CheckCircle2, text: "Continue your habit streak" },
      { icon: Sparkles, text: "New AI insights waiting" },
      { icon: Users, text: "Your community missed you" },
    ],
    testimonial: {
      text: "The consistency tracking keeps me motivated every day. It's become an essential part of my morning routine.",
      author: "Marcus Williams",
      role: "Software Engineer"
    },
    stats: "Welcome back to your habit journey"
  },
  reset: {
    title: "Secure account recovery",
    benefits: [
      { icon: Shield, text: "Bank-level security encryption" },
      { icon: CheckCircle2, text: "Quick & secure recovery process" },
      { icon: Sparkles, text: "Get back to building habits" },
    ],
    testimonial: {
      text: "The security measures give me peace of mind. I know my personal development data is safe.",
      author: "Alex Rivera", 
      role: "Life Coach"
    },
    stats: "Your account security is our priority"
  }
}

function AsideCard({ type }: { type: keyof typeof authBenefits }) {
  const content = authBenefits[type]
  
  return (
    <div className="hidden desktop:block w-full">
      <div className="bg-mv-surface border border-mv-border rounded-mv-lg p-s32 shadow-mv-card">
        {/* Benefits Section */}
        <div className="space-y-s24">
          <h3 className="text-h3 font-semibold text-mv-text leading-tight">
            {content.title}
          </h3>
          
          <div className="space-y-s16">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-s12">
                <div className="flex-shrink-0 w-6 h-6 text-mv-success">
                  <benefit.icon className="w-full h-full" />
                </div>
                <span className="text-body text-mv-text-subtle">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial Section */}
        <div className="mt-s40 pt-s32 border-t border-mv-border">
          <blockquote className="space-y-s16">
            <p className="text-body text-mv-text-subtle italic font-serif leading-relaxed">
              "{content.testimonial.text}"
            </p>
            <footer className="flex items-center gap-s12">
              <div className="w-10 h-10 bg-gradient-to-br from-mv-brand-primary to-mv-brand-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {content.testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="text-small font-semibold text-mv-text">
                  {content.testimonial.author}
                </div>
                <div className="text-small text-mv-text-subtle">
                  {content.testimonial.role}
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
        
        {/* Stats */}
        <div className="mt-s32 pt-s24 border-t border-mv-border">
          <div className="text-small text-mv-text-subtle font-medium">
            {content.stats}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthLayout({ children, type = 'register', showAside = true }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-mv-bg flex flex-col">
      {/* Header Navigation */}
      <header className="w-full border-b border-mv-border bg-mv-surface/95 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-mv-auth-desktop mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-mv-brand-primary to-mv-brand-primary-600 rounded-mv-lg flex items-center justify-center shadow-mv-card group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-2xl">🧠</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-mv-text to-mv-text-subtle bg-clip-text text-transparent tracking-tight">
              Mind Voyage Companion
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {type === 'register' ? (
              <Link
                href="/login"
                className="px-5 py-2 text-base font-semibold text-mv-text-subtle hover:text-mv-text transition-colors rounded-mv-sm hover:bg-mv-border/50"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/register"
                className="px-5 py-2 text-base font-semibold text-mv-text-subtle hover:text-mv-text transition-colors rounded-mv-sm hover:bg-mv-border/50"
              >
                Create Account
              </Link>
            )}
            <Link
              href="/help"
              className="px-5 py-2 text-base font-semibold text-mv-text-subtle hover:text-mv-text transition-colors rounded-mv-sm hover:bg-mv-border/50"
            >
              Help
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - 5/7 Desktop Split Layout */}
      <main className="flex-1 flex">
        <div className="w-full max-w-mv-auth-desktop mx-auto px-6 py-s40">
          <div className="desktop:grid desktop:grid-cols-12 desktop:gap-s48 items-start">
            {/* Form Column (5/12) */}
            <div className="desktop:col-span-5">
              {children}
            </div>
            
            {/* Aside Column (7/12) */}
            {showAside && (
              <div className="desktop:col-span-7 mt-s40 desktop:mt-0">
                <AsideCard type={type} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Security Notice */}
      <footer className="border-t border-mv-border bg-mv-surface/80 backdrop-blur-md">
        <div className="max-w-mv-auth-desktop mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-6 text-small text-mv-text-subtle tablet:flex-wrap tablet:gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-mv-success" />
              <span>Your data is encrypted and secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-mv-success" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-mv-success" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
