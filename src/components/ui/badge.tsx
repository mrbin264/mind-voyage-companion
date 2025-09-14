import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-error-500 text-white shadow-sm hover:bg-error-600',
        success:
          'border-transparent bg-success-500 text-white shadow-sm hover:bg-success-600',
        warning:
          'border-transparent bg-warning-500 text-white shadow-sm hover:bg-warning-600',
        info: 'border-transparent bg-info-500 text-white shadow-sm hover:bg-info-600',
        outline: 'text-foreground border-border',
        // Mood-specific badges
        'mood-1': 'border-transparent bg-mood-1 text-white',
        'mood-2': 'border-transparent bg-mood-2 text-white',
        'mood-3': 'border-transparent bg-mood-3 text-white',
        'mood-4': 'border-transparent bg-mood-4 text-white',
        'mood-5': 'border-transparent bg-mood-5 text-white',
      },
      size: {
        sm: 'px-2 py-0 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
