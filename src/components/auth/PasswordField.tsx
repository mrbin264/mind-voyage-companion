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
>(({ label, requirements, error, ...props }, ref) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        ref={ref}
        type="password"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary disabled:opacity-50"
        {...props}
      />
    </label>
    {requirements && (
      <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
        {requirements.minLength && (
          <li>• At least {requirements.minLength} characters</li>
        )}
        {requirements.requireNumbers && <li>• At least one number</li>}
        {requirements.requireSpecialChars && (
          <li>• At least one special character</li>
        )}
      </ul>
    )}
    {error && (
      <p className="text-xs text-red-600 mt-1">
        {Array.isArray(error) ? error[0] : error}
      </p>
    )}
  </div>
))
PasswordField.displayName = 'PasswordField'
