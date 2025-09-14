import * as React from 'react'

interface FormSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pending?: boolean
}

export function FormSubmitButton({
  pending,
  children,
  ...props
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full flex justify-center items-center rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      disabled={pending || props.disabled}
      {...props}
    >
      {pending ? (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      ) : null}
      {children}
    </button>
  )
}
