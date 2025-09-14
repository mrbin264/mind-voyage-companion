import * as React from 'react'

interface FormSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean
}

export function FormSubmitButton({
  pending,
  children,
  className,
  ...props
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full relative flex justify-center items-center 
        bg-gradient-to-r from-primary-600 to-primary-700 
        hover:from-primary-700 hover:to-primary-800 
        focus:from-primary-700 focus:to-primary-800
        text-white font-semibold text-base
        px-6 py-4 rounded-xl
        focus:outline-none focus:ring-4 focus:ring-primary-500/30
        disabled:opacity-50 disabled:cursor-not-allowed
        transform transition-all duration-200 
        hover:shadow-lg hover:shadow-primary-500/25
        active:scale-[0.98]
        ${className || ''}`}
      disabled={pending || props.disabled}
      {...props}
    >
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-700 rounded-xl">
          <div className="flex items-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </div>
        </div>
      )}
      <span className={pending ? 'invisible' : ''}>{children}</span>
    </button>
  )
}
