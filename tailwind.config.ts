import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // Mind Voyage responsive breakpoints from spec
      'mobile': '0px',
      'tablet': '768px',
      'desktop': '1200px',
      // Standard breakpoints for compatibility
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      '2xl': '1536px',
    },
    fontFamily: {
      'ui': 'var(--mv-font-family-ui)',
      'serif': 'var(--mv-font-family-serif)',
      'sans': 'var(--mv-font-family-ui)',
    },
    fontSize: {
      // Mind Voyage typography scale
      'h1': ['56px', '64px'],
      'h2': ['40px', '48px'], 
      'h3': ['28px', '36px'],
      'body': ['16px', '24px'],
      'small': ['14px', '20px'],
      // Standard sizes
      'xs': '12px',
      'sm': '14px',
      'base': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      'regular': '400',
      'medium': '500',
      'semibold': '600',
      'bold': '700',
      // Standard weights
      'normal': '400',
    },
    spacing: {
      // Mind Voyage 4pt spacing scale
      's4': 'var(--mv-spacing-s4)',
      's8': 'var(--mv-spacing-s8)',
      's12': 'var(--mv-spacing-s12)',
      's16': 'var(--mv-spacing-s16)',
      's20': 'var(--mv-spacing-s20)',
      's24': 'var(--mv-spacing-s24)',
      's28': 'var(--mv-spacing-s28)',
      's32': 'var(--mv-spacing-s32)',
      's40': 'var(--mv-spacing-s40)',
      's48': 'var(--mv-spacing-s48)',
      's56': 'var(--mv-spacing-s56)',
      's64': 'var(--mv-spacing-s64)',
      's80': 'var(--mv-spacing-s80)',
      // Keep standard spacing for compatibility
      '0': '0px',
      'px': '1px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
    },
    extend: {
      colors: {
        // Mind Voyage brand colors
        'mv': {
          'brand-primary': 'var(--mv-brand-primary)',
          'brand-primary-600': 'var(--mv-brand-primary-600)',
          'accent-cyan': 'var(--mv-accent-cyan)',
          'neutral-900': 'var(--mv-neutral-900)',
          'neutral-700': 'var(--mv-neutral-700)',
          'neutral-500': 'var(--mv-neutral-500)',
          'neutral-200': 'var(--mv-neutral-200)',
          'neutral-50': 'var(--mv-neutral-50)',
          'success-500': 'var(--mv-success-500)',
          'warning-500': 'var(--mv-warning-500)',
          'danger-500': 'var(--mv-danger-500)',
          'info-500': 'var(--mv-info-500)',
        },
        // Semantic colors
        'mv-bg': 'var(--mv-color-bg)',
        'mv-surface': 'var(--mv-color-surface)',
        'mv-text': 'var(--mv-color-text)',
        'mv-text-subtle': 'var(--mv-color-text-subtle)',
        'mv-border': 'var(--mv-color-border)',
        'mv-cta': 'var(--mv-color-cta)',
        'mv-cta-text': 'var(--mv-color-cta-text)',
        'mv-success': 'var(--mv-color-success)',
        'mv-warning': 'var(--mv-color-warning)',
        'mv-danger': 'var(--mv-color-danger)',
        'mv-info': 'var(--mv-color-info)',
        
        // Form-specific colors
        'mv-form-input-bg': 'var(--mv-form-input-bg)',
        'mv-form-input-text': 'var(--mv-form-input-text)',
        'mv-form-input-placeholder': 'var(--mv-form-input-placeholder)',
        'mv-form-input-border': 'var(--mv-form-input-border)',
        
        // Legacy support
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f0f7ff',
          100: '#e0effe',
          500: 'var(--mv-brand-primary)',
          600: 'var(--mv-brand-primary-600)',
          700: '#0369a1',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: {
          50: '#f0fdf4',
          500: 'var(--mv-success-500)',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: 'var(--mv-warning-500)',
        },
        error: {
          50: '#fef2f2',
          500: 'var(--mv-danger-500)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        'mv-sm': 'var(--mv-radius-sm)',
        'mv-md': 'var(--mv-radius-md)', 
        'mv-lg': 'var(--mv-radius-lg)',
        'mv-xl': 'var(--mv-radius-xl)',
        'mv-button': 'var(--mv-button-radius)',
        'mv-input': 'var(--mv-input-radius)',
        // Legacy
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'mv-card': 'var(--mv-shadow-card)',
        'mv-focus': 'var(--mv-shadow-focus)',
        'focus-ring': 'var(--mv-form-focus-ring)',
      },
      maxWidth: {
        'mv-auth-desktop': 'var(--mv-auth-container-desktop-max)',
        'mv-auth-tablet': 'var(--mv-auth-container-tablet-max)',
      },
      width: {
        'mv-aside': 'var(--mv-auth-aside-width-desktop)',
      },
      height: {
        'mv-button-md': 'var(--mv-button-height-md)',
        'mv-button-lg': 'var(--mv-button-height-lg)',
        'mv-input': 'var(--mv-input-height)',
      },
      padding: {
        'mv-auth-desktop': 'var(--mv-auth-card-padding-desktop)',
        'mv-auth-mobile': 'var(--mv-auth-card-padding-mobile)',
        'mv-button-x': 'var(--mv-button-padding-x)',
        'mv-button-y': 'var(--mv-button-padding-y)',
        'mv-input-x': 'var(--mv-input-padding-x)',
      },
      gap: {
        'mv-button': 'var(--mv-button-gap)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
