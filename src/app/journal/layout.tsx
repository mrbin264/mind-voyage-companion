import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal - Mind Voyage Companion',
  description:
    'Write and manage your personal journal entries with mood tracking and reflection prompts.',
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
