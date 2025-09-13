# Feature-Specific Component Specifications

## 1. Habit Tracker Components

### HabitCard Component
Desktop-optimized habit display and interaction component.

#### Props Interface
```typescript
interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'custom';
    schedule?: string[];
    currentStreak: number;
    longestStreak: number;
    completedToday: boolean;
    category?: string;
    createdAt: Date;
  };
  showDetails?: boolean;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  className?: string;
}
```

#### Desktop Layout Specifications
```css
/* Desktop-first habit card (1024px+) */
.habit-card-desktop {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  align-items: center;
  min-height: 5rem;
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-200) var(--ease-out);
}

.habit-card-desktop:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-200);
  transform: translateY(-1px);
}

/* Completion checkbox/button */
.habit-completion-button {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid var(--neutral-300);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-150) var(--ease-out);
}

.habit-completion-button.completed {
  background: var(--success-500);
  border-color: var(--success-500);
  color: white;
}

.habit-completion-button:hover {
  border-color: var(--success-500);
  background: var(--success-50);
}

/* Habit info section */
.habit-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0; /* Allow text truncation */
}

.habit-name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin: 0;
}

.habit-description {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  margin: 0;
}

.habit-schedule {
  font-size: var(--text-xs);
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Streak display */
.habit-streak {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 5rem;
}

.streak-number {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--secondary-600);
}

.streak-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--secondary-500);
}

.streak-label {
  font-size: var(--text-xs);
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Category badge */
.habit-category-badge {
  padding: 0.25rem 0.75rem;
  background: var(--neutral-100);
  color: var(--neutral-600);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  white-space: nowrap;
}

/* Actions dropdown */
.habit-actions {
  position: relative;
}

.habit-actions-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--neutral-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-150) var(--ease-out);
}

.habit-actions-button:hover {
  background: var(--neutral-100);
  color: var(--neutral-600);
}
```

### HabitGrid Component (Desktop)
Grid layout for displaying multiple habits with optimal desktop spacing.

#### Props Interface
```typescript
interface HabitGridProps {
  habits: Habit[];
  layout?: 'list' | 'grid' | 'compact';
  sortBy?: 'name' | 'streak' | 'created' | 'category';
  filterBy?: string;
  onHabitToggle: (habitId: string) => void;
  onHabitEdit: (habitId: string) => void;
  onHabitDelete: (habitId: string) => void;
  className?: string;
}
```

#### Desktop Layout
```css
/* Desktop habit grid (1024px+) */
.habit-grid-desktop {
  display: grid;
  gap: 1rem;
  padding: 2rem;
}

.habit-grid-list {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.habit-grid-cards {
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  gap: 1.5rem;
}

.habit-grid-compact {
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .habit-grid-cards {
    grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  }
}
```

---

## 2. Journal Editor Components

### JournalEditor Component (Desktop)
Rich text editor optimized for desktop journaling experience.

#### Props Interface
```typescript
interface JournalEditorProps {
  content: string;
  placeholder?: string;
  mood?: number; // 1-5 scale
  wordCount?: number;
  targetWordCount?: number;
  autosave?: boolean;
  showWordCount?: boolean;
  showMoodSelector?: boolean;
  onChange: (content: string) => void;
  onMoodChange?: (mood: number) => void;
  onSave: () => void;
  className?: string;
}
```

#### Desktop Layout Specifications
```css
/* Desktop journal editor (1024px+) */
.journal-editor-desktop {
  display: grid;
  grid-template-columns: 1fr 20rem;
  gap: 2rem;
  padding: 2rem;
  min-height: 32rem;
}

/* Main editor area */
.journal-editor-main {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.journal-editor-header {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  background: var(--neutral-50);
}

.journal-editor-date {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
}

.journal-editor-prompt {
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--primary-50);
  border-left: 4px solid var(--primary-300);
  font-style: italic;
  color: var(--primary-800);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

/* Text editor area */
.journal-textarea {
  width: 100%;
  min-height: 20rem;
  padding: 2rem;
  border: none;
  outline: none;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--neutral-900);
  resize: vertical;
  font-family: var(--font-sans);
}

.journal-textarea::placeholder {
  color: var(--neutral-400);
  font-style: italic;
}

/* Sidebar */
.journal-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Mood selector */
.mood-selector-desktop {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.mood-selector-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.mood-options {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.mood-option {
  width: 3rem;
  height: 3rem;
  border: 2px solid var(--neutral-200);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all var(--duration-150) var(--ease-out);
}

.mood-option:hover {
  border-color: var(--primary-300);
  transform: scale(1.1);
}

.mood-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
  transform: scale(1.15);
}

/* Word count and stats */
.journal-stats {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.journal-stats-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-100);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--neutral-900);
}

/* Actions bar */
.journal-actions {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## 3. Dashboard Components

### DashboardGrid Component (Desktop)
Main dashboard layout with optimal desktop spacing and widget arrangement.

#### Props Interface
```typescript
interface DashboardGridProps {
  user: User;
  habits: Habit[];
  recentEntries: JournalEntry[];
  moodData: MoodData;
  streakData: StreakData;
  layout?: 'default' | 'compact' | 'detailed';
  className?: string;
}
```

#### Desktop Layout Specifications
```css
/* Desktop dashboard grid (1024px+) */
.dashboard-grid-desktop {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .dashboard-grid-desktop {
    grid-template-columns: 2fr 1fr 1fr;
    padding: 3rem 2rem;
  }
  
  .dashboard-welcome {
    grid-column: 1 / -1;
  }
  
  .dashboard-habits {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
  }
  
  .dashboard-mood {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
  
  .dashboard-journal {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
  }
  
  .dashboard-stats {
    grid-column: 2 / -1;
    grid-row: 3 / 4;
  }
}
```

### DashboardWidget Component
```typescript
interface DashboardWidgetProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'small' | 'medium' | 'large' | 'full';
  children: React.ReactNode;
  className?: string;
}
```

#### Widget Layouts
```css
.dashboard-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--duration-200) var(--ease-out);
}

.dashboard-widget:hover {
  box-shadow: var(--shadow-md);
}

.widget-header {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.widget-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.widget-subtitle {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  margin-top: 0.25rem;
}

.widget-content {
  padding: 2rem;
}

.widget-action {
  font-size: var(--text-sm);
  color: var(--primary-600);
  text-decoration: none;
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color var(--duration-150) var(--ease-out);
}

.widget-action:hover {
  color: var(--primary-700);
}
```

---

## 4. Navigation Components

### DesktopNavigation Component
Top navigation bar optimized for desktop with full menu visibility.

#### Props Interface
```typescript
interface DesktopNavigationProps {
  user: User;
  currentPath: string;
  notifications?: Notification[];
  onLogout: () => void;
  className?: string;
}
```

#### Desktop Layout
```css
/* Desktop navigation (1024px+) */
.desktop-navigation {
  position: sticky;
  top: 0;
  z-index: 40;
  background: white;
  border-bottom: 1px solid var(--neutral-200);
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

/* Logo and brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.nav-logo {
  width: 2rem;
  height: 2rem;
  color: var(--primary-600);
}

.nav-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--neutral-900);
}

/* Main navigation menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--neutral-600);
  transition: all var(--duration-150) var(--ease-out);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.nav-link.active {
  color: var(--primary-700);
  background: var(--primary-100);
}

/* User actions */
.nav-user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-notifications {
  position: relative;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--neutral-600);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
}

.nav-notifications:hover {
  background: var(--neutral-100);
  color: var(--neutral-800);
}

.notification-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--error-500);
  border-radius: 50%;
  border: 1px solid white;
}

/* User dropdown */
.nav-user-dropdown {
  position: relative;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--primary-100);
  color: var(--primary-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
}

.user-avatar:hover {
  background: var(--primary-200);
}
```

This desktop-focused component specification provides optimized layouts and interactions for larger screens, taking advantage of the additional space and different interaction patterns typical on desktop devices.