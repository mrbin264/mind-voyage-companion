import * as React from 'react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string[] | string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        ref={ref}
        className={`w-full px-4 py-4 bg-white/90 border-2 border-slate-200 rounded-xl 
          text-slate-900 placeholder:text-slate-400 
          focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none 
          hover:border-slate-300 
          transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className || ''}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 font-medium flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{Array.isArray(error) ? error[0] : error}</span>
        </p>
      )}
    </div>
  )
)
FormField.displayName = 'FormField'
