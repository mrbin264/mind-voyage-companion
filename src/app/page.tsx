import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white antialiased overflow-x-hidden">
      {/* Decorative Glow */}
      <div
        className="glow-effect -top-40 -left-60"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0) 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <div
        className="glow-effect top-1/2 right-0 transform -translate-y-1/2"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0) 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <h1 className="text-xl font-bold text-gray-200">
              Mind Voyage Companion
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16 md:py-24">
          {/* Left Column: Marketing Copy */}
          <div className="flex flex-col gap-8">
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-100">
              Build Better Habits Through{' '}
              <span className="gradient-text">Mindful Reflection</span>
            </h2>
            <p className="text-lg text-gray-400">
              A privacy-first platform combining habit tracking with
              philosophical reflection for meaningful personal growth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-100 mb-2">
                  Core Features:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    ✓{' '}
                    <span className="text-gray-400">
                      Daily habit tracking with streaks
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    ✓{' '}
                    <span className="text-gray-400">
                      Guided journaling with mood tracking
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    ✓{' '}
                    <span className="text-gray-400">
                      Daily Stoic quotes and prompts
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    ✓{' '}
                    <span className="text-gray-400">
                      Beautiful data visualizations
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 mb-2">
                  Pro Features:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    ⭐{' '}
                    <span className="text-gray-400">
                      AI-powered writing enhancement
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    ⭐{' '}
                    <span className="text-gray-400">
                      Weekly insights and recommendations
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    ⭐{' '}
                    <span className="text-gray-400">
                      Advanced habit analytics
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Free{' '}
                <span className="font-normal text-blue-200">
                  (No CC Req&rsquo;d)
                </span>
              </Link>
              <button className="w-full sm:w-auto border border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-6 rounded-lg transition-colors">
                See How It Works
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Used by 10,000+ mindful habit builders
            </p>
          </div>

          {/* Right Column: Interactive Feature Demo */}
          <div className="flex flex-col gap-6">
            <h3 className="text-center text-lg font-semibold text-gray-300 mb-2">
              Interactive Feature Demo
            </h3>

            {/* Habit Dashboard Card */}
            <div className="feature-card p-6 rounded-xl transform transition-transform duration-300 hover:scale-105 hover:rotate-1">
              <h4 className="font-bold text-gray-100 mb-4">
                📊 Habit Dashboard
              </h4>
              <div className="flex justify-around items-center bg-gray-900/50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-3xl">✓7d</p>
                  <p className="text-xs text-gray-400">Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl">○3/8</p>
                  <p className="text-xs text-gray-400">Water</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl">📚20</p>
                  <p className="text-xs text-gray-400">Reading</p>
                </div>
              </div>
            </div>

            {/* Journal Entry Card */}
            <div className="feature-card p-6 rounded-xl transform transition-transform duration-300 hover:scale-105 hover:-rotate-1">
              <h4 className="font-bold text-gray-100 mb-4">📔 Journal Entry</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                <p className="text-gray-300 italic">
                  &ldquo;Today was challenging, but I practiced patience
                  when...&rdquo;
                </p>
                <div className="text-sm bg-green-500/10 text-green-300 px-3 py-1 rounded-full inline-block">
                  😊 Mood: Content
                </div>
              </div>
            </div>

            {/* Daily Wisdom Card */}
            <div className="feature-card p-6 rounded-xl transform transition-transform duration-300 hover:scale-105 hover:rotate-1">
              <h4 className="font-bold text-gray-100 mb-4">🏛️ Daily Wisdom</h4>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <blockquote className="text-gray-300 italic">
                  &ldquo;The best time to plant a tree was 20 years ago. The
                  second best time is now.&rdquo;
                </blockquote>
                <cite className="text-right block mt-2 text-sm text-gray-500 not-italic">
                  — Chinese Proverb
                </cite>
              </div>
            </div>
          </div>
        </main>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-12">
            Social Proof & Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="feature-card p-8 rounded-xl">
              <p className="text-gray-300 italic mb-6">
                &ldquo;Mind Voyage helped me build a consistent journaling
                practice that transformed my self-awareness and emotional
                resilience.&rdquo;
              </p>
              <p className="font-semibold text-gray-200">
                — Sarah K., Product Manager
              </p>
            </div>
            <div className="feature-card p-8 rounded-xl">
              <p className="text-gray-300 italic mb-6">
                &ldquo;The combination of habit tracking and philosophical
                reflection is brilliant. It&rsquo;s not just about checking
                boxes&mdash;it&rsquo;s about personal growth.&rdquo;
              </p>
              <p className="font-semibold text-gray-200">
                — Alex M., Software Engineer
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
