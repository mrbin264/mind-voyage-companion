import React from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Mind Voyage Companion
          </h1>
          <p className="text-muted-foreground text-sm">
            Create your account to start your journey
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
