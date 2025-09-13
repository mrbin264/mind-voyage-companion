# Accessibility Documentation

## WCAG 2.1 AA Compliance Guidelines

This document outlines our comprehensive accessibility strategy to ensure Mind Voyage Companion meets and exceeds WCAG 2.1 AA standards, providing an inclusive experience for all users.

---

## Color and Contrast Standards

### 1. Contrast Ratios

Our design system ensures proper contrast ratios across all components:

```css
/* Contrast ratio requirements */
:root {
  /* AA Standard: 4.5:1 for normal text */
  --contrast-normal: 4.5;
  /* AA Standard: 3:1 for large text (18pt+) */
  --contrast-large: 3;
  /* AAA Standard: 7:1 for enhanced contrast */
  --contrast-enhanced: 7;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --neutral-50: #ffffff;
    --neutral-100: #f0f0f0;
    --neutral-200: #d0d0d0;
    --neutral-300: #a0a0a0;
    --neutral-400: #808080;
    --neutral-500: #606060;
    --neutral-600: #404040;
    --neutral-700: #303030;
    --neutral-800: #202020;
    --neutral-900: #000000;
  }
  
  /* Enhanced focus indicators */
  .focus-visible {
    outline: 3px solid var(--primary-600);
    outline-offset: 3px;
  }
}
```

### 2. Color Accessibility Features

```css
/* Never rely on color alone for information */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Success state */
.status-success {
  color: var(--success-700);
}

.status-success .status-icon::before {
  content: '✓';
  font-weight: bold;
}

/* Error state */
.status-error {
  color: var(--error-700);
}

.status-error .status-icon::before {
  content: '⚠';
  font-weight: bold;
}

/* Warning state */
.status-warning {
  color: var(--warning-700);
}

.status-warning .status-icon::before {
  content: '⚠';
  font-weight: bold;
}

/* Pattern fills for colorblind users */
.chart-pattern-success {
  fill: url(#success-pattern);
}

.chart-pattern-error {
  fill: url(#error-pattern);
}
```

---

## Typography and Readability

### 1. Font Size and Line Height

```css
/* Minimum readable font sizes */
:root {
  --text-min: 1rem; /* 16px minimum */
  --text-small-min: 0.875rem; /* 14px for small text */
  --line-height-readable: 1.5; /* Minimum for readability */
  --line-height-comfortable: 1.6; /* Preferred for body text */
}

/* Body text standards */
.body-text {
  font-size: var(--text-base); /* Never below 16px */
  line-height: var(--line-height-comfortable);
  max-width: 65ch; /* Optimal reading width */
  color: var(--neutral-900); /* High contrast */
}

/* Small text requirements */
.small-text {
  font-size: var(--text-small-min);
  line-height: var(--line-height-readable);
  color: var(--neutral-800); /* Still high contrast */
}

/* Large text benefits */
.large-text {
  font-size: var(--text-lg);
  line-height: var(--line-height-readable);
  color: var(--neutral-700); /* Can be slightly lower contrast */
}
```

### 2. Dyslexia-Friendly Typography

```css
/* Alternative font for dyslexic users */
@media (prefers-reduced-motion: reduce) {
  .dyslexia-friendly {
    font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
    letter-spacing: 0.04em;
    word-spacing: 0.16em;
    line-height: 1.8;
  }
}

/* Text spacing controls */
.text-spacing-wide {
  letter-spacing: 0.08em;
  word-spacing: 0.24em;
  line-height: 2;
}
```

---

## Keyboard Navigation

### 1. Focus Management

```css
/* Visible focus indicators */
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Skip navigation link */
.skip-nav {
  position: absolute;
  top: -100vh;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-600);
  color: white;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-semibold);
  z-index: 1000;
  transition: top var(--duration-fast) var(--ease-out);
}

.skip-nav:focus {
  top: 1rem;
}

/* Focus trap for modals */
.modal-content {
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  /* Invisible but focusable element */
  outline: none;
}

/* Focus restoration helper */
.focus-restore-target {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}
```

### 2. Keyboard Shortcuts

```css
/* Keyboard shortcut indicators */
.keyboard-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-xs);
  color: var(--neutral-600);
  background: var(--neutral-100);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--neutral-300);
}

.kbd {
  font-family: var(--font-mono);
  font-size: 0.75em;
  font-weight: var(--font-semibold);
  background: var(--neutral-50);
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-xs);
  box-shadow: 0 1px 0 var(--neutral-400);
}
```

---

## Screen Reader Support

### 1. Semantic HTML and ARIA

```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Temporarily visible for screen readers */
.sr-only.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  background: var(--primary-600);
  color: white;
  border-radius: var(--radius-md);
}

/* ARIA live regions */
.live-region {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.announcement-banner {
  background: var(--primary-50);
  border: 2px solid var(--primary-200);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin-bottom: 1rem;
}

.announcement-banner[aria-live="polite"] {
  background: var(--info-50);
  border-color: var(--info-200);
}

.announcement-banner[aria-live="assertive"] {
  background: var(--warning-50);
  border-color: var(--warning-200);
}
```

### 2. Form Accessibility

```css
/* Form field associations */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  font-size: var(--text-base);
}

.form-label.required::after {
  content: ' *';
  color: var(--error-600);
  font-weight: var(--font-bold);
}

.form-input {
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  color: var(--neutral-900);
  background: white;
}

.form-input:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.2);
}

.form-input[aria-invalid="true"] {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgba(var(--error-500-rgb), 0.2);
}

/* Error and help text */
.form-error {
  color: var(--error-700);
  font-size: var(--text-sm);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.form-error::before {
  content: '⚠';
  color: var(--error-600);
  font-weight: bold;
  flex-shrink: 0;
}

.form-help {
  color: var(--neutral-700);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

---

## Motion and Animation Accessibility

### 1. Reduced Motion Support

```css
/* Respect user preferences for motion */
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Provide alternative feedback */
  .btn:hover {
    background: var(--primary-100);
    border-color: var(--primary-400);
  }
  
  .card:hover {
    border-color: var(--primary-300);
    box-shadow: 0 0 0 2px rgba(var(--primary-500-rgb), 0.2);
  }
  
  /* Static loading indicators */
  .loading-spinner {
    background: var(--primary-500);
    color: white;
  }
  
  .loading-spinner::after {
    content: '⏳';
  }
}

/* Vestibular disorder considerations */
@media (prefers-reduced-motion: reduce) {
  /* No parallax scrolling */
  .parallax {
    transform: none !important;
  }
  
  /* No auto-playing animations */
  .auto-animate {
    animation-play-state: paused;
  }
}
```

### 2. Animation Controls

```css
/* Play/pause button for animations */
.animation-controls {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  background: white;
  border: 2px solid var(--neutral-300);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
}

.animation-controls:hover {
  background: var(--neutral-50);
  border-color: var(--primary-400);
}

.animation-controls[aria-pressed="true"] .play-icon {
  display: none;
}

.animation-controls[aria-pressed="false"] .pause-icon {
  display: none;
}
```

---

## Interactive Elements

### 1. Button Accessibility

```css
/* Minimum touch targets */
.btn,
.interactive-element {
  min-width: 2.75rem; /* 44px */
  min-height: 2.75rem; /* 44px */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  cursor: pointer;
  position: relative;
}

/* Loading state accessibility */
.btn[aria-busy="true"] {
  pointer-events: none;
}

.btn[aria-busy="true"]::after {
  content: '';
  position: absolute;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Disabled state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn:disabled::after {
  content: none;
}
```

### 2. Link Accessibility

```css
/* Distinguishable links */
.link {
  color: var(--primary-600);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 2px;
}

.link:hover {
  color: var(--primary-700);
  text-decoration-thickness: 3px;
}

.link:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* External link indicators */
.link-external::after {
  content: '↗';
  margin-left: 0.25rem;
  font-size: 0.875em;
  vertical-align: super;
}
```

---

## Data Visualization Accessibility

### 1. Chart Accessibility

```css
/* Chart containers with proper roles */
.chart-container {
  position: relative;
}

.chart-data-table {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.chart-container:focus-within .chart-data-table {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  background: white;
  border: 2px solid var(--primary-500);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin-top: 1rem;
}

/* High contrast patterns */
.chart-pattern-1 {
  fill: url(#diagonal-lines);
}

.chart-pattern-2 {
  fill: url(#dots);
}

.chart-pattern-3 {
  fill: url(#crosses);
}
```

### 2. Progress Indicators

```css
.progress-container {
  position: relative;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  font-size: var(--text-sm);
  z-index: 1;
}

/* Screen reader progress updates */
.progress-sr-update {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
```

---

## Error Handling and Feedback

### 1. Error Messages

```css
.error-container {
  background: var(--error-50);
  border: 2px solid var(--error-300);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.error-icon {
  color: var(--error-600);
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.error-content {
  flex: 1;
}

.error-title {
  font-weight: var(--font-semibold);
  color: var(--error-800);
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--error-700);
  line-height: var(--leading-relaxed);
}

.error-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}
```

### 2. Success Messages

```css
.success-container {
  background: var(--success-50);
  border: 2px solid var(--success-300);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.success-icon {
  color: var(--success-600);
  flex-shrink: 0;
}

.success-icon::before {
  content: '✓';
  font-weight: bold;
  font-size: 1.25rem;
}
```

---

## Testing and Validation

### 1. Accessibility Testing Hooks

```css
/* Testing indicators (remove in production) */
.a11y-test-landmark {
  outline: 2px dashed blue;
}

.a11y-test-heading {
  outline: 2px dashed green;
}

.a11y-test-interactive {
  outline: 2px dashed orange;
}

.a11y-test-focus {
  outline: 3px solid red;
}
```

This accessibility documentation ensures Mind Voyage Companion provides an inclusive, barrier-free experience for all users while exceeding WCAG 2.1 AA compliance standards.