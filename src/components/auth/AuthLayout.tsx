import React from 'react'
import Link from 'next/link'
import type { Route } from 'next'

interface AuthLayoutProps {
  children: React.ReactNode
  type?: 'register' | 'login' | 'reset' | 'reset-confirm'
  sidebarContent?: React.ReactNode
}

interface HighlightContent {
  title: string
  quote: string
  author: string
  tips?: string[]
}

interface NavItem {
  text: string
  href: string
}

interface SidebarContent {
  title: string
  updates: string[]
  highlight: HighlightContent
  footer: {
    title: string
    buttons: string[]
  }
}

interface AuthContent {
  nav: {
    primary: NavItem
    secondary: NavItem
  }
  sidebar: SidebarContent
  footerText: string
}

// Content for different auth types
const authContent: Record<string, AuthContent> = {
  login: {
    nav: {
      primary: { text: 'Create Account', href: '/register' },
      secondary: { text: 'Help', href: '/help' },
    },
    sidebar: {
      title: 'Recent Updates',
      updates: [
        '🆕 New AI Writing Enhancement feature now available',
        '📊 Enhanced analytics with mood correlation insights',
        '🏛️ 50+ new wisdom quotes from Stoic philosophers',
      ],
      highlight: {
        title: '💬 Community Highlight',
        quote: "I've maintained my morning pages habit for 100 days thanks to Mind Voyage!",
        author: 'Maya, long-time user',
      },
      footer: {
        title: '📱 Download our mobile app for on-the-go tracking',
        buttons: ['📱 App Store', '🤖 Play Store'],
      },
    },
    footerText: '🔒 Secure login with 256-bit encryption • Privacy-first approach',
  },
  register: {
    nav: {
      primary: { text: 'Sign In', href: '/login' },
      secondary: { text: 'Help', href: '/help' },
    },
    sidebar: {
      title: 'Why Join Mind Voyage?',
      updates: [
        '✓ Track habits with beautiful visualizations',
        '✓ Guided journaling prompts and mood tracking',
        '✓ Daily wisdom and philosophical insights',
        '✓ Privacy-first approach - your data stays yours',
        '⭐ Pro: AI-powered writing enhancement and insights',
      ],
      highlight: {
        title: 'Testimonial',
        quote: 'Mind Voyage transformed my daily routine. The combination of habit tracking and reflection is powerful.',
        author: 'Sarah K., Product Manager',
      },
      footer: {
        title: '📈 Join 10,000+ mindful habit builders already using Mind Voyage',
        buttons: [],
      },
    },
    footerText: '🔒 Your data is encrypted and secure • No spam, ever • Cancel anytime',
  },
  reset: {
    nav: {
      primary: { text: 'Sign In', href: '/login' },
      secondary: { text: 'Create Account', href: '/register' },
    },
    sidebar: {
      title: 'Security Information',
      updates: [
        '✓ Password reset links expire in 1 hour for your safety.',
        '✓ We\'ll never store your password in plain text.',
        '✓ All communications are encrypted end-to-end.',
      ],
      highlight: {
        title: '💡 Tips for Strong Passwords:',
        quote: '',
        author: '',
        tips: [
          'Use 12+ characters',
          'Mix letters, numbers, & symbols',
          'Avoid personal information',
          'Use a password manager',
        ],
      },
      footer: {
        title: '📧 Having trouble? Our support team is here to help.',
        buttons: ['Get Help'],
      },
    },
    footerText: '🔒 We take your privacy seriously • No spam, ever • Secure infrastructure',
  },
  'reset-confirm': {
    nav: {
      primary: { text: 'Sign In', href: '/login' },
      secondary: { text: 'Create Account', href: '/register' },
    },
    sidebar: {
      title: 'What Happens Next?',
      updates: [
        '1️⃣ Check your email inbox (and spam folder).',
        '2️⃣ Click the "Reset Password" button in the email.',
        '3️⃣ Create your new password on the secure form.',
        '4️⃣ Sign in with your new password.',
      ],
      highlight: {
        title: '⏰ Didn\'t receive the email?',
        quote: '',
        author: '',
        tips: [
          'Check your spam/junk folder',
          'Wait 2-3 minutes for delivery',
          'Make sure the email address is correct',
          'Try resending the email',
        ],
      },
      footer: {
        title: '🆘 Still having trouble? Our support team can help.',
        buttons: ['Live Chat', 'Email Support'],
      },
    },
    footerText: '🔒 Secure password reset process • Email link expires in 1 hour',
  },
}

function DefaultSidebar({ type }: { type: keyof typeof authContent }) {
  const content = authContent[type]?.sidebar

  if (!content) return null

  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold text-gray-200 mb-4">{content.title}</h3>
        <ul className="space-y-3 text-gray-300">
          {content.updates.map((update: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-gray-400">{update}</span>
            </li>
          ))}
        </ul>
      </div>

      {content.highlight && (
        <div className="feature-card p-6 rounded-xl">
          <h4 className="font-semibold text-gray-200 mb-3">{content.highlight.title}</h4>
          {content.highlight.quote && (
            <>
              <blockquote className="text-gray-300 italic">&ldquo;{content.highlight.quote}&rdquo;</blockquote>
              <cite className="text-right block mt-3 text-sm font-semibold text-gray-200 not-italic">
                &mdash; {content.highlight.author}
              </cite>
            </>
          )}
          {content.highlight.tips && (
            <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
              {content.highlight.tips.map((tip: string, index: number) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="bg-gray-800/50 p-6 rounded-xl text-center">
        <p className="font-semibold text-gray-300 mb-4">{content.footer.title}</p>
        {content.footer.buttons.length > 0 && (
          <div className="flex justify-center gap-4 flex-wrap">
            {content.footer.buttons.map((button: string, index: number) => (
              <button 
                key={index}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function AuthLayout({
  children,
  type = 'register',
  sidebarContent,
}: AuthLayoutProps) {
  const content = authContent[type]

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 text-white antialiased">
      {/* Decorative Glow Effects */}
      <div 
        className="glow-effect -top-40 -left-60" 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, rgba(129, 140, 248, 0) 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <div 
        className="glow-effect bottom-0 -right-40" 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, rgba(129, 140, 248, 0) 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <header className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-200">Mind Voyage Companion</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href={(content?.nav.primary.href || '/') as Route}
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              {content?.nav.primary.text}
            </Link>
            <Link 
              href={(content?.nav.secondary.href || '/help') as Route}
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              {content?.nav.secondary.text}
            </Link>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-16 items-center py-12 md:py-16">
          {/* Form Column (3/5) */}
          <div className="lg:col-span-3">
            {children}
          </div>

          {/* Sidebar Column (2/5) */}
          {sidebarContent ? sidebarContent : <DefaultSidebar type={type} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-sm text-gray-500">
          {content?.footerText || '🔒 Your data is secure'}
        </p>
      </footer>
    </div>
  )
}
