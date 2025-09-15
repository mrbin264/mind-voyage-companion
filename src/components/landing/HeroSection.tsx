import { FeatureItem } from './FeatureItem'
import Link from 'next/link'

export function HeroSection() {
  const coreFeatures = [
    'Track daily habits with intuitive progress visualization',
    'Reflect through guided journaling with Stoic prompts',
    'Build consistency with gentle reminders and streaks',
    'Maintain privacy with local-first data storage',
  ]

  const proFeatures = [
    'AI-powered insights from your journal entries',
    'Advanced analytics and habit correlation tracking',
    'Export your data and integrate with other tools',
  ]

  return (
    <div className="lg:col-span-5 space-y-8">
      {/* Heading */}
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--mv-color-text)] leading-tight">
          Build Better Habits Through Mindful Reflection
        </h1>
        <p className="text-lg text-[var(--mv-color-text-subtle)] leading-relaxed">
          A privacy-first companion that helps you develop consistent routines,
          engage in meaningful self-reflection, and grow through daily wisdom.
        </p>
      </div>

      {/* Core Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--mv-color-text)]">
          Core Features
        </h2>
        <div className="space-y-3">
          {coreFeatures.map((feature, index) => (
            <FeatureItem key={index} type="core" text={feature} />
          ))}
        </div>
      </div>

      {/* Pro Features */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--mv-color-text)]">
          Pro Features
        </h2>
        <div className="space-y-3">
          {proFeatures.map((feature, index) => (
            <FeatureItem key={index} type="pro" text={feature} />
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register" className="btn btn-primary">
          Start Free
        </Link>
        <Link href="/register" className="btn btn-secondary">
          Start Your Journey
        </Link>
      </div>

      {/* Social Proof */}
      <p className="text-sm muted">Used by 10,000+ mindful habit builders</p>
    </div>
  )
}
