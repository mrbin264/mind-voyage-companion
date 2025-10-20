# T032: Animation Optimization for 60fps Performance

**Date:** October 20, 2025
**Task Reference:** T032 (Section 3.7 Performance Optimization)
**Status:** 🔄 IN PROGRESS
**Branch:** 003-enhance

---

## 📊 Overview

Optimize all animations to achieve consistent 60fps performance by:

1. Replacing `transition-all` with specific properties
2. Using only `transform` and `opacity` for animations (GPU-accelerated)
3. Converting width/height transitions to `transform: scaleX/scaleY`
4. Adding `will-change` hints for frequently animated elements

---

## 🔍 Current State Analysis

### Files with `transition-all` (Priority Order)

#### **HIGH PRIORITY - Forms & Inputs (20+ instances)**

- `src/components/dashboard/HabitForm.tsx` - 20 instances
  - Input fields (border, ring focus states)
  - Buttons (background colors on hover)
  - Color picker (border states)

#### **HIGH PRIORITY - Progress Bars (4 instances)**

- `src/components/dashboard/DashboardContent.tsx` - 1 instance (line 302)
- `src/components/dashboard/sections/WeeklyProgressSection.tsx` - 1 instance (line 33)
- `src/components/dashboard/WeeklyProgressChart.tsx` - 1 instance (line 106)
- `src/components/dashboard/analytics/Charts.tsx` - 2 instances (lines 43, 129)

**Issue:** Using width transitions triggers layout/paint cycles (not GPU-accelerated)
**Solution:** Use `transform: scaleX()` with `transform-origin: left`

#### **MEDIUM PRIORITY - Layout Components**

- `src/components/layout/Sidebar.tsx` - 3 instances
  - Sidebar collapse/expand (duration-300)
  - Navigation item hover states (duration-200)
  - Upgrade button hover (duration-200)

- `src/components/layout/DashboardLayout.tsx` - 2 instances
  - Toggle button hover (duration-200)
  - Search input focus (duration-200)

- `src/components/layout/MobileNav.tsx` - 3 instances
  - Tab transitions (duration-200)
  - Icon transitions (duration-300, 2 instances)

#### **MEDIUM PRIORITY - Dashboard Widgets**

- `src/components/ui/widget-card.tsx` - 1 instance (duration-200)
- `src/components/dashboard/StreakCard.tsx` - 1 instance (hover effect)
- `src/components/dashboard/QuickStatsWidget.tsx` - 1 instance (hover effect)

#### **LOW PRIORITY - Auth/Onboarding**

- `src/components/onboarding/OnboardingLayout.tsx` - 2 instances
- `src/components/auth/PasswordResetConfirmForm.tsx` - 2 instances
- `src/components/dashboard/profile/AvatarUpload.tsx` - 1 instance

#### **GLOBAL CSS**

- `src/app/globals.css` - 3 instances
  - Line 323: `@apply transition-all`
  - Line 326: `@apply hover:shadow-lg hover:-translate-y-0.5 transition-all`
  - Line 381: Input utility class
  - Line 386: Input utility class (light mode)

---

## 🎯 Optimization Strategy

### 1. Input Fields & Buttons

**Current (Bad):**

```tsx
className = '... focus:border-blue-500 focus:ring-2 transition-all'
```

**Optimized (Good):**

```tsx
className =
  '... focus:border-blue-500 focus:ring-2 transition-[border-color,box-shadow] duration-200'
```

**Why:** Only transitions the properties that actually change (border-color, box-shadow for ring)

### 2. Progress Bars

**Current (Bad):**

```tsx
<div
  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
  style={{ width: `${percentage}%` }}
/>
```

**Optimized (Good):**

```tsx
<div className="h-2 rounded-full overflow-hidden">
  <div
    className="bg-blue-500 h-full origin-left transition-transform duration-300"
    style={{ transform: `scaleX(${percentage / 100})` }}
  />
</div>
```

**Why:**

- `scaleX` is GPU-accelerated (composite layer)
- Width transitions trigger layout/paint (CPU-bound)
- Can achieve 60fps even with large DOMs

### 3. Hover Effects

**Current (Bad):**

```tsx
className = 'hover:bg-white/5 transition-all'
```

**Optimized (Good):**

```tsx
className = 'hover:bg-white/5 transition-colors duration-200'
```

**Why:** Only background-color changes, so only transition colors

### 4. Transform Animations

**Current (Good - Keep):**

```tsx
className = 'hover:scale-105 transition-transform'
```

**Enhanced (Better):**

```tsx
className =
  'hover:scale-105 transition-transform duration-200 will-change-transform'
```

**Why:** `will-change: transform` creates composite layer for frequently animated elements

### 5. Sidebar Collapse/Expand

**Current:**

```tsx
className = 'transition-all duration-300' // width changes
```

**Optimized:**

```tsx
className = 'transition-[width,padding] duration-300 will-change-[width]'
```

**Why:** Sidebar width change is necessary, but should be specific. Add will-change for composite layer.

---

## 📝 Implementation Checklist

### Phase 1: High Priority (Forms & Progress Bars)

- [ ] **HabitForm.tsx** - Replace 20 instances
  - [ ] Input fields: `transition-[border-color,box-shadow]`
  - [ ] Buttons: `transition-colors`
  - [ ] Color picker: `transition-[border-color]`

- [ ] **Progress Bars** - Convert to scaleX
  - [ ] DashboardContent.tsx (line 302)
  - [ ] WeeklyProgressSection.tsx (line 33)
  - [ ] WeeklyProgressChart.tsx (line 106)
  - [ ] Charts.tsx (lines 43, 129)

### Phase 2: Medium Priority (Layout Components)

- [ ] **Sidebar.tsx**
  - [ ] Collapse/expand: `transition-[width,padding]` + `will-change-[width]`
  - [ ] Nav items: `transition-colors`
  - [ ] Upgrade button: `transition-colors`

- [ ] **DashboardLayout.tsx**
  - [ ] Toggle button: `transition-colors`
  - [ ] Search input: `transition-[border-color,box-shadow]`

- [ ] **MobileNav.tsx**
  - [ ] Tab transitions: `transition-colors`
  - [ ] Icon transitions: `transition-opacity`

- [ ] **Widget Components**
  - [ ] widget-card.tsx: `transition-[border-color,box-shadow]`
  - [ ] StreakCard.tsx: `transition-colors`
  - [ ] QuickStatsWidget.tsx: `transition-[border-color]`

### Phase 3: Global CSS Updates

- [ ] **globals.css**
  - [ ] Line 323: Remove `transition-all`, create specific utility
  - [ ] Line 326: Keep `-translate-y-0.5`, change shadow to `transition-[transform,box-shadow]`
  - [ ] Lines 381, 386: Update input utilities to `transition-[border-color,background-color,box-shadow]`

### Phase 4: will-change Optimization

- [ ] **Sidebar.tsx** - `will-change-[width]` during transitions
- [ ] **MobileNav.tsx** - `will-change-transform` for icon rotations
- [ ] **Modals/Overlays** - `will-change-[opacity,transform]` when opening
- [ ] **Progress Bars** - `will-change-transform` for active animations

---

## 🎨 Animation Performance Best Practices

### ✅ DO (GPU-Accelerated)

- `transform: translate/scale/rotate`
- `opacity`
- `filter` (with caution)

### ❌ DON'T (Triggers Layout/Paint)

- `width/height`
- `top/left/right/bottom`
- `padding/margin`
- `border-width`

### 🔧 Specific Property Transitions

- Border changes: `transition-[border-color]`
- Background: `transition-[background-color]`
- Focus rings: `transition-[box-shadow]`
- Multiple: `transition-[property1,property2]`

### ⚡ will-change Usage

**When to use:**

- Elements that animate frequently (>3x per session)
- Sidebar toggles, modals, dropdowns
- Progress bars during active updates

**When NOT to use:**

- Static elements
- One-time animations
- Elements that rarely animate

**Syntax:**

```tsx
// During animation
className="will-change-transform"

// Or programmatically
style={{ willChange: isAnimating ? 'transform' : 'auto' }}
```

---

## 📊 Expected Performance Improvements

### Before (transition-all)

- **Frame Rate:** 30-45 fps (drops during complex animations)
- **Paint Time:** 8-15ms per frame
- **Composite Time:** 2-5ms per frame
- **Jank:** Noticeable on progress bar updates

### After (Specific Properties)

- **Frame Rate:** 60 fps consistent
- **Paint Time:** 1-3ms per frame
- **Composite Time:** <1ms per frame
- **Jank:** None - smooth animations

### Key Metrics to Monitor

- Chrome DevTools > Performance
  - Frame rate stays at 60fps
  - No long tasks during animations
  - Minimal paint/layout work

- Lighthouse Performance Score
  - First Input Delay (FID) improvement
  - Cumulative Layout Shift (CLS) reduction

---

## 🧪 Testing Strategy

### 1. Visual Testing

```bash
pnpm dev
```

Test each component:

- [ ] HabitForm: Focus states, button hovers
- [ ] Progress bars: Smooth width updates
- [ ] Sidebar: Collapse/expand smoothness
- [ ] Hover effects: No jank on rapid hover
- [ ] Mobile nav: Tab switching smoothness

### 2. Performance Profiling

**Chrome DevTools:**

1. Open DevTools > Performance
2. Start recording
3. Interact with animated elements
4. Stop recording
5. Verify:
   - Frame rate at 60fps (green bars)
   - No red/yellow long tasks
   - Minimal layout/paint work

**Lighthouse:**

```bash
# Run Lighthouse in incognito
lighthouse http://localhost:3000/dashboard --view
```

Verify scores:

- Performance: >90
- No "Avoid non-composited animations" warnings

### 3. Build Verification

```bash
pnpm build
pnpm start
```

Test production build for:

- Animation smoothness maintained
- No console warnings
- Bundle size unchanged

---

## 📁 Files to Modify

### Component Files (15 files)

1. src/components/dashboard/HabitForm.tsx
2. src/components/dashboard/DashboardContent.tsx
3. src/components/dashboard/sections/WeeklyProgressSection.tsx
4. src/components/dashboard/WeeklyProgressChart.tsx
5. src/components/dashboard/analytics/Charts.tsx
6. src/components/layout/Sidebar.tsx
7. src/components/layout/DashboardLayout.tsx
8. src/components/layout/MobileNav.tsx
9. src/components/ui/widget-card.tsx
10. src/components/dashboard/StreakCard.tsx
11. src/components/dashboard/QuickStatsWidget.tsx
12. src/components/onboarding/OnboardingLayout.tsx
13. src/components/auth/PasswordResetConfirmForm.tsx
14. src/components/dashboard/profile/AvatarUpload.tsx

### Global Files (1 file)

15. src/app/globals.css

---

## ✅ Success Criteria

- [ ] All `transition-all` instances replaced with specific properties
- [ ] All progress bars use `scaleX` instead of width
- [ ] Frequently animated elements have `will-change` hints
- [ ] Production build succeeds
- [ ] Chrome DevTools shows 60fps during all animations
- [ ] No layout/paint during transform/opacity animations
- [ ] Lighthouse Performance score >90

---

## 📝 Implementation Notes

### Progress Bar Pattern

**HTML Structure:**

```tsx
{
  /* Outer container - fixed size, no transitions */
}
;<div className="h-2 rounded-full bg-gray-700 overflow-hidden">
  {/* Inner bar - transform only */}
  <div
    className="h-full bg-blue-500 origin-left transition-transform duration-300"
    style={{ transform: `scaleX(${progress / 100})` }}
  />
</div>
```

**Why this works:**

1. Outer container provides rounded corners and background
2. `overflow-hidden` clips the scaled inner element
3. `origin-left` makes scale start from left edge
4. Transform is GPU-accelerated (composite layer)
5. No layout/paint - only composite layer updates

### Transition Property Syntax

**Single property:**

```tsx
transition - colors // background-color, border-color, color
transition - opacity // opacity
transition - transform // transform
transition - shadow // box-shadow
```

**Multiple properties:**

```tsx
transition - [border - color, box - shadow]
transition - [transform, opacity]
transition - [background - color, border - color]
```

**With duration:**

```tsx
transition-colors duration-200
transition-transform duration-300
```

---

## 🚀 Next Steps After T032

**T033: Setup Lighthouse CI**

- Configure Lighthouse CI in repository
- Set performance budgets
- Add CI pipeline integration

**T034: Performance Validation**

- Run Lighthouse CI
- Validate metrics (FCP < 1.8s, LCP < 2.5s, TTI < 3.8s)
- Generate performance report

---

## 📊 Implementation Progress

**Status:** Phase 1 - Planning Complete
**Next Action:** Start with HabitForm.tsx (20 instances)
**Estimated Time:** 2-3 hours total

- Phase 1: 1 hour (forms + progress bars)
- Phase 2: 45 minutes (layout components)
- Phase 3: 30 minutes (global CSS + testing)
