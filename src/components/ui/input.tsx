import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-ring/50',
        error: 'border-error-500 focus-visible:ring-error-500',
        success: 'border-success-500 focus-visible:ring-success-500',
        warning: 'border-warning-500 focus-visible:ring-warning-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type,
      label,
      description,
      error,
      success,
      warning,
      icon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    // Determine the actual variant based on validation states
    const actualVariant = error
      ? 'error'
      : success
        ? 'success'
        : warning
          ? 'warning'
          : variant

    const inputType = type === 'password' && showPassword ? 'text' : type

    const InputElement = (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            inputVariants({ variant: actualVariant, size, className }),
            icon && 'pl-10',
            (rightIcon || type === 'password') && 'pr-10'
          )}
          ref={ref}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}

        {rightIcon && type !== 'password' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )

    if (!label && !description && !error && !success && !warning) {
      return InputElement
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        {InputElement}

        {description && !error && !success && !warning && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {error && (
          <div className="flex items-center gap-1 text-xs text-error-600">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-1 text-xs text-success-600">
            <CheckCircle2 className="h-3 w-3" />
            {success}
          </div>
        )}

        {warning && (
          <div className="flex items-center gap-1 text-xs text-warning-600">
            <AlertCircle className="h-3 w-3" />
            {warning}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
