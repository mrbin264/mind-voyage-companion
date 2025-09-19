'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  className = '',
  showIcon = true,
  children = 'Logout',
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        // Clear any client-side auth state if needed
        // localStorage.removeItem('user') // if you store user data locally

        // Redirect to login page
        router.replace('/login')
        router.refresh()
      } else {
        console.error('Logout failed:', data.message)
        // Still redirect to login even if API call fails
        router.replace('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect to login even if there's an error
      router.replace('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        showIcon && <LogOut className="h-4 w-4 mr-2" />
      )}
      {isLoading ? 'Logging out...' : children}
    </Button>
  )
}
