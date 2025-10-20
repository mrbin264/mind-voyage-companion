import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--mv-brand-primary)',
          600: 'var(--mv-brand-primary-600)',
        },
        secondary: {
          500: 'var(--mv-accent-secondary)',
          600: 'var(--mv-accent-secondary-600)',
        },
        background: {
          DEFAULT: 'var(--mv-color-bg)',
          primary: '#0A0A0A', // Body background
          sidebar: '#101010', // Sidebar background
          card: '#18181B', // Widget card background (zinc-900)
        },
        foreground: 'var(--mv-color-text)',
        border: {
          DEFAULT: 'var(--mv-color-border)',
          subtle: 'rgba(255, 255, 255, 0.1)', // border-white/10
        },
      },
      borderRadius: {
        lg: 'var(--mv-radius-lg)',
        xl: 'var(--mv-radius-xl)',
      },
    },
  },
  plugins: [],
}

export default config
