# Core Component Specifications

## 1. Button Component

### Component Overview
The Button component is the primary interactive element used throughout the application for actions, navigation, and form submissions.

### Props Interface
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'base' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

### Visual Specifications

#### Variants
```css
/* Primary - Main actions */
.btn-primary {
  background: var(--primary-500);
  color: white;
  border: 1px solid var(--primary-500);
}
.btn-primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

/* Secondary - Supporting actions */
.btn-secondary {
  background: var(--secondary-500);
  color: var(--neutral-900);
  border: 1px solid var(--secondary-500);
}

/* Outline - Alternative actions */
.btn-outline {
  background: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-200);
}
.btn-outline:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
}

/* Ghost - Minimal actions */
.btn-ghost {
  background: transparent;
  color: var(--neutral-700);
  border: none;
}
.btn-ghost:hover {
  background: var(--neutral-100);
}

/* Destructive - Dangerous actions */
.btn-destructive {
  background: var(--error-500);
  color: white;
  border: 1px solid var(--error-500);
}
```

#### Sizes
```css
.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: var(--text-sm);
  min-height: 2rem;
}

.btn-base {
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.btn-lg {
  padding: 1rem 1.5rem;
  font-size: var(--text-lg);
  min-height: 3rem;
}

.btn-xl {
  padding: 1.25rem 2rem;
  font-size: var(--text-xl);
  min-height: 3.5rem;
}
```

#### States
```css
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn.loading {
  cursor: not-allowed;
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Usage Examples
```jsx
// Primary action button
<Button variant="primary" size="lg">
  Get Started
</Button>

// Button with icon
<Button variant="outline" icon={Plus} iconPosition="left">
  Add Habit
</Button>

// Loading state
<Button variant="primary" loading>
  Creating Account...
</Button>

// Full width mobile button
<Button variant="primary" fullWidth>
  Continue
</Button>
```

### Accessibility Requirements
- Minimum 44px touch target size on mobile
- High contrast ratio (4.5:1 for normal text)
- Clear focus indicators
- Screen reader accessible with proper ARIA labels
- Keyboard navigation support (Enter, Space)

---

## 2. Input Component

### Component Overview
Form input component for text entry, email, password, and other text-based inputs.

### Props Interface
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
  onRightIconClick?: () => void;
  size?: 'sm' | 'base' | 'lg';
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}
```

### Visual Specifications

#### Base Styles
```css
.input-base {
  border: 1px solid var(--neutral-300);
  border-radius: var(--radius-md);
  background: white;
  color: var(--neutral-900);
  transition: var(--transition-colors);
}

.input-base:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

.input-base::placeholder {
  color: var(--neutral-400);
}
```

#### Sizes
```css
.input-sm {
  padding: 0.5rem 0.75rem;
  font-size: var(--text-sm);
  min-height: 2rem;
}

.input-base {
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  min-height: 2.5rem;
}

.input-lg {
  padding: 1rem 1.25rem;
  font-size: var(--text-lg);
  min-height: 3rem;
}
```

#### States
```css
.input-error {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px var(--error-500) / 0.1;
}

.input-disabled {
  background: var(--neutral-50);
  color: var(--neutral-400);
  cursor: not-allowed;
}

.input-with-icon-left {
  padding-left: 2.5rem;
}

.input-with-icon-right {
  padding-right: 2.5rem;
}
```

### Usage Examples
```jsx
// Basic input
<Input 
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// Input with validation error
<Input
  label="Password"
  type="password"
  error
  errorMessage="Password must be at least 8 characters"
/>

// Input with icons
<Input
  leftIcon={Search}
  placeholder="Search habits..."
  rightIcon={X}
  onRightIconClick={clearSearch}
/>
```

---

## 3. Card Component

### Component Overview
Container component for grouping related content with consistent styling and elevation.

### Props Interface
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'base' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

### Visual Specifications

#### Variants
```css
.card-default {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card-outlined {
  background: white;
  border: 2px solid var(--neutral-300);
  border-radius: var(--radius-lg);
  box-shadow: none;
}

.card-elevated {
  background: white;
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.card-flat {
  background: var(--neutral-50);
  border: none;
  border-radius: var(--radius-lg);
}
```

#### Interactive States
```css
.card-hoverable:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all var(--duration-150) var(--ease-out);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Usage Examples
```jsx
// Habit card
<Card variant="default" hoverable>
  <CardHeader>
    <h3>Morning Pages</h3>
    <Badge variant="success">🔥 7 days</Badge>
  </CardHeader>
  <CardContent>
    Write 3 pages of stream of consciousness every morning.
  </CardContent>
</Card>

// Clickable journal entry card
<Card variant="outlined" clickable onClick={openEntry}>
  <div className="flex justify-between">
    <span>Today's Entry</span>
    <span>😊</span>
  </div>
  <p>Today I feel grateful for...</p>
</Card>
```

---

## 4. Modal Component

### Component Overview
Overlay component for displaying content above the main interface, used for forms, confirmations, and detailed views.

### Props Interface
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'base' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
```

### Visual Specifications

#### Base Modal Structure
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
```

#### Sizes
```css
.modal-sm { max-width: 24rem; }
.modal-base { max-width: 32rem; }
.modal-lg { max-width: 48rem; }
.modal-xl { max-width: 64rem; }
.modal-full { 
  max-width: 95vw;
  max-height: 95vh;
}
```

### Usage Examples
```jsx
// Confirmation modal
<Modal
  open={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  size="sm"
  title="Delete Habit"
>
  <p>Are you sure you want to delete this habit? This action cannot be undone.</p>
  <ModalFooter>
    <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

---

## 5. Badge Component

### Component Overview
Small status indicator component for displaying streaks, categories, and other metadata.

### Props Interface
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'base' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}
```

### Visual Specifications
```css
.badge-base {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border-radius: var(--radius-full);
  font-weight: var(--font-medium);
  white-space: nowrap;
}

.badge-sm {
  padding: 0.125rem 0.5rem;
  font-size: var(--text-xs);
}

.badge-base {
  padding: 0.25rem 0.75rem;
  font-size: var(--text-sm);
}

.badge-success {
  background: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

.badge-warning {
  background: var(--warning-50);
  color: var(--warning-700);
  border: 1px solid var(--warning-200);
}
```

### Usage Examples
```jsx
// Streak badge
<Badge variant="success" icon={Flame}>
  7 days
</Badge>

// Category badge
<Badge variant="neutral">
  Health & Fitness
</Badge>
```

---

## 6. Progress Indicator Components

### Linear Progress
```typescript
interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'base' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}
```

### Circular Progress
```typescript
interface CircularProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'base' | 'lg' | 'xl';
  thickness?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  children?: React.ReactNode;
  className?: string;
}
```

### Usage Examples
```jsx
// Habit completion progress
<LinearProgress 
  value={75} 
  variant="success"
  showLabel
  label="3 of 4 habits completed"
/>

// Circular streak progress
<CircularProgress value={87} size="lg" showValue>
  <span className="text-center">
    <div className="font-bold">87%</div>
    <div className="text-sm text-neutral-500">Complete</div>
  </span>
</CircularProgress>
```

This component specification provides detailed technical requirements for implementing consistent, accessible, and responsive UI components that align with the design system and support all user story requirements.