<!--
SYNC IMPACT REPORT - Constitution Update
===========================================
Version Change: NONE → 1.0.0
Rationale: Initial constitution establishment for Mind Voyage Companion project

Principles Established:
- I. Privacy-First Architecture
- II. TypeScript Strict Mode & Type Safety
- III. Test-Driven Development
- IV. Component-Based Architecture
- V. Performance & Accessibility Standards
- VI. Dark Theme Design System
- VII. MongoDB Architecture Patterns

Sections Created:
- Core Principles (7 principles)
- Technical Standards
- Development Workflow
- Governance

Templates Requiring Updates:
✅ plan-template.md - Constitution Check section already references constitution file
✅ spec-template.md - Requirements structure aligns with constitution principles
✅ tasks-template.md - Task categorization supports principle-driven development
✅ .github/copilot-instructions.md - Already documented and aligned with constitution

Follow-up Actions:
- None - all templates and documentation are aligned

Change Classification: MINOR (1.0.0)
- Initial establishment of governance framework
- Seven foundational principles defined
- No prior version to maintain compatibility with
===========================================
-->

# Mind Voyage Companion Constitution

## Core Principles

### I. Privacy-First Architecture

All features MUST prioritize user privacy and data protection:

- User data stored locally with explicit user control over cloud sync
- No third-party analytics, tracking, or data monetization
- Dual database clients (NextAuth + Mongoose) maintain separate, secure connection pools
- Authentication via JWT with secure cookie storage
- Middleware (`src/middleware.ts`) enforces route protection for `/dashboard/*` paths

**Rationale**: Users trust us with personal habit tracking, journaling, and reflection data. Privacy is non-negotiable and forms the foundation of user trust and product differentiation.

### II. TypeScript Strict Mode & Type Safety

All code MUST use TypeScript with strict mode enabled:

- Strict mode enforced in `tsconfig.json`
- Explicit type definitions in `src/types/*` for all domain entities (habits, journals, analytics)
- No `any` types without explicit justification and inline comment
- Import aliases via `@/` for all internal imports to maintain clarity
- Props interfaces required for all components
- Zod schemas for runtime validation at API boundaries

**Rationale**: Type safety prevents runtime errors, improves developer experience, enables confident refactoring, and serves as living documentation for the codebase.

### III. Test-Driven Development

Testing requirements vary by development phase:

- **Phase 1 (MVC-001)**: TDD deferred, configuration established
- **Phase 2+ (MVC-002 onwards)**: TDD MANDATORY for new features
- Test hierarchy: Unit tests (Vitest) → Integration tests → E2E tests (Playwright)
- Red-Green-Refactor cycle: Write test → Verify failure → Implement → Verify pass → Refactor
- Critical logic and components MUST have test coverage
- Tests co-located with source code where appropriate

**Rationale**: Early stage prioritizes product-market fit and rapid iteration. Post-MVP, tests ensure reliability, enable safe refactoring, and document expected behavior.

### IV. Component-Based Architecture

UI MUST follow established component patterns:

- **Server Components** (default): Data fetching, static content, heavy logic
- **Client Components**: Mark with `'use client'` for interactivity, hooks, browser APIs
- Never use `next/dynamic` with `{ ssr: false }` in Server Components (not supported)
- Reusable components in `src/components/`, route-specific components in route folders
- Custom hooks in `src/hooks/` for shared logic (e.g., `useHabits`, `useSettings`)
- PascalCase for components, camelCase for hooks, kebab-case for folders

**Rationale**: Clear component boundaries improve maintainability, enable parallel development, facilitate testing, and align with Next.js 15 App Router best practices.

### V. Performance & Accessibility Standards

All features MUST meet performance and accessibility requirements:

- **Accessibility**: WCAG 2.1 AA compliance mandatory
  - Semantic HTML required
  - ARIA attributes for dynamic content
  - Keyboard navigation support
  - Screen reader compatibility tested
- **Performance**:
  - Built-in Next.js Image and Font optimization MUST be used
  - Suspense boundaries for async data loading
  - Server Components for heavy logic to minimize client bundle
  - MongoDB queries optimized (no N+1 patterns)
- **Metrics**: 99.5% availability target, <200ms p95 response time

**Rationale**: Inclusive design reaches wider audiences. Performance directly impacts user retention and satisfaction, particularly on mobile devices and slower connections.

### VI. Dark Theme Design System

All UI MUST adhere to the established dark theme:

- **Color Palette**:
  - Primary Background: `#0A0A0A` (body)
  - Sidebar Background: `#101010`
  - Card Background: `#18181B` (zinc-900)
  - Border: `border-white/10`
- **Component Standards**:
  - Use `WidgetCard` component for dashboard cards
  - Typography escaping: `&ldquo;`, `&rdquo;`, `&apos;` in JSX
  - Layout: `DashboardLayout` wrapper with sidebar navigation
  - Grid layouts: `xl:col-span-X` for responsive columns
- **Design Source**: Match specifications in `design/html/dashboard/*.html` exactly

**Rationale**: Consistent visual language creates cohesive user experience, reduces eye strain for daily use, and reinforces product identity.

### VII. MongoDB Architecture Patterns

Database interactions MUST follow established patterns:

- **Development**: MongoDB Memory Server auto-starts (no manual MongoDB setup)
- **Production**: Requires `MONGODB_URI` environment variable
- **Connections**: Dual clients maintained separately
  - NextAuth client: `src/lib/auth.ts`
  - Mongoose client: `src/lib/db.ts`
- **Data Layer**:
  - Models in `src/lib/models/*` using Mongoose schemas
  - API routes in `src/app/api/*` with HTTP method exports
  - State management via custom hooks (e.g., `useHabits`) with optimistic updates
- **Validation**: Server-side validation using Zod schemas before database operations

**Rationale**: Separation of concerns between authentication and application data. Clear patterns prevent connection pool issues and ensure data integrity.

## Technical Standards

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS 3.x
- **Testing**: Vitest (unit), Playwright (E2E)
- **Code Quality**: ESLint + Prettier with pre-commit hooks (husky)
- **Authentication**: NextAuth.js with JWT

### Code Quality Gates

All code MUST pass before merge:

1. `pnpm lint:fix` - ESLint validation with auto-fixes
2. `pnpm format` - Prettier code formatting
3. `pnpm type-check` - TypeScript compilation check
4. `pnpm test` - Test suite execution (Phase 2+)

### File Organization

- `/src/app` - Next.js App Router (routes, layouts, pages)
- `/src/components` - Reusable UI components
- `/src/hooks` - Custom React hooks
- `/src/lib` - Shared utilities, database, authentication
- `/src/types` - TypeScript type definitions
- `/design` - UI/UX specifications and design system
- `/docs` - Project documentation
- `/e2e` - End-to-end tests

### Environment Variables

- **Development**: set `MONGODB_URI`
- **Production**: Requires `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Security**: All secrets in `.env.local`, never committed to version control
- **Validation**: Environment variables validated at runtime

## Development Workflow

### Feature Development Process

1. **Planning**: Feature spec created using `.specify/templates/spec-template.md`
2. **Design**: Implementation plan using `.specify/templates/plan-template.md`
3. **Constitution Check**: Verify compliance with all principles before Phase 0 research
4. **Implementation**: Tasks executed from `.specify/templates/tasks-template.md`
5. **Testing**: Unit, integration, and E2E tests (Phase 2+)
6. **Review**: Code review against constitution compliance
7. **Documentation**: Update relevant docs and comments

### Branch Strategy

- **Main**: Production-ready code
- **Develop**: Integration branch for features
- **Feature branches**: `feature/mvc-###-description`
- **Pull Requests**: Must target `develop` branch

### Commit Standards

- Descriptive commit messages
- Reference issue numbers (e.g., `[MVC-###]`)
- Atomic commits (single logical change per commit)

### Code Review Requirements

- **Constitution Compliance**: Reviewer MUST verify adherence to all principles
- **Type Safety**: No untyped code or unjustified `any`
- **Accessibility**: WCAG 2.1 AA compliance verified
- **Performance**: No obvious performance anti-patterns
- **Security**: Input validation, secure data handling
- **Documentation**: Inline comments for complex logic, README updates as needed

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. In case of conflict, constitution principles take precedence.

### Amendment Process

1. **Proposal**: Document proposed change with rationale
2. **Impact Analysis**: Assess effects on existing code, templates, documentation
3. **Review**: Team discussion and approval required
4. **Version Bump**: Follow semantic versioning (MAJOR.MINOR.PATCH)
5. **Implementation**: Update constitution, templates, and propagate changes
6. **Communication**: Notify all stakeholders of amendments

### Version Semantics

- **MAJOR**: Backward incompatible governance changes, principle removals/redefinitions
- **MINOR**: New principles added, sections expanded materially
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

- **Pre-merge**: All PRs MUST include constitution compliance checklist
- **Periodic Audits**: Quarterly review of codebase for principle adherence
- **Complexity Justification**: Any deviation from principles requires documented justification in implementation plan

### Runtime Development Guidance

For day-to-day development patterns, implementation details, and practical examples, refer to `.github/copilot-instructions.md`. That document provides tactical guidance that implements these strategic principles.

**Version**: 1.0.0 | **Ratified**: 2025-10-20 | **Last Amended**: 2025-10-20
