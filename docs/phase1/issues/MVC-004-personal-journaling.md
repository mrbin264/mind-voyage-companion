# [MVC-004] Personal journaling

**Phase**: 1 (MVP)  
**Priority**: Critical  
**GitHub Issue**: [#4](https://github.com/mrbin264/mind-voyage-companion/issues/4)

## User Story

**ID**: MVC-004  
**Description**: As a user, I want to write private journal entries with mood tracking so that I can reflect on my experiences and monitor my emotional well-being

## Acceptance Criteria

- [ ] Rich text editor supports basic formatting for journal entries
- [ ] Optional mood selection on 1-5 scale with intuitive interface
- [ ] Journal entries are saved with timestamp and associated mood rating
- [ ] Search functionality allows finding entries by date range or mood
- [ ] Content is stored securely and only accessible to the account owner

## Priority

Critical - Phase 1 (MVP)

## Technical Notes

- Rich text editor implementation (consider Tiptap or similar)
- Journal table with content, mood, timestamp fields
- Search indexing for efficient queries
- Row-level security for data privacy
- Auto-save functionality for better UX

## Definition of Done

- [ ] Rich text journal editor implemented
- [ ] Mood selection interface (1-5 scale)
- [ ] Save/edit/delete journal functionality
- [ ] Search and filter by date/mood
- [ ] Privacy and security measures verified
- [ ] Auto-save during writing

## Dependencies

- MVC-001 (Authentication) - Required for user context and privacy

## Estimated Effort

**Story Points**: 13  
**Time Estimate**: 2-3 weeks

## Technical Implementation Details

### Frontend Components
- RichTextEditor with formatting toolbar
- MoodSelector with 1-5 scale interface
- JournalList with search/filter options
- JournalEntry for viewing/editing
- SearchBar with date range picker

### Backend API Endpoints
- `GET /api/journals` - List user's journal entries
- `POST /api/journals` - Create new journal entry
- `PATCH /api/journals/:id` - Update journal entry
- `DELETE /api/journals/:id` - Delete journal entry
- `GET /api/journals/search` - Search journals by criteria

### Database Schema
```sql
Journal {
  id        UUID     @id @default(uuid())
  userId    UUID     @relation(User)
  title     String?
  content   Text
  mood      Int?     -- 1-5 scale, optional
  language  String   @default("en")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, createdAt])
  @@index([userId, mood])
}
```

### Rich Text Editor Features
- Basic formatting (bold, italic, underline)
- Paragraph styles (headings, quotes)
- Lists (ordered, unordered)
- Auto-save every 30 seconds
- Word count display

## Testing Strategy

- Unit tests for journal CRUD operations
- Integration tests for search functionality
- Security tests for data privacy
- E2E tests for complete journaling flow
- Performance tests for large journal collections
- Accessibility tests for rich text editor