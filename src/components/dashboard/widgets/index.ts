/**
 * Dashboard Widget Components
 *
 * Enhanced responsive widgets with consistent WidgetCard wrapping,
 * loading/error/empty states, and mobile-optimized layouts.
 *
 * @module components/dashboard/widgets
 */

export { HabitOverviewWidget } from '../HabitOverviewWidget'
export type { HabitOverviewWidgetProps } from '../HabitOverviewWidget'

export { StreakCard } from '../StreakCard'
export type { StreakCardProps, HabitStreak } from '../StreakCard'

export { WeeklyProgressChart } from '../WeeklyProgressChart'
export type {
  WeeklyProgressChartProps,
  WeeklyProgressItem,
} from '../WeeklyProgressChart'

export { QuickStatsWidget } from '../QuickStatsWidget'
export type { QuickStatsWidgetProps, QuickStat } from '../QuickStatsWidget'
