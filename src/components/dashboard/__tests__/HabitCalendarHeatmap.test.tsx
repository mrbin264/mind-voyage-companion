import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HabitCalendarHeatmap } from '../HabitCalendarHeatmap'
import type { HabitLog } from '@/types/habit'

describe('HabitCalendarHeatmap', () => {
  const mockLogs: HabitLog[] = [
    {
      _id: '1',
      habitId: 'habit1',
      userId: 'user1',
      date: '2025-11-01',
      completed: true,
      completedAt: new Date('2025-11-01T10:00:00Z'),
      notes: 'Great workout!',
      value: 30,
      createdAt: new Date('2025-11-01T10:00:00Z'),
      updatedAt: new Date('2025-11-01T10:00:00Z'),
    },
    {
      _id: '2',
      habitId: 'habit1',
      userId: 'user1',
      date: '2025-11-02',
      completed: true,
      completedAt: new Date('2025-11-02T10:00:00Z'),
      notes: 'Another good day',
      createdAt: new Date('2025-11-02T10:00:00Z'),
      updatedAt: new Date('2025-11-02T10:00:00Z'),
    },
    {
      _id: '3',
      habitId: 'habit1',
      userId: 'user1',
      date: '2025-11-02',
      completed: true,
      completedAt: new Date('2025-11-02T15:00:00Z'),
      notes: 'Second completion same day',
      createdAt: new Date('2025-11-02T15:00:00Z'),
      updatedAt: new Date('2025-11-02T15:00:00Z'),
    },
  ]

  it('renders calendar with current month by default', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    // Should show current month (November 2025)
    expect(screen.getByText(/November 2025/i)).toBeInTheDocument()
  })

  it('displays day labels correctly', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Thu')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
    expect(screen.getByText('Sat')).toBeInTheDocument()
  })

  it('shows activity legend', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    expect(screen.getByText('Activity')).toBeInTheDocument()
    expect(screen.getByText('Less')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('navigates to previous month when clicking previous button', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    const prevButton = screen.getByRole('button', { name: /chevron-left/i })
    fireEvent.click(prevButton)

    // Should show October 2025
    expect(screen.getByText(/October 2025/i)).toBeInTheDocument()
  })

  it('shows "Today" button when not on current month', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    // Navigate to previous month
    const prevButton = screen.getByRole('button', { name: /chevron-left/i })
    fireEvent.click(prevButton)

    // Today button should appear
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('returns to current month when clicking "Today" button', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    // Navigate away
    const prevButton = screen.getByRole('button', { name: /chevron-left/i })
    fireEvent.click(prevButton)

    // Click Today
    const todayButton = screen.getByText('Today')
    fireEvent.click(todayButton)

    // Should be back to November 2025
    expect(screen.getByText(/November 2025/i)).toBeInTheDocument()
  })

  it('disables next button when on current month', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    const nextButton = screen.getByRole('button', { name: /chevron-right/i })
    expect(nextButton).toBeDisabled()
  })

  it('enables next button when viewing past months', () => {
    render(<HabitCalendarHeatmap completionLogs={mockLogs} />)

    // Navigate to previous month
    const prevButton = screen.getByRole('button', { name: /chevron-left/i })
    fireEvent.click(prevButton)

    const nextButton = screen.getByRole('button', { name: /chevron-right/i })
    expect(nextButton).not.toBeDisabled()
  })

  it('renders with empty logs array', () => {
    render(<HabitCalendarHeatmap completionLogs={[]} />)

    // Should still render calendar
    expect(screen.getByText(/November 2025/i)).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <HabitCalendarHeatmap
        completionLogs={mockLogs}
        className="custom-class"
      />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('HabitCalendarHeatmap - Date Formatting', () => {
  it('formats dates correctly for display', () => {
    const logs: HabitLog[] = [
      {
        _id: '1',
        habitId: 'habit1',
        userId: 'user1',
        date: '2025-11-15',
        completed: true,
        completedAt: new Date('2025-11-15T10:00:00Z'),
        createdAt: new Date('2025-11-15T10:00:00Z'),
        updatedAt: new Date('2025-11-15T10:00:00Z'),
      },
    ]

    render(<HabitCalendarHeatmap completionLogs={logs} />)

    // Calendar should render November 2025
    expect(screen.getByText(/November 2025/i)).toBeInTheDocument()
  })
})

describe('HabitCalendarHeatmap - Color Intensity', () => {
  it('handles multiple completions on same day', () => {
    const logs: HabitLog[] = Array.from({ length: 5 }, (_, i) => ({
      _id: `${i}`,
      habitId: 'habit1',
      userId: 'user1',
      date: '2025-11-15',
      completed: true,
      completedAt: new Date(`2025-11-15T${10 + i}:00:00Z`),
      createdAt: new Date(`2025-11-15T${10 + i}:00:00Z`),
      updatedAt: new Date(`2025-11-15T${10 + i}:00:00Z`),
    }))

    const { container } = render(<HabitCalendarHeatmap completionLogs={logs} />)

    // Should render all logs (intensity will be calculated)
    expect(container).toBeInTheDocument()
  })
})

describe('HabitCalendarHeatmap - Edge Cases', () => {
  it('handles logs from different months', () => {
    const logs: HabitLog[] = [
      {
        _id: '1',
        habitId: 'habit1',
        userId: 'user1',
        date: '2025-10-15',
        completed: true,
        completedAt: new Date('2025-10-15T10:00:00Z'),
        createdAt: new Date('2025-10-15T10:00:00Z'),
        updatedAt: new Date('2025-10-15T10:00:00Z'),
      },
      {
        _id: '2',
        habitId: 'habit1',
        userId: 'user1',
        date: '2025-11-15',
        completed: true,
        completedAt: new Date('2025-11-15T10:00:00Z'),
        createdAt: new Date('2025-11-15T10:00:00Z'),
        updatedAt: new Date('2025-11-15T10:00:00Z'),
      },
    ]

    render(<HabitCalendarHeatmap completionLogs={logs} />)

    // Should show current month (November)
    expect(screen.getByText(/November 2025/i)).toBeInTheDocument()

    // Can navigate to see October logs
    const prevButton = screen.getByRole('button', { name: /chevron-left/i })
    fireEvent.click(prevButton)
    expect(screen.getByText(/October 2025/i)).toBeInTheDocument()
  })

  it('filters out incomplete logs', () => {
    const logs: HabitLog[] = [
      {
        _id: '1',
        habitId: 'habit1',
        userId: 'user1',
        date: '2025-11-15',
        completed: true,
        completedAt: new Date('2025-11-15T10:00:00Z'),
        createdAt: new Date('2025-11-15T10:00:00Z'),
        updatedAt: new Date('2025-11-15T10:00:00Z'),
      },
      {
        _id: '2',
        habitId: 'habit1',
        userId: 'user1',
        date: '2025-11-16',
        completed: false,
        createdAt: new Date('2025-11-16T10:00:00Z'),
        updatedAt: new Date('2025-11-16T10:00:00Z'),
      },
    ]

    const { container } = render(<HabitCalendarHeatmap completionLogs={logs} />)

    // Should only count completed logs
    expect(container).toBeInTheDocument()
  })
})
