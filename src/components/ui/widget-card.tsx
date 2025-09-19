import React from 'react'

interface WidgetCardProps {
  children: React.ReactNode
  className?: string
}

export function WidgetCard({ children, className = '' }: WidgetCardProps) {
  return (
    <div className={`bg-[#18181B] border border-white/10 rounded-xl transition-all duration-200 hover:border-white/20 ${className}`}>
      {children}
    </div>
  )
}