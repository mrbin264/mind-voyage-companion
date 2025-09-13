# Pro Features Layout Specifications (Desktop)

## 1. AI Journal Enhancement Interface (Desktop)

### Side-by-Side AI Editor Layout
```css
.ai-enhancement-page-desktop {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 0;
  max-width: none;
  height: calc(100vh - 4rem);
}

/* Original content editor */
.ai-editor-original {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-editor-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--neutral-200);
  background: var(--neutral-50);
}

.ai-editor-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-editor-badge {
  padding: 0.25rem 0.5rem;
  background: var(--primary-100);
  color: var(--primary-700);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.ai-editor-textarea {
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

/* Enhanced content display */
.ai-editor-enhanced {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--secondary-200);
}

.ai-enhanced-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--secondary-200);
  background: var(--secondary-50);
}

.ai-enhanced-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--secondary-800);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-spark-icon {
  color: var(--secondary-600);
}

.ai-enhanced-content {
  flex: 1;
  padding: 2rem;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--neutral-900);
  background: var(--secondary-25);
}

/* Enhancement controls */
.ai-enhancement-controls {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  z-index: 20;
}

.ai-control-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--neutral-300);
  background: white;
  color: var(--neutral-700);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
}

.ai-control-button:hover {
  border-color: var(--primary-300);
  color: var(--primary-700);
}

.ai-control-button.primary {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.ai-control-button.primary:hover {
  background: var(--primary-600);
}

/* Usage indicator */
.ai-usage-indicator {
  position: absolute;
  top: 1rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.ai-usage-count {
  font-weight: var(--font-semibold);
  color: var(--primary-600);
}
```

### AI Improvements Panel
```css
.ai-improvements-panel {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  width: 20rem;
  max-height: 70vh;
  overflow-y: auto;
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: 30;
}

.improvements-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--neutral-100);
  background: var(--neutral-50);
}

.improvements-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.improvements-subtitle {
  font-size: var(--text-sm);
  color: var(--neutral-600);
}

.improvements-list {
  padding: 1rem 0;
}

.improvement-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--neutral-100);
}

.improvement-item:last-child {
  border-bottom: none;
}

.improvement-type {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--secondary-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.improvement-change {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.improvement-before {
  padding: 0.5rem;
  background: var(--error-50);
  border-left: 3px solid var(--error-300);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-size: var(--text-sm);
  color: var(--error-800);
  position: relative;
}

.improvement-before::before {
  content: '−';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--error-500);
  font-weight: var(--font-bold);
}

.improvement-after {
  padding: 0.5rem;
  background: var(--success-50);
  border-left: 3px solid var(--success-300);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  font-size: var(--text-sm);
  color: var(--success-800);
  position: relative;
}

.improvement-after::before {
  content: '+';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--success-500);
  font-weight: var(--font-bold);
}

.improvement-explanation {
  font-size: var(--text-xs);
  color: var(--neutral-600);
  line-height: var(--leading-relaxed);
}
```

---

## 2. Weekly AI Reports Interface (Desktop)

### Reports Dashboard Layout
```css
.reports-page-desktop {
  display: grid;
  grid-template-columns: 16rem 1fr 20rem;
  gap: 2rem;
  padding: 0;
  max-width: none;
}

/* Reports navigation */
.reports-nav-sidebar {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
}

.reports-nav-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 1rem;
}

.reports-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.report-timeline-item {
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
  border: 1px solid transparent;
}

.report-timeline-item:hover {
  background: var(--neutral-50);
  border-color: var(--neutral-200);
}

.report-timeline-item.active {
  background: var(--primary-50);
  border-color: var(--primary-200);
}

.report-date-range {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--neutral-900);
  margin-bottom: 0.25rem;
}

.report-summary {
  font-size: var(--text-xs);
  color: var(--neutral-600);
}

/* Main report content */
.report-main-content {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.report-header {
  padding: 2rem;
  border-bottom: 1px solid var(--neutral-100);
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  color: white;
}

.report-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: 0.5rem;
}

.report-date-range-header {
  font-size: var(--text-base);
  opacity: 0.9;
}

.report-content {
  padding: 2rem;
}

/* Report sections */
.report-section {
  margin-bottom: 3rem;
}

.report-section:last-child {
  margin-bottom: 0;
}

.report-section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.report-section-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-600);
}

.report-section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
}

/* Metrics grid */
.report-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
}

.metric-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-600);
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: var(--text-sm);
  color: var(--neutral-600);
  font-weight: var(--font-medium);
}

/* Charts container */
.report-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.chart-container {
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  min-height: 16rem;
}

.chart-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 1rem;
  text-align: center;
}

/* AI insights section */
.ai-insights-section {
  background: var(--secondary-50);
  border: 2px solid var(--secondary-200);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin: 2rem 0;
}

.ai-insights-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.ai-insights-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--secondary-600);
}

.ai-insights-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--secondary-800);
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.insight-item {
  background: white;
  border: 1px solid var(--secondary-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.insight-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.insight-icon {
  width: 2rem;
  height: 2rem;
  background: var(--secondary-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-600);
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.insight-description {
  font-size: var(--text-sm);
  color: var(--neutral-700);
  line-height: var(--leading-relaxed);
  margin-bottom: 1rem;
}

.insight-action {
  padding: 0.5rem 1rem;
  background: var(--secondary-100);
  color: var(--secondary-700);
  border: 1px solid var(--secondary-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
}

.insight-action:hover {
  background: var(--secondary-200);
}

/* Report sidebar */
.report-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-actions-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.report-action-button {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  color: var(--neutral-700);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-150) var(--ease-out);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.report-action-button:hover {
  background: var(--neutral-100);
  border-color: var(--neutral-300);
}

.report-action-button:last-child {
  margin-bottom: 0;
}

/* Report preferences */
.report-preferences-widget {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.preference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--neutral-100);
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-label {
  font-size: var(--text-sm);
  color: var(--neutral-700);
}

.preference-toggle {
  width: 2.5rem;
  height: 1.25rem;
  background: var(--neutral-300);
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: background var(--duration-200) var(--ease-out);
}

.preference-toggle.active {
  background: var(--primary-500);
}

.preference-toggle::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background: white;
  border-radius: 50%;
  transition: transform var(--duration-200) var(--ease-out);
}

.preference-toggle.active::after {
  transform: translateX(1.25rem);
}
```

This Pro features layout specification provides comprehensive desktop interfaces for AI-enhanced journaling and weekly reports, optimized for desktop viewing with advanced functionality and sophisticated interactions.