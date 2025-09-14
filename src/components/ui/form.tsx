import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Enhanced Label Component
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
)
Label.displayName = 'Label'

// Form Field Container
interface FormFieldProps {
  children: React.ReactNode
  className?: string
  error?: string
  success?: string
  warning?: string
  required?: boolean
  label?: string
  description?: string
  id?: string
}

export function FormField({
  children,
  className,
  error,
  success,
  warning,
  required,
  label,
  description,
  id
}: FormFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId
  
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={fieldId} className="flex items-center gap-1">
          {label}
          {required && <span className="text-error-500">*</span>}
        </Label>
      )}
      
      <div id={fieldId}>
        {children}
      </div>
      
      {description && !error && !success && !warning && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-error-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
      
      {success && (
        <p className="text-xs text-success-600 flex items-center gap-1">
          <span>✓</span> {success}
        </p>
      )}
      
      {warning && (
        <p className="text-xs text-warning-600 flex items-center gap-1">
          <span>⚡</span> {warning}
        </p>
      )}
    </div>
  )
}

// Textarea Component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    success, 
    warning, 
    ...props 
  }, ref) => {
    const variant = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default'
    
    const TextareaElement = (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          variant === 'error' && 'border-error-500 focus-visible:ring-error-500',
          variant === 'success' && 'border-success-500 focus-visible:ring-success-500',
          variant === 'warning' && 'border-warning-500 focus-visible:ring-warning-500',
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (!label && !description && !error && !success && !warning) {
      return TextareaElement
    }

    return (
      <FormField
        label={label}
        description={description}
        error={error}
        success={success}
        warning={warning}
        required={props.required}
      >
        {TextareaElement}
      </FormField>
    )
  }
)
Textarea.displayName = 'Textarea'

// Select Component
interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
  placeholder?: string
  onChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    options,
    label, 
    description, 
    error, 
    success, 
    warning,
    placeholder,
    onChange,
    ...props 
  }, ref) => {
    const variant = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default'
    
    const SelectElement = (
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          variant === 'error' && 'border-error-500 focus:ring-error-500',
          variant === 'success' && 'border-success-500 focus:ring-success-500',
          variant === 'warning' && 'border-warning-500 focus:ring-warning-500',
          className
        )}
        ref={ref}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    )

    if (!label && !description && !error && !success && !warning) {
      return SelectElement
    }

    return (
      <FormField
        label={label}
        description={description}
        error={error}
        success={success}
        warning={warning}
        required={props.required}
      >
        {SelectElement}
      </FormField>
    )
  }
)
Select.displayName = 'Select'

// Form Actions (for form buttons)
interface FormActionsProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

export function FormActions({ 
  children, 
  className, 
  align = 'left' 
}: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={cn(
      'flex items-center gap-2 pt-4',
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

// Checkbox Component (simple version)
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
}

export function Checkbox({
  label,
  description,
  error,
  className,
  ...props
}: CheckboxProps) {
  const checkboxElement = (
    <input
      type="checkbox"
      className={cn(
        'h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors',
        error && 'border-error-500',
        className
      )}
      {...props}
    />
  )

  if (!label && !description && !error) {
    return checkboxElement
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        {checkboxElement}
        {label && (
          <label className="text-sm font-medium leading-none">
            {label}
          </label>
        )}
      </div>
      
      {description && !error && (
        <p className="text-xs text-muted-foreground ml-6">{description}</p>
      )}
      
      {error && (
        <p className="text-xs text-error-600 ml-6 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export { Label, Textarea, Select }