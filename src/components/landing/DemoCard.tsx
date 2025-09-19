interface DemoCardProps {
  emoji: string
  title: string
  children: React.ReactNode
}

export function DemoCard({ emoji, title, children }: DemoCardProps) {
  return (
    <div className="card hover-lift">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" role="img" aria-label={title}>
          {emoji}
        </span>
        <h3 className="font-semibold text-[var(--mv-color-text)]">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function HabitDashboardDemo() {
  return (
    <DemoCard emoji="📊" title="Habit Dashboard">
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--mv-color-bg)] rounded-lg border border-[var(--mv-color-border)]">
          <span className="text-[var(--mv-color-success)]">✓</span>
          <span className="text-sm font-medium">7d</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--mv-color-bg)] rounded-lg border border-[var(--mv-color-border)]">
          <span className="text-[var(--mv-color-text-subtle)]">○</span>
          <span className="text-sm font-medium">3/8</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--mv-color-bg)] rounded-lg border border-[var(--mv-color-border)]">
          <span>📚</span>
          <span className="text-sm font-medium">20</span>
        </div>
      </div>
    </DemoCard>
  )
}

export function JournalEntryDemo() {
  return (
    <DemoCard emoji="📔" title="Journal Entry">
      <div className="space-y-3">
        <p className="text-sm text-[var(--mv-color-text-subtle)] leading-relaxed">
          &ldquo;Today I practiced mindful breathing for 10 minutes. I noticed
          my mind wandering less than yesterday...&rdquo;
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl">😊</span>
          <span className="text-sm font-medium">Mood: Content</span>
        </div>
      </div>
    </DemoCard>
  )
}

export function DailyWisdomDemo() {
  return (
    <DemoCard emoji="🏛️" title="Daily Wisdom">
      <blockquote className="text-sm text-[var(--mv-color-text-subtle)] leading-relaxed italic">
        &ldquo;You have power over your mind - not outside events. Realize this,
        and you will find strength.&rdquo;
        <footer className="mt-2 text-xs font-medium text-[var(--mv-color-text)]">
          — Marcus Aurelius
        </footer>
      </blockquote>
    </DemoCard>
  )
}
