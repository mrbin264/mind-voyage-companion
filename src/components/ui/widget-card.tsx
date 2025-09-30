import React from 'react'

interface WidgetCardProps {
  children: React.ReactNode
  className?: string
}

export function WidgetCard({ children, className = '' }: WidgetCardProps) {
  return (
    <div
      className={`widget-card rounded-xl transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  )
}
