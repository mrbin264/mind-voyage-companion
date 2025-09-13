# [MVC-007] Account settings and preferences

**Phase**: 1 (MVP)  
**Priority**: High  
**GitHub Issue**: [#7](https://github.com/mrbin264/mind-voyage-companion/issues/7)

## User Story

**ID**: MVC-007  
**Description**: As a user, I want to customize my account settings including timezone and language so that the application works optimally for my location and preferences

## Acceptance Criteria

- [ ] Timezone selection updates all time-based features and streak calculations
- [ ] Language toggle switches interface between English and Vietnamese
- [ ] Email preferences control weekly summary and notification delivery
- [ ] Profile information (name, preferences) can be updated and saved
- [ ] Settings changes take effect immediately without requiring app restart

## Priority

High - Phase 1 (MVP)

## Technical Notes

- Internationalization (i18n) framework setup
- Timezone handling for all time-based calculations
- User preferences storage and application
- Real-time settings updates without page refresh
- Email preference management system

## Definition of Done

- [ ] Settings page with all preference options
- [ ] Timezone selection affecting all time calculations
- [ ] EN/VI language switching working
- [ ] Email preferences configuration
- [ ] Real-time settings updates implemented
- [ ] Profile information management

## Dependencies

- MVC-001 (Authentication) - Required for user profile management
- MVC-005 (Daily Stoic) - Timezone affects content refresh timing

## Estimated Effort

**Story Points**: 8  
**Time Estimate**: 1-2 weeks

## Technical Implementation Details

### Frontend Components
- SettingsPage with tabbed interface
- TimezoneSelector with search functionality
- LanguageToggle with immediate switching
- EmailPreferences with granular controls
- ProfileForm for personal information

### Backend API Endpoints
- `GET /api/user/settings` - Get user preferences
- `PATCH /api/user/settings` - Update user preferences
- `GET /api/user/profile` - Get profile information
- `PATCH /api/user/profile` - Update profile information

### Database Schema Updates
```sql
User {
  // ... existing fields
  timezone     String   @default("UTC")
  language     String   @default("en")
  emailWeekly  Boolean  @default(false)
  emailReminders Boolean @default(false)
  theme        Theme    @default(LIGHT)
}

enum Theme {
  LIGHT
  DARK
  AUTO
}
```

### Internationalization Setup
- i18next configuration for React
- Translation files for EN/VI
- Dynamic locale switching
- Date/time formatting based on locale
- RTL support consideration (future)

### Timezone Handling
```typescript
interface TimezoneConfig {
  timezone: string;
  offset: number;
  displayName: string;
}

function convertToUserTimezone(utcDate: Date, userTimezone: string): Date {
  // Convert UTC timestamps to user's local timezone
  // Used for habit streaks, journal timestamps, etc.
}
```

### Email Preferences
- Weekly summary digest toggle
- Habit reminder notifications
- Achievement notifications
- System updates and announcements

## Testing Strategy

- Unit tests for timezone conversion logic
- Integration tests for settings API
- E2E tests for language switching
- Localization tests for both languages
- Timezone edge case testing
- Email preference functionality tests