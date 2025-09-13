# Mind Voyage Companion — System Requirements Specification (SRS)
**Version:** 1.0  
**Last Updated:** 2025-09-13  
**Document Owner:** Product (with Eng/Design co-owners)  
**Target Release Plan:** Phase 1 (MVP) → Phase 2 (Pro) → Phase 3 (Expansion)

---

## 0. Document Control
- **Stakeholders:** Founder/PO, Tech Lead, UX Lead, Data/Analytics, Support.
- **Review Cadence:** Weekly during implementation; mandatory update before each release cut.
- **Traceability:** Each Functional Requirement (FR) maps to Epics/Stories, Acceptance Criteria (AC), Tests, and Release Phase.

---

## 1. Product Overview
**Vision:** A privacy-first habit & journaling companion that helps users build routines, reflect with Stoic-inspired prompts, and improve English via “journal-as-language-learning.”  
**Primary Outcomes:** Higher consistency in habits; regular reflective writing; measurable personal growth.

**Core Loops:**
1) **Daily Check-in:** Users complete habit checklist → see streaks & micro-feedback.  
2) **Daily Reflection:** Users write a journal → receive prompts (and AI improvements if Pro).  
3) **Weekly Insight:** Users review trends → set intentions for next period.

**Business Model:** Freemium (core) + Pro subscription (AI features, analytics, visualizations, exports).

---

## 2. Scope
### 2.1 In Scope (Global)
- Multi-tenant web application (Next.js App Router).  
- Auth (email/password), profile, settings, timezone, language (EN/VI).  
- Habits (CRUD, schedule, streaks, logs) and Journals (CRUD, mood).  
- Stoic quotes & prompts (daily).  
- Dashboards & basic analytics.  
- Pro features: AI journaling, weekly AI reflection report, visualizations, export, billing.  
- Expansion: AI mentor persona, content packs, social/accountability (opt-in), PWA push.

### 2.2 Out of Scope (Initial)
- Native mobile app (PWA only).  
- Enterprise (SSO, org management).  
- Third-party social network integrations.

---

## 3. Personas & Target Users
- **Young Professionals (25–35):** Time-constrained; value structured nudges and quick insights.  
- **Students (18–25):** Study/fitness habits; need simple, free-first experience.  
- **Self-Growth Enthusiasts:** Care about Stoicism/mindfulness; willing to pay for depth and AI.

---

## 4. Assumptions
- Users will accept storing personal text in a secure, private system.  
- English is the target learning language for “journal-as-language-learning.”  
- Early scale is modest (≤10k MAU) and cost must stay ≤$150/month pre-Pro.

---

## 5. Constraints
- **Tech:** Next.js (App Router), TypeScript, Prisma, PostgreSQL, Azure (App Service, Key Vault, App Insights, Storage). Azure OpenAI for AI features.  
- **Time/Budget:** MVP in ≤3 months with 1–2 developers.  
- **Privacy-first:** No ads in Pro; no training on user data.

---

## 6. Success Metrics (KPIs/OKRs)
- **North Star:** Weekly Reflection Rate = % of active users who log ≥3 habit check-ins + ≥1 journal in a week.  
- **Activation:** ≥25% in Phase 1; **D7 Retention:** ≥25%.  
- **Monetization:** Free→Pro ≥3% by Phase 2; Pro D60 retention ≥70%.  
- **Cost:** AI+cloud ≤ $1.5 / Pro user / month; total ≤$150/m pre-Pro.

---

## 7. Epics & Features (MoSCoW + Release Phase)
### 7.1 Must-Have (Phase 1 — MVP)
- E1. Auth & Profile (email/password, reset).  
- E2. Habits: Create, schedule (daily/weekly/custom), toggle, streaks, history.  
- E3. Journals: Write, edit, delete; mood (1–5); search by date.  
- E4. Stoic Daily: Quote + reflection prompt; home surface.  
- E5. Dashboard: Streak tiles + mood trend (7/30 days).  
- E6. Settings: Timezone, language (EN/VI), email preferences.  
- E7. Basic analytics: Client/server events; basic charts.

### 7.2 Should-Have (Phase 2 — Pro)
- P1. AI Journaling: Translate/improve to English + explanations.  
- P2. Weekly AI Reflection Report (email + in-app).  
- P3. Visualizations: Habit Garden, Mood Galaxy (read-only).  
- P4. Data Export (CSV/JSON).  
- P5. Billing/Subscription management.

### 7.3 Could-Have (Phase 3 — Expansion)
- X1. AI Mentor Persona (Stoic/Productivity).  
- X2. Lifestyle Packs (prompts/habits).  
- X3. Social (opt-in, anonymous sharing, moderation).  
- X4. PWA push notifications.

### 7.4 Won’t-Have (Now)
- Native mobile, Enterprise SSO, public API marketplace.

---

## 8. Detailed Functional Requirements (FR) with Acceptance Criteria (AC)
> Notation: **FR-#** with phase tag `[P1]`, `[P2]`, `[P3]`. AC in Given/When/Then.  
> All FRs require: i18n-ready copy; server authz checks; telemetry events.

### FR-1 Auth & Profile [P1]
- **FR-1.1** Sign up with email/password; email verification optional in MVP.  
- **FR-1.2** Login/logout; session management; forgot/reset password.  
- **FR-1.3** Profile edit: name, timezone, language, preferences.
**AC:**
- Given valid credentials, When login, Then user session is created (httpOnly cookie).  
- Given mismatch password, When login, Then descriptive error with no sensitive detail.  
- Given profile update, When save, Then values persist and reflect on next request.  

### FR-2 Habits [P1]
- **FR-2.1** Create habit with title, frequency (daily/weekly/custom days), optional notes.  
- **FR-2.2** Toggle completion for a given day; create/update HabitLog.  
- **FR-2.3** Streaks auto-calculated (consecutive schedule-based days).  
- **FR-2.4** Archive/unarchive habits; pagination for lists.
**AC:**
- Given a habit, When toggled today, Then a log entry is created/updated and streak recalculated.  
- Given missed days, When viewing streak, Then it reflects schedule rules accurately.  

### FR-3 Journals [P1]
- **FR-3.1** Create, edit, delete journal entries.  
- **FR-3.2** Mood 1–5 optional; filter/search by date range; list view.  
- **FR-3.3** Word count; basic formatting (plain text MVP).
**AC:**
- Given a new journal, When saved, Then content persists with timestamp and mood (if provided).  
- Given a date filter, When applied, Then results reflect the range.  

### FR-4 Stoic Daily [P1]
- **FR-4.1** Daily quote & prompt selection (deterministic per day/user).  
- **FR-4.2** Cache daily content; refresh at local midnight.
**AC:**
- Given local date, When opening Home, Then the daily quote/prompt shows and is stable for the day.  

### FR-5 Dashboard [P1]
- **FR-5.1** Streak tiles for active habits; mood trend mini-chart (7/30 days).  
- **FR-5.2** Empty states guiding first actions.
**AC:**
- Given data exists, When opening Dashboard, Then streak/mood render in <300ms p95 (cached).  

### FR-6 Settings & Notifications [P1]
- **FR-6.1** Timezone & language.  
- **FR-6.2** Email preferences for weekly summary (MVP may be off).
**AC:**
- Given language=VI, When browsing, Then VI copy where available.  

### FR-7 AI Journaling [P2]
- **FR-7.1** Translate & improve to English with bullet-point explanations.  
- **FR-7.2** Quota & cost guardrails; show remaining quota to user.  
- **FR-7.3** Side-by-side editor (original vs improved); copy buttons.
**AC:**
- Given Pro & valid input, When clicking “Improve to English”, Then receive English output + explanations in ≤5s p95.  
- Given quota exceeded, When invoking, Then show paywall/upgrade prompt.  

### FR-8 Weekly AI Reflection [P2]
- **FR-8.1** Summarize weekly habits/moods/journal themes; 3 actionable suggestions.  
- **FR-8.2** Delivery: in-app view + optional email digest.
**AC:**
- Given ≥1 week data, When generating report, Then insights include trends and suggestions with links to set next focus.  

### FR-9 Visualizations [P2]
- **FR-9.1** Habit Garden mapping growth levels to streak lengths & recency.  
- **FR-9.2** Mood Galaxy mapping mood logs to constellations.
**AC:**
- Given enough data, When opening visualization, Then render <2s p95 and is interactive within 100ms.  

### FR-10 Export & Billing [P2]
- **FR-10.1** Export journals/habits to CSV/JSON (user-scoped).  
- **FR-10.2** Subscribe/cancel/change plan; billing history.
**AC:**
- Given export request, When confirmed, Then file is generated and available for secure download.  
- Given cancel subscription, When confirmed, Then access reverts at period end.

### FR-11 Mentor Persona & Packs [P3]
- **FR-11.1** Choose mentor persona (Stoic/Productivity); adapts prompts/tone.  
- **FR-11.2** Lifestyle packs catalog; install/uninstall; pack-scoped prompts.
**AC:**
- Given selected persona, When writing, Then prompts align with persona settings.  

### FR-12 Social & PWA Push [P3]
- **FR-12.1** Optional anonymous share with moderation pipeline.  
- **FR-12.2** PWA push notifications (where supported).
**AC:**
- Given anonymous toggle on, When posting, Then PII is redacted and content awaits moderation approval.  

---

## 9. Non-Functional Requirements (NFR)
### 9.1 Performance & Reliability
- FCP < 1.5s, TTI < 3s on mid devices for core pages; p95 API latency < 300ms for cached reads.  
- Availability 99.5% MVP; backups daily; RPO ≤ 24h, RTO ≤ 4h.

### 9.2 Scalability
- Horizontal app instances; DB scale-up to 2 vCores initially; partition `Event` table monthly.  
- Target 10k concurrent users read-heavy.

### 9.3 Security & Privacy
- HTTPS-only; secrets in Azure Key Vault; PII encrypted at rest.  
- RBAC: user/admin; per-tenant row scoping by `userId`.  
- AI vendor: do not train on user data; redact PII in prompts.  
- GDPR basics: export/delete account; consent banner for analytics.

### 9.4 Observability
- Application Insights traces; error rate <1%.  
- Web Vitals reporting; dashboards for activation, retention, conversion.

### 9.5 Accessibility & i18n
- WCAG 2.1 AA; keyboard navigation; ARIA labels; prefers-reduced-motion respected.  
- i18n EN/VI; all text through translation layer.

### 9.6 Maintainability & DevEx
- TypeScript strict; ESLint + Prettier; Husky pre-commit.  
- 80%+ unit test coverage for core logic; E2E on happy paths.

### 9.7 Cost
- Pre-Pro cloud+AI ≤ $150/m; Pro AI costs ≤ $1.5 per Pro/month; rate limits & quotas enforced.

---

## 10. Data Model (Authoritative Overview)
**User**(id UUID, email unique, password_hash, name, plan enum[free,pro], locale, tz, createdAt)  
**Habit**(id, userId FK→User, title, frequency enum[daily,weekly,custom], daysOfWeek int[], streak int, isArchived, createdAt)  
**HabitLog**(id, habitId FK, day date, value bool/int, note)  
**Journal**(id, userId FK, content text, mood int 1..5, language, createdAt)  
**Subscription**(id, userId FK, status enum[trial,active,canceled], provider, startedAt, renewedAt, canceledAt)  
**Event**(id, userId, name, properties JSONB, ts timestamptz)  

**Indexes:** FK indexes; (`userId`, `createdAt`) composites; monthly partition for Event.  
**Invariants:** logs belong to user via habit→user; journals immutable content history optional (v2).

---

## 11. API & Integration Requirements
- **Auth:** `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/reset`.  
- **Habits:** `GET/POST /api/habits`, `PATCH /api/habits/:id`, `POST /api/habits/:id/logs`.  
- **Journals:** `GET/POST /api/journals`, `PATCH/DELETE /api/journals/:id`.  
- **AI:** `POST /api/ai/translate` (Pro; quota).  
- **Stoic:** `GET /api/stoic/daily`.  
- **Export:** `POST /api/export` → async job + signed URL.  
- **Billing:** `/api/billing/*` + webhooks.  
- **Server Actions:** For form submissions where applicable; validate via Zod before DB.  
- **Errors:** JSON problem details; consistent error codes; rate limit responses (429).

---

## 12. UX & UI Requirements
- **Navigation:** Home (daily); Habits; Journal; Dashboard; Pro; Settings.  
- **Components:** shadcn/Radix; responsive (mobile-first); dark mode.  
- **Editor:** side-by-side (original vs improved) for AI (Phase 2).  
- **Empty States:** first-time guidance, templated copy.  
- **A11y:** focus management, visible focus ring, skip-to-content, ARIA labels.

---

## 13. AI Feature Requirements (Phase 2+)
- **Models:** Default small/affordable; escalate per Pro request.  
- **Prompting:** System prompt ensures privacy + no training; sanitize PII.  
- **Quotas:** Free: 0; Trial: 5/day; Pro: 100/day (configurable).  
- **Caching:** Same-input session caching; token accounting per user.  
- **Failure:** Timeouts fallback with friendly messaging; retry once.

---

## 14. Billing & Plans (Phase 2)
- **Plans:** Free vs Pro monthly; trial optional.  
- **Entitlements:** Feature flags gate AI, visualizations, export.  
- **Refunds/Cancellations:** Standard monthly pro-ration policy (configurable).  
- **Compliance:** Accurate invoices; webhook retries; idempotency keys.

---

## 15. Analytics & Telemetry
**Events:**  
- `user_registered`, `onboarding_completed`  
- `habit_created`, `habit_checked`  
- `journal_created`  
- `stoic_prompt_viewed`  
- `ai_translate_used` (tokens, latency, success)  
- `weekly_report_viewed`  
- `visualization_opened`  
- `pro_subscribed`, `pro_canceled`

**Dashboards:** Activation, Retention Cohorts, Conversion Funnel, Cost per Pro.  
**Privacy:** Consent flag gates analytics; opt-out respected.

---

## 16. Operations & Deployment
- **Envs:** dev → staging → prod (prod optional until PMF signals).  
- **CI/CD:** type-check, lint, test, build; preview per PR; auto deploy to staging on merge to `develop`.  
- **Migrations:** Prisma migrations; dry-run in staging; rollback plan.  
- **Feature Flags:** `dashboard_widgets`, `ai_journaling`, `weekly_report`, `viz_garden`, `viz_galaxy`, `export`, `mentor_persona`, `social_sharing`, `pwa_push`.  
- **Secrets:** in Key Vault; runtime config via env vars.  
- **Backups:** daily pg_dump; monthly restore drill.

---

## 17. Testing & QA
- **Unit:** logic (streak calc, quota calc).  
- **Component:** with React Testing Library; critical flows a11y checked.  
- **E2E:** Playwright for onboarding, habit flow, journal flow, Pro paywall.  
- **Contract:** Zod schemas for API; negative/edge-case tests.  
- **Load:** k6 smoke (200 RPS read-heavy 5 min); error rate <1%.  
- **Definition of Done:** AC met; tests passing; a11y/lighthouse budgets; observability hooked.

---

## 18. Risk Register & Mitigations
- **Low engagement:** Add micro-prompts; day-2 email; streak calendar.  
- **AI cost overrun:** quotas, caching, small model default, monitoring.  
- **Privacy concerns:** transparent policy, local export, no training on data.  
- **Scope creep:** strict phase gates, flags, MoSCoW adherence.

---

## 19. Phase Release Plan
- **Phase 1 (MVP, 6–10 weeks):** FR-1..6 with analytics & NFR baselines.  
- **Phase 2 (Pro, 6–8 weeks post-MVP):** FR-7..10; pricing experiments.  
- **Phase 3 (Expansion, 8–12 weeks post-P2):** FR-11..12; staged social beta.

**Cutlines:** If behind schedule, drop FR-6.2 (emails) from P1; defer Dashboard charts to 7-day only.

---

## 20. Glossary
- **Activation:** First 7d with ≥3 habit check-ins + ≥1 journal.  
- **Pro:** Paid subscription with AI features and advanced analytics.  
- **Habit Garden/Mood Galaxy:** Visual metaphors for progress/moods.  
- **RSC:** React Server Components.

---

## 21. Open Questions
- Should onboarding include recommended habit templates? (scope P1?)  
- What exact Pro price point for early international users?  
- Do we support markdown in journals at P1? (vs plain text)  
- Email verification timing (P1 or P2)?

---

## 22. Traceability Index (Starter)
| FR | Epic | Stories (ID placeholder) | AC | Tests | Phase |
|----|------|---------------------------|----|-------|-------|
| FR-1 | E1 | AUTH-01.. | ✓ | Unit+E2E | P1 |
| FR-2 | E2 | HAB-01.. | ✓ | Unit+E2E | P1 |
| FR-3 | E3 | JRN-01.. | ✓ | Unit+E2E | P1 |
| FR-4 | E4 | STO-01.. | ✓ | Unit | P1 |
| FR-5 | E5 | DASH-01.. | ✓ | E2E | P1 |
| FR-7 | P1 | AIJ-01.. | ✓ | Contract+E2E | P2 |
| FR-8 | P2 | WKR-01.. | ✓ | E2E | P2 |
| FR-9 | P3 | VIZ-01.. | ✓ | Perf | P2 |
| FR-10| P4 | EXP-01.. | ✓ | E2E | P2 |
| FR-11| X1 | MTR-01.. | ✓ | Unit | P3 |
| FR-12| X3 | SOC-01.. | ✓ | E2E | P3 |
