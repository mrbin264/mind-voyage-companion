# PRD: Mind Voyage Companion

## 1. Product overview

### 1.1 Document title and version

* PRD: Mind Voyage Companion
* Version: 1.0

### 1.2 Product summary

Mind Voyage Companion is a privacy-first habit tracking and journaling application designed to help users build consistent routines, engage in reflective writing with Stoic-inspired prompts, and improve their English through journal-based language learning. The application combines daily habit tracking with thoughtful reflection to create a comprehensive personal growth platform.

The product operates on three core loops: daily check-ins with habit tracking and streak visualization, daily reflection through guided journaling with mood tracking, and weekly insights that help users review progress and set intentions. Built as a progressive web application using modern technologies, it offers a freemium model with AI-enhanced features available through a Pro subscription.

## 2. Goals

### 2.1 Business goals

* Achieve 10,000+ monthly active users within 12 months of launch
* Maintain ≥3% free-to-Pro conversion rate by Phase 2 implementation
* Keep operational costs under $150/month pre-Pro launch with AI costs ≤$1.5 per Pro user monthly
* Establish 99.5% application availability with robust privacy-first architecture
* Generate sustainable revenue through Pro subscriptions while maintaining ad-free experience

### 2.2 User goals

* Build and maintain consistent daily habits through visual streak tracking and motivational feedback
* Develop regular reflective writing practices with guided Stoic-inspired prompts
* Improve English language skills through AI-powered journal translation and enhancement features
* Gain actionable insights into personal growth patterns through data visualization and AI analysis
* Access a private, secure platform for personal development without data privacy concerns

### 2.3 Non-goals

* Native mobile application development (PWA approach only)
* Enterprise features including SSO, organizational management, or team collaboration
* Third-party social media integrations or public social networking features
* Advertisement-based revenue model or user data monetization
* Integration with external fitness trackers or IoT devices in initial phases

## 3. User personas

### 3.1 Key user types

* Young professionals seeking structured personal development
* Students building study and wellness habits
* Self-improvement enthusiasts interested in Stoic philosophy and mindfulness

### 3.2 Basic persona details

* **Maya the Young Professional**: 28-year-old marketing manager who struggles to maintain consistent routines due to demanding work schedule. Values efficiency and wants quick daily check-ins with meaningful insights. Willing to pay for AI features that save time and provide actionable feedback.

* **Alex the Student**: 22-year-old university student focused on building study habits and maintaining physical wellness. Budget-conscious but interested in English improvement features. Needs simple, intuitive interface with motivational elements like streaks and visual progress.

* **David the Self-Growth Enthusiast**: 32-year-old who actively pursues personal development through reading and reflection. Attracted to Stoic philosophy and mindfulness practices. Values depth in journaling features and willing to invest in premium tools for enhanced self-reflection.

### 3.3 Role-based access

* **Free User**: Access to core habit tracking, basic journaling, daily Stoic quotes, simple dashboard, and basic analytics
* **Pro User**: All free features plus AI journaling translation/improvement, weekly AI reflection reports, advanced visualizations, data export capabilities, and priority support
* **Admin User**: System administration, user management, content moderation, analytics access, and billing management

## 4. Functional requirements

* **Authentication & Profile Management** (Priority: Critical)
  * Secure email/password authentication with optional email verification
  * Profile customization including timezone, language preferences (EN/VI), and notification settings
  * Password reset functionality and session management

* **Habit Tracking System** (Priority: Critical)
  * Create, edit, and archive habits with flexible scheduling (daily/weekly/custom days)
  * One-click habit completion logging with automatic streak calculation
  * Historical view of habit performance with pagination and filtering

* **Journaling Platform** (Priority: Critical)
  * Rich text journaling with mood tracking (1-5 scale)
  * Search and filter capabilities by date range and mood
  * Content persistence with edit/delete functionality

* **Daily Stoic Content** (Priority: High)
  * Curated daily quotes and reflection prompts
  * Deterministic content selection ensuring same content per day per user
  * Cache optimization for performance

* **Dashboard & Analytics** (Priority: High)
  * Real-time streak visualization and habit completion status
  * Mood trend analysis over 7 and 30-day periods
  * Empty states with guided first-time user experience

* **AI-Enhanced Journaling** (Priority: Medium - Pro Feature)
  * Real-time translation and English improvement suggestions
  * Side-by-side editor showing original and enhanced versions
  * Usage quota management and cost control mechanisms

* **Weekly AI Insights** (Priority: Medium - Pro Feature)
  * Automated analysis of weekly habits, moods, and journal themes
  * Three actionable suggestions based on personal patterns
  * Delivery through in-app notifications and optional email digest

* **Data Visualization** (Priority: Medium - Pro Feature)
  * Habit Garden visualization mapping growth to streak performance
  * Mood Galaxy interactive visualization of emotional patterns
  * Export capabilities in CSV and JSON formats

## 5. User experience

### 5.1 Entry points & first-time user flow

* Landing page with clear value proposition and feature highlights
* Streamlined email registration with immediate access to core features
* Guided onboarding tour highlighting habit creation, journaling, and dashboard
* Template suggestions for common habit types and initial journal prompts

### 5.2 Core experience

* **Morning Check-in**: Users start their day by reviewing daily Stoic quote and completing habit checklist with satisfying visual feedback for streaks

* **Evening Reflection**: Users write in their journal with optional mood tracking, receiving gentle prompts if content is brief, creating a consistent reflection ritual

* **Weekly Review**: Users receive AI-generated insights about their patterns and progress, helping them adjust habits and set intentions for the coming week

* **Progress Visualization**: Users can explore their growth through interactive charts and creative visualizations that make abstract progress tangible and motivating

### 5.3 Advanced features & edge cases

* Streak recovery mechanisms for users who miss days due to illness or travel
* Bulk habit editing and archiving for users with changing routines
* Data export and account deletion for privacy-conscious users
* Offline functionality for journaling with sync when connection restored
* Multiple timezone support for users who travel frequently

### 5.4 UI/UX highlights

* Clean, minimalist design with focus on content over chrome
* Responsive mobile-first design that works seamlessly across devices
* Dark mode support with user preference persistence
* Accessibility compliance (WCAG 2.1 AA) including keyboard navigation and screen reader support
* Micro-interactions and subtle animations that provide feedback without distraction

## 6. Narrative

Users begin their day by opening Mind Voyage Companion to find an inspiring Stoic quote and reflection prompt tailored to their journey. They quickly check off completed habits, watching their streaks grow and feeling motivated by visual progress indicators. Throughout the day, they capture thoughts and experiences in their private journal, knowing their reflections are secure and helping them process daily experiences. Pro users benefit from AI assistance that helps improve their English writing while maintaining their authentic voice. At week's end, they receive personalized insights that reveal patterns in their behavior and mood, empowering them to make informed adjustments to their routines. This creates a sustainable cycle of intention, action, reflection, and growth that fits seamlessly into busy modern lives.

## 7. Success metrics

### 7.1 User-centric metrics

* Weekly Reflection Rate: ≥25% of active users logging ≥3 habit check-ins + ≥1 journal weekly
* Day 7 user retention rate of ≥25%
* Average session duration of 3-5 minutes for daily interactions
* Habit streak completion rate above 60% for users with 30+ day streaks
* Journal entry frequency of ≥3 entries per week for active users

### 7.2 Business metrics

* Free-to-Pro conversion rate of ≥3% within 6 months of Pro launch
* Pro subscriber 60-day retention rate of ≥70%
* Monthly recurring revenue growth rate of ≥15% after Pro launch
* Customer acquisition cost under $25 per Pro subscriber
* Net Promoter Score (NPS) above 50

### 7.3 Technical metrics

* Application availability of 99.5% or higher
* First Contentful Paint (FCP) under 1.5 seconds
* Time to Interactive (TTI) under 3 seconds on mid-tier devices
* API response time p95 under 300ms for cached operations
* AI feature response time under 5 seconds p95

## 8. Technical considerations

### 8.1 Integration points

* Azure OpenAI integration for translation and content improvement features
* Azure App Service for hosting with Azure Key Vault for secrets management
* PostgreSQL database with Prisma ORM for data management
* Azure Application Insights for monitoring and analytics
* Email service integration for notifications and weekly reports

### 8.2 Data storage & privacy

* All user data encrypted at rest with Azure-managed encryption keys
* PII redaction in AI prompts with strict no-training policies
* GDPR compliance with user data export and deletion capabilities
* Row-level security ensuring users can only access their own data
* Daily automated backups with 24-hour recovery point objective

### 8.3 Scalability & performance

* Horizontal application scaling supporting up to 10,000 concurrent users
* Database optimization with proper indexing and query performance monitoring
* Event table partitioning by month for analytics data management
* CDN integration for static assets and improved global performance
* Caching strategies for frequently accessed data like daily Stoic content

### 8.4 Potential challenges

* AI cost management requiring careful quota implementation and monitoring
* Multilingual support complexity for English/Vietnamese localization
* User engagement maintaining long-term habit formation beyond initial enthusiasm
* Privacy regulation compliance across different geographic regions
* Mobile performance optimization for PWA vs native app expectations

## 9. Milestones & sequencing

### 9.1 Project estimate

* Small-Medium Project: 16-24 weeks total development time across three phases

### 9.2 Team size & composition

* 2-3 person team: 1-2 full-stack developers, 1 designer/product manager, with part-time DevOps support

### 9.3 Suggested phases

* **Phase 1 - MVP Foundation** (6-10 weeks): Core authentication, habit tracking, journaling, Stoic daily content, basic dashboard, and essential settings functionality

* **Phase 2 - Pro Features** (6-8 weeks): AI journaling capabilities, weekly reflection reports, data visualizations, export functionality, and subscription billing integration

* **Phase 3 - Expansion Features** (8-12 weeks): AI mentor personas, lifestyle content packs, optional social features, and PWA push notification capabilities

## 10. User stories

### 10.1. User registration and authentication

* **ID**: MVC-001
* **Description**: As a new user, I want to create an account with my email and password so that I can securely access my personal habit tracking and journaling data
* **Acceptance criteria**:
  * User can register with valid email address and secure password (8+ characters)
  * Email validation prevents duplicate account creation
  * Confirmation email is sent for account verification (optional in MVP)
  * User receives immediate access to core features after registration
  * Password requirements are clearly communicated during registration

### 10.2. Daily habit management

* **ID**: MVC-002
* **Description**: As a user, I want to create custom habits with flexible scheduling so that I can track behaviors that matter to me on my preferred schedule
* **Acceptance criteria**:
  * User can create habits with title, frequency (daily/weekly/custom), and optional notes
  * Custom scheduling allows selection of specific days of the week
  * Habits display in an organized list with creation date and current streak
  * User can edit habit details and archive habits no longer needed
  * System prevents duplicate habit names within user account

### 10.3. Habit completion tracking

* **ID**: MVC-003
* **Description**: As a user, I want to quickly mark habits as complete for any day so that I can maintain accurate tracking and see my progress streaks
* **Acceptance criteria**:
  * One-click habit completion for current day with immediate visual feedback
  * Ability to mark habits complete for previous days within reasonable time window
  * Streak calculation automatically updates based on habit frequency and completion
  * Visual indicators clearly show completed vs. incomplete habits
  * Habit logs are permanently stored for historical analysis

### 10.4. Personal journaling

* **ID**: MVC-004
* **Description**: As a user, I want to write private journal entries with mood tracking so that I can reflect on my experiences and monitor my emotional well-being
* **Acceptance criteria**:
  * Rich text editor supports basic formatting for journal entries
  * Optional mood selection on 1-5 scale with intuitive interface
  * Journal entries are saved with timestamp and associated mood rating
  * Search functionality allows finding entries by date range or mood
  * Content is stored securely and only accessible to the account owner

### 10.5. Daily Stoic inspiration

* **ID**: MVC-005
* **Description**: As a user interested in personal growth, I want to receive daily Stoic quotes and reflection prompts so that I can incorporate philosophical thinking into my routine
* **Acceptance criteria**:
  * Same quote and prompt displayed consistently for each user's local date
  * Content refreshes at local midnight based on user's timezone setting
  * Quotes are sourced from authenticated Stoic philosophers and texts
  * Reflection prompts encourage thoughtful consideration of daily experiences
  * Content is cached for performance and offline availability

### 10.6. Progress dashboard

* **ID**: MVC-006
* **Description**: As a user, I want to see a visual summary of my habit streaks and mood trends so that I can quickly understand my progress and patterns
* **Acceptance criteria**:
  * Dashboard loads in under 300ms with cached data
  * Streak tiles show current streak count and visual progress indicators
  * Mood trend chart displays 7-day and 30-day patterns with clear visualization
  * Empty states provide helpful guidance for new users with no data
  * Dashboard updates in real-time when habits are marked complete

### 10.7. Account settings and preferences

* **ID**: MVC-007
* **Description**: As a user, I want to customize my account settings including timezone and language so that the application works optimally for my location and preferences
* **Acceptance criteria**:
  * Timezone selection updates all time-based features and streak calculations
  * Language toggle switches interface between English and Vietnamese
  * Email preferences control weekly summary and notification delivery
  * Profile information (name, preferences) can be updated and saved
  * Settings changes take effect immediately without requiring app restart

### 10.8. AI-powered journal enhancement

* **ID**: MVC-008
* **Description**: As a Pro user, I want AI assistance to translate and improve my journal entries to English so that I can enhance my language skills while maintaining my authentic thoughts
* **Acceptance criteria**:
  * Side-by-side editor shows original text and AI-enhanced English version
  * Translation preserves meaning while improving grammar and vocabulary
  * Bullet-point explanations highlight specific improvements made
  * Usage quota tracking prevents cost overruns with clear remaining balance display
  * Process completes within 5 seconds for typical journal entry length

### 10.9. Weekly AI reflection report

* **ID**: MVC-009
* **Description**: As a Pro user, I want to receive weekly AI-generated insights about my habits and mood patterns so that I can make informed decisions about my personal development
* **Acceptance criteria**:
  * Report analyzes habit completion rates, mood trends, and journal themes
  * Three specific, actionable suggestions provided based on personal data patterns
  * Report available both in-app and optionally delivered via email
  * Historical reports accessible for comparison over time
  * Insights link to relevant data visualizations and trend analysis

### 10.10. Data export and account management

* **ID**: MVC-010
* **Description**: As a Pro user concerned about data portability, I want to export my personal data in standard formats so that I can maintain control over my information
* **Acceptance criteria**:
  * Export generates comprehensive CSV and JSON files with all user data
  * Export process is secure and only accessible to authenticated account owner
  * File generation completes within reasonable time and provides download link
  * Exported data includes habits, logs, journal entries, and account settings
  * Export functionality respects privacy settings and user consent preferences

### 10.11. Subscription management

* **ID**: MVC-011
* **Description**: As a user interested in Pro features, I want to easily subscribe, modify, and cancel my subscription so that I have full control over my billing and account status
* **Acceptance criteria**:
  * Clear pricing information and feature comparison between Free and Pro tiers
  * Secure payment processing with support for major credit cards
  * Immediate access to Pro features upon successful subscription activation
  * Easy cancellation process with access maintained through current billing period
  * Billing history and receipt access for subscription management

### 10.12. Advanced data visualizations

* **ID**: MVC-012
* **Description**: As a Pro user, I want interactive visualizations of my habit and mood data so that I can better understand my patterns and stay motivated through creative progress representations
* **Acceptance criteria**:
  * Habit Garden visualization maps streak lengths to plant growth metaphors
  * Mood Galaxy presents emotional patterns through constellation-like interface
  * Visualizations load within 2 seconds and respond to interactions within 100ms
  * Interactive elements allow drilling down into specific time periods and data points
  * Visualizations are accessible and provide alternative text descriptions

---

This PRD is ready for your review. Would you like me to proceed with creating GitHub issues for each of the user stories outlined above?