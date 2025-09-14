import * as React from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string[] | string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <input
          ref={ref}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:opacity-50"
          {...props}
        />
      </label>
      {error && (
        <p className="text-xs text-red-600 mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  )
)
FormField.displayName = 'FormField'
