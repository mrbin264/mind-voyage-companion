import * as React from 'react'
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Skeleton Loader for content placeholders
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-muted/50', className)}
      {...props}
    />
  )
}

// Spinner Component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  )
}

// Loading Button State (already implemented in Button component)

// Content Loading States
interface LoadingStateProps {
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingState({
  children,
  className,
  size = 'md',
  text = 'Loading...',
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-8',
        className
      )}
    >
      <Spinner size={size} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      {children}
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground/50">{icon}</div>}

      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
      )}

      {action && <div>{action}</div>}
    </div>
  )
}

// Error State Component
interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className
      )}
    >
      <div className="mb-4 text-error-500">
        <AlertCircle className="h-12 w-12" />
      </div>

      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>

      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  )
}

// Alert/Toast Component
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success:
          'border-success-200 bg-success-50 text-success-800 [&>svg]:text-success-600',
        warning:
          'border-warning-200 bg-warning-50 text-warning-800 [&>svg]:text-warning-600',
        error:
          'border-error-200 bg-error-50 text-error-800 [&>svg]:text-error-600',
        info: 'border-info-200 bg-info-50 text-info-800 [&>svg]:text-info-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

// Progress Indicator
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function Progress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-muted',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full transition-all duration-300',
          variantClasses[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Status Indicator
interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StatusIndicator({
  status,
  size = 'md',
  className,
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-muted-foreground',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn('rounded-full', sizeClasses[size], statusClasses[status])}
      />
      {status === 'online' && (
        <div
          className={cn(
            'absolute inset-0 rounded-full animate-ping',
            sizeClasses[size],
            'bg-success-400'
          )}
        />
      )}
    </div>
  )
}

export { Alert, AlertDescription, AlertTitle, alertVariants }
