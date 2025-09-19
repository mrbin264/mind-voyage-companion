'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    const htmlElement = document.documentElement

    // Check what theme is already applied by the script
    const currentThemeFromDOM = htmlElement.classList.contains('light')
      ? 'light'
      : htmlElement.classList.contains('dark')
        ? 'dark'
        : null

    const initialTheme = savedTheme || currentThemeFromDOM || systemTheme

    console.log('Theme initialization:')
    console.log('- savedTheme:', savedTheme)
    console.log('- systemTheme:', systemTheme)
    console.log('- currentThemeFromDOM:', currentThemeFromDOM)
    console.log('- initialTheme:', initialTheme)
    console.log('- HTML classes:', htmlElement.classList.toString())

    setTheme(initialTheme)
    setMounted(true)
  }, [])

  // Apply theme to DOM and save to localStorage
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    console.log('Applying theme:', theme)
    console.log('Classes before:', root.classList.toString())
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    console.log('Classes after:', root.classList.toString())
    localStorage.setItem('theme', theme)
    console.log('localStorage theme:', localStorage.getItem('theme'))
  }, [theme, mounted])

  const toggleTheme = () => {
    console.log('Theme toggle clicked, current theme:', theme)
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      console.log('Switching to theme:', newTheme)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
