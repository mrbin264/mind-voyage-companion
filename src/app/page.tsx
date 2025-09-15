import { HeroSection } from '@/components/landing/HeroSection'
import {
  HabitDashboardDemo,
  JournalEntryDemo,
  DailyWisdomDemo,
} from '@/components/landing/DemoCard'
import { Testimonials } from '@/components/landing/Testimonials'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Hero Content */}
            <HeroSection />

            {/* Right Column - Demo Cards */}
            <div className="lg:col-span-7 space-y-6">
              <HabitDashboardDemo />
              <JournalEntryDemo />
              <DailyWisdomDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />
    </main>
  )
}
