# Design System Foundation

## Color Palette

### Primary Colors
```css
/* Brand Primary - Contemplative Blue */
--primary-50: #f0f7ff;
--primary-100: #e0effe; 
--primary-200: #b9e3fd;
--primary-300: #7bd0fc;
--primary-400: #36bbf8;
--primary-500: #0ca5e9;  /* Main brand color */
--primary-600: #0284c7;
--primary-700: #0369a1;
--primary-800: #075985;
--primary-900: #0c4a6e;
--primary-950: #082f49;
```

### Secondary Colors  
```css
/* Wisdom Gold - For achievements and highlights */
--secondary-50: #fffbeb;
--secondary-100: #fef3c7;
--secondary-200: #fde68a;
--secondary-300: #fcd34d;
--secondary-400: #fbbf24;
--secondary-500: #f59e0b;  /* Achievement color */
--secondary-600: #d97706;
--secondary-700: #b45309;
--secondary-800: #92400e;
--secondary-900: #78350f;
```

### Neutral Colors
```css
/* Slate - For text and backgrounds */
--neutral-50: #f8fafc;
--neutral-100: #f1f5f9;
--neutral-200: #e2e8f0;
--neutral-300: #cbd5e1;
--neutral-400: #94a3b8;
--neutral-500: #64748b;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1e293b;
--neutral-900: #0f172a;
```

### Semantic Colors
```css
/* Success - For completed habits */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;
--success-700: #15803d;

/* Warning - For missed habits */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error - For validation and errors */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info - For tips and guidance */
--info-50: #f0f9ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

### Mood Colors
```css
/* Mood Scale Visualization */
--mood-1: #ef4444;  /* Very Bad - Red */
--mood-2: #f97316;  /* Bad - Orange */
--mood-3: #eab308;  /* Neutral - Yellow */
--mood-4: #84cc16;  /* Good - Light Green */
--mood-5: #22c55e;  /* Great - Green */
```

## Typography

### Font Stack
```css
/* Primary Font - System fonts for performance */
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", 
             sans-serif, "Apple Color Emoji", "Segoe UI Emoji", 
             "Segoe UI Symbol", "Noto Color Emoji";

/* Monospace - For code and data display */
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Consolas, 
             "Liberation Mono", Menlo, monospace;
```

### Typography Scale
```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px - Captions, fine print */
--text-sm: 0.875rem;   /* 14px - Small text, secondary info */
--text-base: 1rem;     /* 16px - Body text, default */
--text-lg: 1.125rem;   /* 18px - Emphasized text */
--text-xl: 1.25rem;    /* 20px - Page subtitles */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero text */

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing System

### Spacing Scale (Tailwind-inspired)
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Component Spacing
```css
/* Component-specific spacing */
--spacing-component-padding: var(--space-4);
--spacing-component-margin: var(--space-4);
--spacing-section-gap: var(--space-8);
--spacing-page-padding: var(--space-6);
```

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;   /* Fully rounded */
```

## Shadows

```css
/* Elevation System */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Focus shadows */
--shadow-focus: 0 0 0 3px rgb(var(--primary-500) / 0.1);
```

## Breakpoints

### Mobile-First Responsive System
```css
/* Mobile First Approach */
/* Default: Mobile (320px and up) */

@media (min-width: 640px) {  /* sm: Small tablets */}
@media (min-width: 768px) {  /* md: Tablets */}
@media (min-width: 1024px) { /* lg: Small desktops */}
@media (min-width: 1280px) { /* xl: Large desktops */}
@media (min-width: 1536px) { /* 2xl: Extra large screens */}
```

### Container Sizes
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

## Iconography

### Icon System
- **Icon Library**: Lucide React (lightweight, consistent)
- **Icon Sizes**: 16px (sm), 20px (base), 24px (lg), 32px (xl)
- **Icon Colors**: Match text color hierarchy
- **Stroke Width**: 1.5px for optimal clarity

### Core Icons
```typescript
// Essential icons used throughout the application
import { 
  CheckCircle, Circle, Flame, TrendingUp, BookOpen,
  Calendar, Settings, User, Bell, Menu, X, ArrowRight,
  Heart, Star, Coffee, Dumbbell, Book, Palette, Shield,
  Download, Upload, CreditCard, LogOut, Edit, Plus
} from 'lucide-react';
```

## Animation & Transitions

### Duration Scale
```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Easing Functions
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions
```css
--transition-colors: color var(--duration-150) var(--ease-in-out), 
                     background-color var(--duration-150) var(--ease-in-out);
--transition-opacity: opacity var(--duration-150) var(--ease-in-out);
--transition-transform: transform var(--duration-150) var(--ease-in-out);
--transition-all: all var(--duration-150) var(--ease-in-out);
```

## Dark Mode Support

### Dark Mode Colors
```css
/* Dark mode overrides */
[data-theme="dark"] {
  --neutral-50: #0f172a;
  --neutral-100: #1e293b;
  --neutral-200: #334155;
  --neutral-300: #475569;
  --neutral-400: #64748b;
  --neutral-500: #94a3b8;
  --neutral-600: #cbd5e1;
  --neutral-700: #e2e8f0;
  --neutral-800: #f1f5f9;
  --neutral-900: #f8fafc;
  
  /* Adjust primary colors for dark mode */
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;
  --primary-600: #0284c7;
}
```

## Accessibility Standards

### Color Contrast Requirements
- **Large Text (18px+)**: Minimum 3:1 contrast ratio
- **Regular Text**: Minimum 4.5:1 contrast ratio  
- **Interactive Elements**: Minimum 3:1 contrast ratio

### Focus Indicators
```css
/* Consistent focus styling */
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Screen Reader Support
- Use semantic HTML elements
- Provide descriptive alt text for images
- Include ARIA labels for complex interactions
- Maintain logical heading hierarchy

This design system foundation ensures consistency, accessibility, and scalability across all components and layouts in Mind Voyage Companion.