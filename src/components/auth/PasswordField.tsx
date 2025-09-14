import * as React from 'react'

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  requirements?: {
    minLength?: number
    requireNumbers?: boolean
    requireSpecialChars?: boolean
  }
  error?: string[] | string
}

export const PasswordField = React.forwardRef<
  HTMLInputElement,
  PasswordFieldProps
>(({ label, requirements, error, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-4 py-4 pr-12 bg-white/90 border-2 border-slate-200 rounded-xl 
            text-slate-900 placeholder:text-slate-400 
            focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none 
            hover:border-slate-300 
            transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className || ''}`}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>

      {requirements && (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <p className="text-xs font-medium text-slate-600 mb-2">
            Password requirements:
          </p>
          <ul className="text-xs text-slate-500 space-y-1">
            {requirements.minLength && (
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span>At least {requirements.minLength} characters</span>
              </li>
            )}
            {requirements.requireNumbers && (
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span>At least one number</span>
              </li>
            )}
            {requirements.requireSpecialChars && (
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span>At least one special character</span>
              </li>
            )}
          </ul>
        </div>
      )}

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
})
PasswordField.displayName = 'PasswordField'
PasswordField.displayName = 'PasswordField'
