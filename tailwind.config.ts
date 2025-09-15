export default {
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
        background: 'var(--mv-color-bg)',
        foreground: 'var(--mv-color-text)',
        border: 'var(--mv-color-border)',
      },
        borderRadius: {
          lg: 'var(--mv-radius-lg)',
          xl: 'var(--mv-radius-xl)',
        }
    },
  },
  plugins: [],
}