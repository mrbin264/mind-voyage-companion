import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Badge } from './badge'

interface NavigationItem {
  title: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavigationItem[]
  external?: boolean
}

interface MainNavigationProps {
  items: NavigationItem[]
  className?: string
}

export function MainNavigation({ items, className }: MainNavigationProps) {
  return (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {items.map(item => (
        <NavigationLink key={item.href} item={item} />
      ))}
    </nav>
  )
}

interface SidebarNavigationProps {
  items: NavigationItem[]
  className?: string
  title?: string
}

export function SidebarNavigation({
  items,
  className,
  title,
}: SidebarNavigationProps) {
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set())

  const toggleSection = (href: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(href)) {
      newOpenSections.delete(href)
    } else {
      newOpenSections.add(href)
    }
    setOpenSections(newOpenSections)
  }

  return (
    <nav className={cn('space-y-2', className)}>
      {title && (
        <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">
          {title}
        </h2>
      )}

      {items.map(item => (
        <SidebarNavigationItem
          key={item.href}
          item={item}
          isOpen={openSections.has(item.href)}
          onToggle={() => toggleSection(item.href)}
        />
      ))}
    </nav>
  )
}

interface MobileNavigationProps {
  items: NavigationItem[]
  className?: string
}

export function MobileNavigation({ items, className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn('lg:hidden', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <SidebarNavigation items={items} className="space-y-1" />
          </div>
        </>
      )}
    </div>
  )
}

function NavigationLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href as any}
      className={cn(
        'text-sm font-medium transition-colors hover:text-foreground/80',
        isActive ? 'text-foreground' : 'text-foreground/60'
      )}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      <span className="flex items-center gap-2">
        {item.icon}
        {item.title}
        {item.badge && (
          <Badge variant="secondary" size="sm">
            {item.badge}
          </Badge>
        )}
      </span>
    </Link>
  )
}

interface SidebarNavigationItemProps {
  item: NavigationItem
  isOpen?: boolean
  onToggle?: () => void
  level?: number
}

function SidebarNavigationItem({
  item,
  isOpen = false,
  onToggle,
  level = 0,
}: SidebarNavigationItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0

  const paddingLeft = level * 12 + 16 // 16px base + 12px per level

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground'
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.title}
            {item.badge && (
              <Badge variant="secondary" size="sm">
                {item.badge}
              </Badge>
            )}
          </span>
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 transition-transform',
              isOpen && 'rotate-90'
            )}
          />
        </button>

        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => (
              <SidebarNavigationItem
                key={child.href}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href as any}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground'
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      {item.icon}
      {item.title}
      {item.badge && (
        <Badge variant="secondary" size="sm">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

interface BreadcrumbProps {
  items: { title: string; href?: string }[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {item.href ? (
            <Link
              href={item.href as any}
              className="font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.title}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
