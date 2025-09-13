# Interaction and Animation Specifications

## Animation System Overview

Our animation system follows modern web standards with performance-first principles, accessibility considerations, and delightful micro-interactions that enhance user experience without overwhelming.

---

## Animation Tokens

```css
:root {
  /* Duration tokens */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-moderate: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;

  /* Easing functions */
  --ease-linear: cubic-bezier(0, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

  /* Motion preferences */
  --motion-safe: 1;
  --motion-reduce: 0;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-safe: 0;
    --motion-reduce: 1;
    --duration-fast: 0ms;
    --duration-moderate: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}
```

---

## Micro-Interactions

### 1. Button Interactions

```css
.btn {
  position: relative;
  overflow: hidden;
  transition: all var(--duration-fast) var(--ease-out);
  transform-origin: center;
}

/* Hover effects */
.btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Active (pressed) state */
.btn:active {
  transform: translateY(0) scale(0.98);
  transition-duration: calc(var(--duration-fast) / 2);
}

/* Focus state */
.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.2);
}

/* Ripple effect */
.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all var(--duration-moderate) var(--ease-out);
  pointer-events: none;
  opacity: 0;
}

.btn:active::after {
  width: 300px;
  height: 300px;
  opacity: 1;
  transition-duration: 0ms;
}

/* Loading state */
.btn.loading {
  pointer-events: none;
  position: relative;
  color: transparent;
}

.btn.loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right: 2px solid transparent;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: spin var(--duration-slower) linear infinite;
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
```

### 2. Card Interactions

```css
.card {
  transition: all var(--duration-moderate) var(--ease-out);
  cursor: pointer;
  position: relative;
}

/* Hover elevation */
.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 20px 48px rgba(0, 0, 0, 0.1);
}

/* Click feedback */
.card:active {
  transform: translateY(-2px) scale(1.01);
  transition-duration: var(--duration-fast);
}

/* Shine effect on hover */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent
  );
  transition: left var(--duration-slow) var(--ease-out);
  pointer-events: none;
}

.card:hover::before {
  left: 100%;
}
```

### 3. Input Field Interactions

```css
.input-field {
  position: relative;
  background: white;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--ease-out);
}

/* Focus state */
.input-field:focus-within {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(var(--primary-500-rgb), 0.1);
  transform: scale(1.02);
}

/* Label animation */
.input-label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: var(--neutral-500);
  pointer-events: none;
  transition: all var(--duration-moderate) var(--ease-out);
  font-size: var(--text-base);
}

.input-field:focus-within .input-label,
.input-field.has-value .input-label {
  top: -0.75rem;
  left: 0.75rem;
  font-size: var(--text-sm);
  color: var(--primary-600);
  background: white;
  padding: 0 0.5rem;
  transform: none;
}

/* Input validation states */
.input-field.error {
  border-color: var(--error-500);
  animation: shake var(--duration-moderate) var(--ease-out);
}

.input-field.success {
  border-color: var(--success-500);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

---

## Page Transitions

### 1. Route Transitions

```css
/* Page enter/exit animations */
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all var(--duration-moderate) var(--ease-out);
}

.page-transition-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: all var(--duration-moderate) var(--ease-out);
}

/* Stagger children animations */
.stagger-children > * {
  animation: fadeInUp var(--duration-moderate) var(--ease-out) backwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }
.stagger-children > *:nth-child(4) { animation-delay: 150ms; }
.stagger-children > *:nth-child(5) { animation-delay: 200ms; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 2. Modal Transitions

```css
/* Modal backdrop */
.modal-backdrop {
  background: rgba(0, 0, 0, 0);
  transition: background var(--duration-moderate) var(--ease-out);
}

.modal-backdrop.open {
  background: rgba(0, 0, 0, 0.5);
}

/* Modal content */
.modal-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
  transition: all var(--duration-moderate) var(--ease-spring);
}

.modal-content.open {
  transform: scale(1) translateY(0);
  opacity: 1;
}

/* Modal close animation */
.modal-content.closing {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
  transition-duration: var(--duration-fast);
}
```

---

## Loading States

### 1. Skeleton Loaders

```css
.skeleton {
  background: linear-gradient(90deg, 
    var(--neutral-200) 25%, 
    var(--neutral-100) 50%, 
    var(--neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer var(--duration-slower) infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Skeleton variants */
.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-text:last-child {
  width: 60%;
}

.skeleton-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}

.skeleton-card {
  height: 8rem;
  border-radius: var(--radius-lg);
}
```

### 2. Progress Indicators

```css
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: var(--neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--primary-500), 
    var(--primary-400)
  );
  border-radius: var(--radius-full);
  transition: width var(--duration-moderate) var(--ease-out);
  position: relative;
}

/* Animated progress bar */
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progressShine 2s infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## Data Visualization Animations

### 1. Chart Animations

```css
/* Bar chart animation */
.chart-bar {
  transform: scaleY(0);
  transform-origin: bottom;
  animation: barGrow var(--duration-slow) var(--ease-out) forwards;
}

@keyframes barGrow {
  to { transform: scaleY(1); }
}

/* Pie chart animation */
.chart-pie {
  stroke-dasharray: 0 100;
  animation: pieGrow var(--duration-slower) var(--ease-out) forwards;
}

@keyframes pieGrow {
  to { stroke-dasharray: var(--percentage) 100; }
}

/* Line chart animation */
.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: lineDraw var(--duration-slower) var(--ease-out) forwards;
}

@keyframes lineDraw {
  to { stroke-dashoffset: 0; }
}
```

### 2. Counter Animations

```css
.animated-counter {
  font-variant-numeric: tabular-nums;
  animation: countUp var(--duration-slow) var(--ease-out);
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Gesture and Swipe Interactions

### 1. Mobile Swipe Actions

```css
.swipe-item {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  transform: translateX(100%);
  transition: transform var(--duration-moderate) var(--ease-out);
}

.swipe-item.swiped .swipe-actions {
  transform: translateX(0);
}

.swipe-action {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 4rem;
  color: white;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.swipe-action:hover {
  filter: brightness(110%);
}

.swipe-action.delete {
  background: var(--error-500);
}

.swipe-action.edit {
  background: var(--warning-500);
}
```

### 2. Pull-to-Refresh

```css
.pull-refresh-container {
  position: relative;
  overflow: hidden;
}

.pull-refresh-indicator {
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2rem;
  height: 2rem;
  opacity: 0;
  transition: all var(--duration-moderate) var(--ease-out);
}

.pull-refresh-container.pulling .pull-refresh-indicator {
  top: 1rem;
  opacity: 1;
  animation: spin var(--duration-slower) linear infinite;
}
```

---

## Accessibility Considerations

### 1. Focus Management

```css
/* High contrast focus indicators */
@media (prefers-contrast: high) {
  .focus-visible {
    outline: 3px solid var(--primary-600);
    outline-offset: 2px;
  }
}

/* Focus trap animations */
.focus-trap-active {
  animation: focusPulse 2s infinite;
}

@keyframes focusPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-500-rgb), 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(var(--primary-500-rgb), 0); }
}
```

### 2. Screen Reader Announcements

```css
.sr-announcement {
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

/* Temporary visibility for announcements */
.sr-announcement.announce {
  animation: srAnnounce var(--duration-fast) ease-out;
}

@keyframes srAnnounce {
  0%, 100% { 
    width: 1px; 
    height: 1px; 
  }
  50% { 
    width: auto; 
    height: auto; 
    clip: auto; 
  }
}
```

---

## Performance Optimizations

### 1. GPU Acceleration

```css
/* Force GPU acceleration for smooth animations */
.will-animate {
  will-change: transform, opacity;
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
```

### 2. Reduced Motion Fallbacks

```css
/* Provide alternative feedback for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .btn:hover,
  .card:hover {
    transform: none;
    box-shadow: 0 0 0 2px var(--primary-300);
  }
  
  .progress-bar {
    background: var(--primary-100);
  }
  
  .loading-spinner {
    animation: none;
    background: var(--primary-500);
  }
}
```

This animation specification provides a comprehensive system for delightful, accessible, and performant interactions throughout the Mind Voyage Companion application.