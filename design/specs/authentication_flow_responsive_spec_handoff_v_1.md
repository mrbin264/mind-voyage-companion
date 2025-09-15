# Authentication Flow — Responsive Spec & Handoff (v1.0)

> **Scope:** Registration, Login, Password Reset (request + confirmation), Onboarding (Welcome → Profile → First Habit → Journal Intro → Complete). Desktop-first with Tablet/Mobile adaptations. Matches uploaded wireframes.

---

## 1) Breakpoints, Grid & Containers
- **Breakpoints** (match landing):
  - `desktop ≥ 1200px`
  - `tablet 768–1199px`
  - `mobile < 768px`
- **Container widths**
  - Desktop: `max 960–1040px` for auth forms; Onboarding may use `max 1040–1200px` depending on step.
  - Tablet: `max 720px`
  - Mobile: `full-bleed with 16px padding`.
- **Grid**
  - Desktop: 12-col grid, 72px gutter (landing standard). Auth screens commonly use 5/7 split.
  - Tablet/Mobile: single column stack.

---

## 2) Global UI Tokens (referenced by Components)
- **Type scale**: H1 56/64, H2 40/48, H3 28/36, Body 16/24, Small 14/20 (Inter). Quotes may use Spectral Italic.
- **Spacing scale (4pt base)**: 4,8,12,16,20,24,28,32,40,48,56,64,80.
- **Radius**: sm 8, md 12, lg 16, xl 24.
- **Shadows**: card `0 6 18 rgba(15,23,42,0.08)`, focus `0 0 0 4 rgba(109,90,229,0.25)`.
- **Colors** (light/dark semantic): bg, surface, text, textSubtle, border, cta, ctaText, success, warning, danger, info.
- **Focus**: visible focus ring on all interactive elements.

---

## 3) Core Components & States (Figma components + dev mapping)

### 3.1 Nav (Auth) — `mv/AuthNav`
- **Desktop**: Left logo+name, Right actions: `[Sign In]`, secondary link `[Help]` or `[Create Account]` depending on page.
- **Tablet/Mobile**: compact; mobile can show back caret and close (X) when used as modal.
- **Style**: bg=surface, bottom border 1px `border`.

### 3.2 Form Field — `mv/Form/Field`
- **Anatomy**: Label (Small), Input container (44–48px height), Helper/Message area.
- **States**
  - Default: border `border` / text `text` / placeholder `textSubtle`.
  - Hover: border darkens by one step.
  - Focus: border `cta` + focus ring (4px) using shadow token.
  - Error: border `danger`, icon + helper text in `danger`.
  - Success: border `success`, optional check icon.
  - Disabled: 40% opacity, no focus.
- **Types**: text, email, password (with reveal), select (timezone), checkbox, radio (rare), textarea.
- **Password strength**: inline meter 0–4 with labels (`Weak`→`Strong`).

### 3.3 Buttons — `mv/Button`
- Variants: Primary (cta), Secondary (bordered), Tertiary (link).
- Sizes: md (40px), lg (48px). Icon slot optional (20×20).
- Loading state: spinner left of label.

### 3.4 Banners & Toasts
- **Inline Banner**: info/success/warning/danger; icon + title + message; dismissible.
- **Toast**: bottom-right (desktop), full-width top (mobile). Auto-dismiss 4–6s.

### 3.5 Side Info Card — `mv/Auth/AsideCard`
- Used on desktop right column for benefits, testimonials, updates, security notes.

### 3.6 Progress Indicator — `mv/Progress/Steps`
- Dots or labeled steps `● ○ ○ ○` with step index.

---

## 4) Page Layouts & Responsive Rules

### 4.1 Registration
- **Desktop (5/7 split)**
  - Left (5): Form card (padding 24–32, radius lg). Title H2, subcopy Body.
  - Fields: Display Name, Email, Password, Confirm, Timezone select, checkboxes (TOS required, marketing optional).
  - CTA: `Create Account` (Primary, lg). Secondary link: `Already have an account? Sign in`.
  - Footer microcopy: security & privacy messages.
  - Right (7): `mv/Auth/AsideCard` with benefits + testimonial + “10,000+ users”.
- **Tablet**: Single column; Aside moves below form; reduce H2→H3, tighten gaps (–20%).
- **Mobile**: Single column; stack inputs, full-width CTAs, reduce padding to 16; alphabetic keyboard for email input on mobile.

### 4.2 Login
- **Desktop (5/7)**: Left form (Email, Password, keep-signed-in), Sign In; links: Forgot Password, Create Account; options row: SSO Login + Magic Link.
- **Tablet/Mobile**: Single column; SSO/Magic Link in a wrap row; keep-signed-in becomes a single checkbox row.

### 4.3 Password Reset (Request)
- **Desktop**: Left form (Email + Send Reset Link). Right panel: security info + password tips.
- **Tablet/Mobile**: Single column; keep the tips as collapsible accordions below form.

### 4.4 Password Reset (Confirmation)
- **Desktop**: Confirmation card with recipient email, Resend Email CTA, Back to Sign In.
- **Tablet/Mobile**: Single column; large emoji or illustration space can scale down.

### 4.5 Onboarding (4 steps)
- **Welcome**: Title H2 + bullets; actions: `Let's Start` (Primary) / `Take the Tour` (Secondary). Progress `● ○ ○ ○`.
- **Profile Setup**: Display Name, Timezone, Language, optional Daily Rhythm; `Continue`.
- **First Habit**: Grid of habit tiles with `Select` actions; selected summary + customizable reminder/frequency; `Create Habit`.
- **Journal Intro**: Prompt card + `Try Writing` CTA.
- **Complete** (separate final screen): Summary + `Go to Dashboard` and optional `Take a Quick Tour`.
- **Responsive**: Steps are single column on tablet/mobile; habit grid becomes 2-col on tablet, 1-col on mobile.

---

## 5) Validation, Loading & Error Patterns
- **Validation**: real-time on blur; email format; password strength; confirm password match; required checkbox for TOS.
- **Error placement**: field-level inline + form-level banner if submission fails.
- **Loading**: spinner inside primary button; disable other fields during network calls.
- **Success**: Registration → Onboarding Welcome; Login → App Dashboard; Reset Request → Reset Confirmation.

---

## 6) Accessibility (A11y)
- All labels bound to inputs (`for`/`id`); aria-invalid on error; aria-live polite for helper/errors.
- Focus order matches visual order; skip links on onboarding if long.
- Contrast ≥ 4.5:1 for text and 3:1 for UI controls.
- Touch targets ≥ 44×44; checkbox pairs label-clickable.

---

## 7) Dev Handoff — Tailwind/CSS Map (snippets)
- **Container**: `max-w-[1040px] mx-auto px-6 md:px-8`
- **Form Card**: `bg-[var(--mv-color-surface)] rounded-2xl shadow-[var(--mv-shadow-card)] border border-[var(--mv-color-border)] p-6 md:p-8`
- **Field**: `h-12 px-3 rounded-xl border outline-none focus:ring-4 focus:ring-[rgba(109,90,229,0.25)] focus:border-[var(--mv-color-cta)]`
- **Error text**: `text-[var(--mv-color-danger)] text-sm mt-1`
- **Primary btn**: `h-12 px-5 rounded-2xl bg-[var(--mv-color-cta)] text-white hover:opacity-95 disabled:opacity-50`
- **Secondary btn**: `h-12 px-5 rounded-2xl border`

---

## 8) Figma Build Notes
1. Create components listed above with Auto Layout; add Variant states (Default/Hover/Focus/Error/Disabled).
2. Use variables from `Color`, `Space`, `Radius`, `Shadow`, `Breakpoints` collections.
3. Build desktop frames first, then switch modes to `tablet` and `mobile` using component constraints.
4. Prototype: link CTAs (`Create Account`→Onboarding Welcome; `Send Reset Link`→Confirmation; `Forgot password?`→Reset Request).

---

## 9) Routes & Components (for FE)
- `/auth/register` → `AuthLayout` + `RegisterForm` + `AsideCard`
- `/auth/login` → `AuthLayout` + `LoginForm` + optional `AsideCard`
- `/auth/reset` → `AuthLayout` + `ResetForm`
- `/auth/reset/sent` → `AuthLayout` + `ResetSent`
- `/onboarding/*` → `OnboardingLayout` + `StepX` components

---

## 10) What’s included next
- Tokens JSON (light/dark, spacing, radius, type, shadows, breakpoints, component states) for direct import into FE and Tokens Studio.

