'use client'

import { useEffect, useState } from 'react'
import type { Breakpoint, UseMediaQueryReturn } from '@/types/ui'

/**
 * Responsive breakpoint constants
 * Following the specification:
 * - Mobile: <768px
 * - Tablet: 768px-1023px
 * - Desktop: 1024px-1279px
 * - XL: 1280px+
 */
const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const

/**
 * Custom hook for detecting responsive breakpoints
 *
 * @returns Object with boolean flags for each breakpoint and current breakpoint name
 *
 * @example
 * ```tsx
 * const { isMobile, isDesktop, breakpoint } = useMediaQuery()
 *
 * if (isMobile) {
 *   return <MobileLayout />
 * }
 * ```
 */
export function useMediaQuery(): UseMediaQueryReturn {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isXL, setIsXL] = useState(false)

  useEffect(() => {
    // Create media query lists
    const mobileQuery = window.matchMedia(BREAKPOINTS.mobile)
    const tabletQuery = window.matchMedia(BREAKPOINTS.tablet)
    const desktopQuery = window.matchMedia(BREAKPOINTS.desktop)
    const xlQuery = window.matchMedia(BREAKPOINTS.xl)

    // Set initial values
    setIsMobile(mobileQuery.matches)
    setIsTablet(tabletQuery.matches)
    setIsDesktop(desktopQuery.matches)
    setIsXL(xlQuery.matches)

    // Create change handlers
    const handleMobileChange = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches)
    const handleTabletChange = (e: MediaQueryListEvent) =>
      setIsTablet(e.matches)
    const handleDesktopChange = (e: MediaQueryListEvent) =>
      setIsDesktop(e.matches)
    const handleXLChange = (e: MediaQueryListEvent) => setIsXL(e.matches)

    // Add event listeners (modern browsers)
    mobileQuery.addEventListener('change', handleMobileChange)
    tabletQuery.addEventListener('change', handleTabletChange)
    desktopQuery.addEventListener('change', handleDesktopChange)
    xlQuery.addEventListener('change', handleXLChange)

    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange)
      tabletQuery.removeEventListener('change', handleTabletChange)
      desktopQuery.removeEventListener('change', handleDesktopChange)
      xlQuery.removeEventListener('change', handleXLChange)
    }
  }, [])

  // Determine current breakpoint
  let breakpoint: Breakpoint = 'desktop' // Default
  if (isXL) breakpoint = 'xl'
  else if (isDesktop) breakpoint = 'desktop'
  else if (isTablet) breakpoint = 'tablet'
  else if (isMobile) breakpoint = 'mobile'

  return {
    isMobile,
    isTablet,
    isDesktop,
    isXL,
    breakpoint,
  }
}
