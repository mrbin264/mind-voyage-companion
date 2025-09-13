# Desktop-First Page Layout Specifications

## 1. Application Shell Layout

### Main Layout Structure (Desktop 1024px+)
The application shell provides the foundation for all pages with consistent navigation and content areas.

#### Layout Grid System
```css
/* Desktop application shell */
.app-shell-desktop {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 16rem 1fr 20rem;
  grid-template-rows: 4rem 1fr auto;
  min-height: 100vh;
  background: var(--neutral-50);
}

/* Large desktop (1280px+) */
@media (min-width: 1280px) {
  .app-shell-desktop {
    grid-template-columns: 18rem 1fr 24rem;
  }
}

/* Extra large desktop (1536px+) */
@media (min-width: 1536px) {
  .app-shell-desktop {
    grid-template-columns: 20rem 1fr 28rem;
    max-width: 1600px;
    margin: 0 auto;
  }
}

.app-header {
  grid-area: header;
  background: white;
  border-bottom: 1px solid var(--neutral-200);
  box-shadow: var(--shadow-sm);
  z-index: 40;
}

.app-sidebar {
  grid-area: sidebar;
  background: white;
  border-right: 1px solid var(--neutral-200);
  overflow-y: auto;
}

.app-main {
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
  max-width: none;
}

.app-aside {
  grid-area: aside;
  background: white;
  border-left: 1px solid var(--neutral-200);
  padding: 1.5rem;
  overflow-y: auto;
}

.app-footer {
  grid-area: footer;
  background: white;
  border-top: 1px solid var(--neutral-200);
  padding: 1rem 2rem;
  text-align: center;
  font-size: var(--text-sm);
  color: var(--neutral-600);
}
```

### Sidebar Navigation (Desktop)
```css
.sidebar-navigation {
  padding: 1.5rem;
  height: 100%;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section-title {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  padding: 0 0.75rem;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--neutral-700);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--duration-150) var(--ease-out);
  margin-bottom: 0.25rem;
}

.sidebar-nav-item:hover {
  background: var(--neutral-100);
  color: var(--neutral-900);
}

.sidebar-nav-item.active {
  background: var(--primary-100);
  color: var(--primary-800);
}

.sidebar-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.sidebar-nav-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  background: var(--neutral-200);
  color: var(--neutral-600);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.sidebar-nav-item.active .sidebar-nav-badge {
  background: var(--primary-200);
  color: var(--primary-800);
}
```

---

## 2. Dashboard Layout (Desktop)

### Main Dashboard Page
```css
.dashboard-page-desktop {
  padding: 0;
  max-width: none;
}

.dashboard-header {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
  padding: 3rem 2rem;
  margin: -2rem -2rem 2rem;
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
}

.dashboard-greeting {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: 0.5rem;
}

.dashboard-date {
  font-size: var(--text-lg);
  opacity: 0.9;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Large desktop adjustments */
@media (min-width: 1280px) {
  .dashboard-content {
    grid-template-columns: 2fr 1fr;
  }
}

.dashboard-main-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Today's Quote Widget */
.daily-quote-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.daily-quote-widget::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-500), var(--secondary-500));
}

.quote-text {
  font-size: var(--text-xl);
  font-style: italic;
  color: var(--neutral-800);
  line-height: var(--leading-relaxed);
  margin-bottom: 1rem;
}

.quote-author {
  font-size: var(--text-base);
  color: var(--neutral-600);
  font-weight: var(--font-medium);
}

/* Habits Overview Widget */
.habits-overview-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.habits-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--neutral-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.habits-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
}

.habits-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.habits-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.habit-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--neutral-100);
  transition: background var(--duration-150) var(--ease-out);
}

.habit-list-item:hover {
  background: var(--neutral-50);
}

.habit-list-item:last-child {
  border-bottom: none;
}

.habit-checkbox {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--neutral-300);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-150) var(--ease-out);
}

.habit-checkbox.completed {
  background: var(--success-500);
  border-color: var(--success-500);
  color: white;
}

.habit-info {
  flex: 1;
  min-width: 0;
}

.habit-name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--neutral-900);
  margin: 0 0 0.25rem;
}

.habit-streak {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.streak-flame {
  color: var(--secondary-500);
}
```

---

## 3. Habits Page Layout (Desktop)

### Habits Management Interface
```css
.habits-page-desktop {
  display: grid;
  grid-template-columns: 1fr 20rem;
  gap: 2rem;
  padding: 0;
  max-width: none;
}

.habits-main {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.habits-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Habits header with controls */
.habits-page-header {
  padding: 2rem;
  border-bottom: 1px solid var(--neutral-100);
  background: var(--neutral-50);
}

.habits-header-content {
  display: flex;
  align-items: center;
  justify-content: between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.habits-page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--neutral-900);
}

.habits-actions {
  display: flex;
  gap: 1rem;
}

/* Filter and sort controls */
.habits-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.habits-search {
  flex: 1;
  max-width: 20rem;
}

.habits-view-toggle {
  display: flex;
  background: var(--neutral-100);
  border-radius: var(--radius-lg);
  padding: 0.25rem;
}

.view-toggle-button {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--neutral-600);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
}

.view-toggle-button.active {
  background: white;
  color: var(--neutral-900);
  box-shadow: var(--shadow-sm);
}

/* Habits list area */
.habits-list-container {
  padding: 2rem;
}

.habits-empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--neutral-500);
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: var(--neutral-300);
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: var(--text-base);
  margin-bottom: 1.5rem;
}

/* Sidebar widgets */
.habits-stats-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.stats-widget-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
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
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
}

.streak-stat {
  color: var(--secondary-600);
}
```

---

## 4. Journal Page Layout (Desktop)

### Journal Interface
```css
.journal-page-desktop {
  display: grid;
  grid-template-columns: 16rem 1fr 20rem;
  gap: 2rem;
  padding: 0;
  max-width: none;
  height: calc(100vh - 4rem);
}

/* Journal navigation sidebar */
.journal-nav-sidebar {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  overflow-y: auto;
}

.journal-nav-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.journal-entry-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.journal-entry-item {
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
  border: 1px solid transparent;
}

.journal-entry-item:hover {
  background: var(--neutral-50);
  border-color: var(--neutral-200);
}

.journal-entry-item.active {
  background: var(--primary-50);
  border-color: var(--primary-200);
  color: var(--primary-800);
}

.journal-entry-date {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: 0.25rem;
}

.journal-entry-preview {
  font-size: var(--text-xs);
  color: var(--neutral-600);
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.journal-entry-mood {
  margin-left: auto;
  font-size: 1rem;
}

/* Main editor area */
.journal-editor-area {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.journal-editor-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--neutral-100);
  background: var(--neutral-50);
}

.journal-entry-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.journal-entry-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.journal-word-count {
  margin-left: auto;
  font-weight: var(--font-medium);
}

/* Editor content */
.journal-editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.journal-prompt-section {
  padding: 1.5rem 2rem;
  background: var(--primary-50);
  border-bottom: 1px solid var(--primary-100);
}

.journal-prompt-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--primary-800);
  margin-bottom: 0.5rem;
}

.journal-prompt-text {
  font-size: var(--text-base);
  color: var(--primary-700);
  font-style: italic;
  line-height: var(--leading-relaxed);
}

.journal-editor-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  padding: 2rem;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--neutral-900);
  font-family: var(--font-sans);
  resize: none;
}

/* Journal sidebar */
.journal-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Mood selector widget */
.journal-mood-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.mood-widget-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 1rem;
  text-align: center;
}

.mood-selector-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.mood-option {
  aspect-ratio: 1;
  border: 2px solid var(--neutral-200);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all var(--duration-200) var(--ease-out);
}

.mood-option:hover {
  border-color: var(--primary-300);
  transform: scale(1.1);
}

.mood-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
  transform: scale(1.2);
}

/* Statistics widget */
.journal-stats-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}
```

This desktop-first layout specification provides comprehensive coverage of major page layouts optimized for desktop viewing and interaction patterns, taking full advantage of available screen real estate and typical desktop user behaviors.