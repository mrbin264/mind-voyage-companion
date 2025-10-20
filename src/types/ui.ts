/**
 * UI Component Type Definitions
 *
 * Type definitions for responsive dashboard components following the
 * Enhanced Responsive Dashboard specification (P1).
 *
 * @module types/ui
 */

/**
 * Responsive breakpoints for media queries
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'xl'

/**
 * Responsive column configuration for grid layouts
 */
export interface ResponsiveColumns {
  mobile: number
  tablet: number
  desktop: number
  xl: number
}

/**
 * Widget card component props with state management
 */
export interface WidgetCardProps {
  /** Widget title (optional) */
  title?: string
  /** Widget subtitle (optional) */
  subtitle?: string
  /** Icon component to display in header (optional) */
  icon?: React.ReactNode
  /** Main content of the widget */
  children?: React.ReactNode
  /** Loading state - shows SkeletonLoader */
  loading?: boolean
  /** Error state - shows ErrorBoundary */
  error?: Error | null
  /** Empty state - shows EmptyState when true and no children */
  empty?: boolean
  /** Empty state configuration */
  emptyConfig?: EmptyStateConfig
  /** Action buttons for header (optional) */
  actions?: React.ReactNode
  /** Full width variant (removes max-width constraint) */
  fullWidth?: boolean
  /** Remove padding (useful for charts/images) */
  noPadding?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
  /** Icon to display */
  icon?: React.ReactNode
  /** Main message */
  message: string
  /** Optional description */
  description?: string
  /** Call-to-action configuration */
  action?: ActionConfig
  /** Variant for sizing */
  variant?: 'default' | 'compact'
}

/**
 * Action button configuration for empty states
 */
export interface ActionConfig {
  /** Button label */
  label: string
  /** Click handler */
  onClick: () => void
  /** Button variant */
  variant?: 'primary' | 'secondary'
}

/**
 * Skeleton loader variants matching widget types
 */
export type SkeletonVariant =
  | 'dashboard-widget'
  | 'habit-card'
  | 'chart'
  | 'analytics'
  | 'list-item'
  | 'avatar'
  | 'text-line'

/**
 * Skeleton loader component props
 */
export interface SkeletonLoaderProps {
  /** Skeleton variant type */
  variant?: SkeletonVariant
  /** Number of skeleton items to render */
  count?: number
  /** Whether to animate the skeleton */
  animate?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Error boundary component props
 */
export interface ErrorBoundaryProps {
  /** Error object to display */
  error: Error
  /** Retry callback function */
  retry?: () => void
  /** Context string for error (e.g., "loading habits") */
  context?: string
  /** Child components (rendered when no error) */
  children?: React.ReactNode
}

/**
 * Dashboard layout component props
 */
export interface DashboardLayoutProps {
  /** User object for authentication context */
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  /** Page content */
  children: React.ReactNode
  /** Optional page title */
  title?: string
  /** Optional page description */
  description?: string
}

/**
 * Responsive grid component props
 */
export interface ResponsiveGridProps {
  /** Grid child elements */
  children: React.ReactNode
  /** Responsive column configuration */
  columns?: ResponsiveColumns
  /** Gap between grid items (Tailwind spacing scale) */
  gap?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Media query hook return type
 */
export interface UseMediaQueryReturn {
  /** True if viewport is mobile (<768px) */
  isMobile: boolean
  /** True if viewport is tablet (768px-1023px) */
  isTablet: boolean
  /** True if viewport is desktop (1024px+) */
  isDesktop: boolean
  /** True if viewport is xl (1280px+) */
  isXL: boolean
  /** Current breakpoint */
  breakpoint: Breakpoint
}
