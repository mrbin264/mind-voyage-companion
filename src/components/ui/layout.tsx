import * as React from 'react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Layout({
  children,
  className,
  sidebar,
  header,
  footer,
}: LayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">{header}</div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-auto">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="container py-6">{children}</div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t bg-background">
          <div className="container py-6">{footer}</div>
        </footer>
      )}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumb?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('pb-8', className)}>
      {breadcrumb && (
        <nav className="mb-4 text-sm text-muted-foreground">{breadcrumb}</nav>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  )
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn('space-y-6', className)}>{children}</div>
}

interface SectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function Section({
  title,
  description,
  children,
  className,
  action,
}: SectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </section>
  )
}

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Grid({ children, cols = 1, gap = 'md', className }: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  }

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return (
    <div className={cn('grid', colsClass[cols], gapClass[gap], className)}>
      {children}
    </div>
  )
}

interface StackProps {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  className?: string
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
}: StackProps) {
  const directionClass = direction === 'vertical' ? 'flex-col' : 'flex-row'

  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClass,
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        className
      )}
    >
      {children}
    </div>
  )
}
