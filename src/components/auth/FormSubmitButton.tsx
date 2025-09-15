import * as React from 'react'
import { Loader2 } from 'lucide-react'

interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
}

export function FormSubmitButton({
  pending = false,
  variant = 'primary',
  size = 'lg',
  icon,
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-mv-button
    font-semibold transition-all duration-200 ease-out
    focus:outline-none focus:ring-4 focus:ring-mv-cta/25
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-mv-button w-full
  `
  
  const sizeClasses = {
    md: 'h-mv-button-md px-mv-button-x text-body',
    lg: 'h-mv-button-lg px-mv-button-x text-body'
  }
  
  const variantClasses = {
    primary: `
      bg-mv-cta text-mv-cta-text
      hover:opacity-95 hover:shadow-md hover:-translate-y-0.5
      active:translate-y-0 active:shadow-sm
    `,
    secondary: `
      bg-transparent text-mv-text border border-mv-border
      hover:bg-mv-border/50 hover:border-mv-text-subtle/40
      active:bg-mv-border/70
    `,
    tertiary: `
      bg-transparent text-mv-cta
      hover:bg-mv-cta/10 hover:text-mv-brand-primary-600
      active:bg-mv-cta/15
    `
  }
  
  return (
    <button
      type="submit"
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className || ''}
      `}
      disabled={pending || props.disabled}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
