import * as React from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string[] | string
  success?: boolean
  helperText?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, success, helperText, className, id, ...props }, ref) => {
    const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`
    const hasError = error && (Array.isArray(error) ? error.length > 0 : error)
    const errorMessage = hasError
      ? Array.isArray(error)
        ? error[0]
        : error
      : ''

    return (
      <div className="space-y-2">
        {/* Label - optional for HTML design compatibility */}
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium text-gray-200"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <input
            id={fieldId}
            ref={ref}
            className={`form-input ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
            aria-invalid={hasError ? 'true' : 'false'}
            {...props}
          />
        </div>

        {/* Error Message */}
        {hasError && (
          <p className="text-red-400 text-sm mt-2">{errorMessage}</p>
        )}

        {/* Success Message or Helper Text */}
        {success && !hasError && (
          <p className="text-green-400 text-sm mt-2">✓ Looks good</p>
        )}

        {helperText && !hasError && !success && (
          <p className="text-gray-400 text-sm mt-2">{helperText}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
