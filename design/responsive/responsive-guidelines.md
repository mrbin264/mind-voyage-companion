# Responsive Design Guidelines

## Breakpoint Strategy

Our desktop-first approach uses the following breakpoints, cascading downward:

```css
/* Breakpoint Variables */
:root {
  /* Desktop-first breakpoints */
  --breakpoint-2xl: 1536px;
  --breakpoint-xl: 1280px;
  --breakpoint-lg: 1024px;
  --breakpoint-md: 768px;
  --breakpoint-sm: 640px;
}

/* Media Query Mixins */
@media (max-width: 1279px) { /* xl and below */ }
@media (max-width: 1023px) { /* lg and below */ }
@media (max-width: 767px)  { /* md and below */ }
@media (max-width: 639px)  { /* sm and below */ }
```

---

## Layout Adaptation Patterns

### 1. Application Shell Responsive Behavior

```css
/* Desktop (1024px+): Full sidebar layout */
.app-shell-desktop {
  grid-template-columns: 16rem 1fr 20rem;
  grid-template-areas: 
    "sidebar main aside"
    "sidebar main aside";
}

/* Tablet (768px - 1023px): Collapsed sidebar */
@media (max-width: 1023px) {
  .app-shell {
    grid-template-columns: 4rem 1fr;
    grid-template-areas: 
      "sidebar main"
      "sidebar main";
  }
  
  .app-sidebar {
    width: 4rem;
  }
  
  .nav-label {
    display: none;
  }
  
  .nav-icon {
    margin: 0 auto;
  }
  
  .app-aside {
    display: none;
  }
}

/* Mobile (767px and below): Overlay navigation */
@media (max-width: 767px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }
  
  .app-sidebar {
    position: fixed;
    left: -16rem;
    top: 0;
    bottom: 0;
    width: 16rem;
    z-index: 50;
    background: white;
    box-shadow: var(--shadow-xl);
    transition: left var(--duration-300) var(--ease-out);
  }
  
  .app-sidebar.open {
    left: 0;
  }
  
  .mobile-nav-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 60;
  }
}
```

### 2. Dashboard Grid Responsiveness

```css
/* Desktop: 3-column dashboard */
.dashboard-grid-desktop {
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Tablet: 2-column dashboard */
@media (max-width: 1023px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .dashboard-widget.span-2 {
    grid-column: 1 / -1;
  }
}

/* Mobile: Single column */
@media (max-width: 767px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .dashboard-widget {
    grid-column: 1;
  }
}
```

### 3. Habit Grid Responsive Behavior

```css
/* Desktop: 4-column habit grid */
.habit-grid-desktop {
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}

/* Tablet: 2-3 columns */
@media (max-width: 1023px) {
  .habit-grid {
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1rem;
  }
}

/* Mobile: 1-2 columns */
@media (max-width: 767px) {
  .habit-grid {
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 0.75rem;
    padding: 1rem;
  }
}

/* Small mobile: Single column */
@media (max-width: 479px) {
  .habit-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Component Responsive Patterns

### 1. Button Responsive Scaling

```css
.btn {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
  min-height: 2.75rem;
}

@media (max-width: 767px) {
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: var(--text-sm);
    min-height: 2.5rem;
  }
}

@media (max-width: 479px) {
  .btn.btn-mobile-full {
    width: 100%;
    justify-content: center;
  }
}
```

### 2. Card Responsive Behavior

```css
.card {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
}

@media (max-width: 1023px) {
  .card {
    padding: 1.25rem;
    border-radius: var(--radius-lg);
  }
}

@media (max-width: 767px) {
  .card {
    padding: 1rem;
    border-radius: var(--radius-md);
  }
}

/* Card layouts adapt to mobile */
.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 767px) {
  .card-content.mobile-vertical {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

### 3. Modal Responsive Behavior

```css
.modal-overlay {
  padding: 2rem;
}

.modal-content {
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
}

@media (max-width: 767px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    max-width: none;
    width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }
  
  /* Full-screen modals on mobile */
  .modal-content.mobile-fullscreen {
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}
```

---

## Typography Responsive Scaling

```css
/* Fluid typography with clamp */
:root {
  /* Desktop-first fluid scaling */
  --text-xs: clamp(0.75rem, 0.71rem + 0.2vw, 0.8rem);
  --text-sm: clamp(0.875rem, 0.83rem + 0.23vw, 0.95rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.1rem);
  --text-lg: clamp(1.125rem, 1.07rem + 0.28vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.18rem + 0.35vw, 1.4rem);
  --text-2xl: clamp(1.5rem, 1.41rem + 0.43vw, 1.75rem);
  --text-3xl: clamp(1.875rem, 1.74rem + 0.68vw, 2.25rem);
}

/* Heading responsive behavior */
.page-title {
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
}

.section-title {
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
}

.card-title {
  font-size: var(--text-xl);
  line-height: var(--leading-snug);
}

/* Mobile-specific typography adjustments */
@media (max-width: 767px) {
  .page-title {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .section-title {
    margin-bottom: 0.75rem;
  }
}
```

---

## Spacing Responsive System

```css
/* Desktop spacing (base) */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;
  --spacing-xl: 1.25rem;
  --spacing-2xl: 1.5rem;
  --spacing-3xl: 2rem;
  --spacing-4xl: 2.5rem;
  --spacing-5xl: 3rem;
}

/* Tablet adjustments */
@media (max-width: 1023px) {
  :root {
    --spacing-3xl: 1.5rem;
    --spacing-4xl: 2rem;
    --spacing-5xl: 2.5rem;
  }
}

/* Mobile adjustments */
@media (max-width: 767px) {
  :root {
    --spacing-2xl: 1rem;
    --spacing-3xl: 1.25rem;
    --spacing-4xl: 1.5rem;
    --spacing-5xl: 2rem;
  }
}
```

---

## Navigation Responsive Patterns

### 1. Desktop Navigation (Full)
```css
.desktop-navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}
```

### 2. Tablet Navigation (Collapsed)
```css
@media (max-width: 1023px) {
  .desktop-navigation {
    gap: 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .nav-text {
    display: none;
  }
}
```

### 3. Mobile Navigation (Hamburger)
```css
@media (max-width: 767px) {
  .desktop-navigation {
    display: none;
  }
  
  .mobile-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .hamburger-menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    cursor: pointer;
  }
  
  .hamburger-line {
    width: 1.5rem;
    height: 0.125rem;
    background: var(--neutral-600);
    border-radius: var(--radius-full);
    transition: all var(--duration-200) var(--ease-out);
  }
  
  .hamburger-menu.open .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(0.375rem, 0.375rem);
  }
  
  .hamburger-menu.open .hamburger-line:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger-menu.open .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(0.375rem, -0.375rem);
  }
}
```

---

## Form Responsive Behavior

```css
/* Desktop forms: Side-by-side fields */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-field.span-2 {
  grid-column: 1 / -1;
}

/* Tablet: Maintain 2-column */
@media (max-width: 1023px) {
  .form-grid {
    gap: 1rem;
  }
}

/* Mobile: Single column */
@media (max-width: 767px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-field {
    grid-column: 1;
  }
  
  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .form-button {
    width: 100%;
  }
}
```

---

## Touch and Interaction Adaptations

### 1. Touch Target Sizing
```css
/* Minimum 44px touch targets for mobile */
@media (max-width: 767px) {
  .btn,
  .touch-target {
    min-height: 2.75rem; /* 44px */
    min-width: 2.75rem;
  }
  
  .icon-button {
    width: 2.75rem;
    height: 2.75rem;
  }
}
```

### 2. Hover State Adaptations
```css
/* Disable hover effects on touch devices */
@media (hover: none) {
  .hover-effect:hover {
    transform: none;
    box-shadow: none;
  }
}

/* Enhanced focus states for keyboard navigation */
@media (prefers-reduced-motion: no-preference) {
  .focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
}
```

---

## Performance Considerations

### 1. Image Responsive Behavior
```css
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* Different images for different screen sizes */
.hero-image {
  background-image: url('/images/hero-desktop.jpg');
}

@media (max-width: 1023px) {
  .hero-image {
    background-image: url('/images/hero-tablet.jpg');
  }
}

@media (max-width: 767px) {
  .hero-image {
    background-image: url('/images/hero-mobile.jpg');
  }
}
```

### 2. Content Loading Strategies
```css
/* Hide complex elements on mobile */
@media (max-width: 767px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-simplified {
    display: block;
  }
}

@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
  
  .mobile-simplified {
    display: none;
  }
}
```

This responsive design guide ensures our desktop-first approach gracefully adapts to smaller screens while maintaining usability and visual hierarchy across all device types.