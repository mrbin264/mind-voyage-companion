import * as React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string[] | string
  success?: boolean
  helperText?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, success, helperText, className, id, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    const hasError = error && (Array.isArray(error) ? error.length > 0 : error)
    const errorMessage = hasError
      ? Array.isArray(error)
        ? error[0]
        : error
      : ''

    return (
      <div className="space-y-2">
        {/* Label */}
        <label
          htmlFor={fieldId}
          className="block text-small font-semibold text-mv-text"
        >
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          <input
            id={fieldId}
            ref={ref}
            className={`
              w-full h-mv-input px-mv-input-x
              bg-mv-form-input-bg border border-mv-form-input-border rounded-mv-input
              text-mv-form-input-text placeholder:text-mv-form-input-placeholder
              transition-all duration-200 ease-out
              focus:outline-none focus:border-mv-cta focus:shadow-focus-ring
              hover:border-mv-text-subtle/40
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError ? 'border-mv-danger focus:border-mv-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}
              ${success ? 'border-mv-success focus:border-mv-success focus:shadow-[0_0_0_4px_rgba(34,197,94,0.15)]' : ''}
              ${className || ''}
            `}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError
                ? `${fieldId}-error`
                : helperText
                  ? `${fieldId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Success/Error Icons */}
          {(hasError || success) && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              {hasError ? (
                <AlertCircle className="w-5 h-5 text-mv-danger" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5 text-mv-success" />
              ) : null}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(hasError || helperText) && (
          <div className="flex items-start gap-2">
            {hasError ? (
              <p
                id={`${fieldId}-error`}
                className="text-small text-mv-danger font-medium"
                role="alert"
                aria-live="polite"
              >
                {errorMessage}
              </p>
            ) : helperText ? (
              <p
                id={`${fieldId}-helper`}
                className="text-small text-mv-text-subtle"
              >
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
