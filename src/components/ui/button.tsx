import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary brand button - main actions
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-95',

        // Destructive actions - delete, remove, etc.
        destructive:
          'bg-error-500 text-white shadow-sm hover:bg-error-600 hover:shadow-md active:scale-95',

        // Secondary actions - less prominent
        secondary:
          'bg-secondary/10 text-secondary-600 border border-secondary-200 hover:bg-secondary/20 hover:border-secondary-300 active:scale-95',

        // Subtle outline button
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95',

        // Ghost button - minimal styling
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-95',

        // Link-style button
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',

        // Success variant for completed actions
        success:
          'bg-success-500 text-white shadow-sm hover:bg-success-600 hover:shadow-md active:scale-95',

        // Warning variant for caution actions
        warning:
          'bg-warning-500 text-white shadow-sm hover:bg-warning-600 hover:shadow-md active:scale-95',
      },
      size: {
        xs: 'h-7 rounded-md px-2 text-xs',
        sm: 'h-8 rounded-md px-3 text-sm',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-lg px-6 text-base',
        xl: 'h-12 rounded-lg px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? loadingText || children : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
