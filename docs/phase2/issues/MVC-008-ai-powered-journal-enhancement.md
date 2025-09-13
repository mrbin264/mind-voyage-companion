# [MVC-008] AI-powered journal enhancement

**Phase**: 2 (Pro Features)  
**Priority**: Medium  
**GitHub Issue**: [#8](https://github.com/mrbin264/mind-voyage-companion/issues/8)

## User Story

**ID**: MVC-008  
**Description**: As a Pro user, I want AI assistance to translate and improve my journal entries to English so that I can enhance my language skills while maintaining my authentic thoughts

## Acceptance Criteria

- [ ] Side-by-side editor shows original text and AI-enhanced English version
- [ ] Translation preserves meaning while improving grammar and vocabulary
- [ ] Bullet-point explanations highlight specific improvements made
- [ ] Usage quota tracking prevents cost overruns with clear remaining balance display
- [ ] Process completes within 5 seconds for typical journal entry length

## Priority

Medium - Phase 2 (Pro Feature)

## Technical Notes

- Azure OpenAI integration for translation and improvement
- Side-by-side editor component
- Quota management system with usage tracking
- PII redaction in prompts for privacy
- Cost monitoring and alerting system

## Definition of Done

- [ ] Azure OpenAI integration implemented
- [ ] Side-by-side editor interface
- [ ] Translation with improvement explanations
- [ ] Quota tracking and display
- [ ] Performance meets 5-second target
- [ ] Cost monitoring dashboard

## Dependencies

- MVC-004 (Journaling) - Required for journal content
- MVC-011 (Subscription) - Required for Pro feature access
- Azure OpenAI service setup

## Estimated Effort

**Story Points**: 21  
**Time Estimate**: 3-4 weeks

## Technical Implementation Details

### Frontend Components
- SideBySideEditor with original and enhanced views
- AIProcessingIndicator with progress feedback
- QuotaDisplay showing remaining usage
- ImprovementExplanations with bullet points
- CopyToClipboard functionality

### Backend API Endpoints
- `POST /api/ai/translate` - Translate and improve journal text
- `GET /api/ai/quota` - Get user's AI usage quota
- `GET /api/ai/usage` - Get usage statistics

### Azure OpenAI Integration
```typescript
interface AIRequest {
  originalText: string;
  userId: string;
  language: 'vi' | 'en';
}

interface AIResponse {
  enhancedText: string;
  improvements: {
    type: 'grammar' | 'vocabulary' | 'style';
    original: string;
    improved: string;
    explanation: string;
  }[];
  tokenCount: number;
}
```

### Quota Management System
```sql
AIUsage {
  id        UUID     @id @default(uuid())
  userId    UUID     @relation(User)
  tokens    Int
  operation String   -- 'translate', 'improve', etc.
  cost      Decimal  @db.Decimal(10,4)
  date      DateTime @db.Date
  createdAt DateTime @default(now())
}

AIQuota {
  userId       UUID     @id @relation(User)
  dailyLimit   Int      @default(1000)
  monthlyLimit Int      @default(30000)
  usedDaily    Int      @default(0)
  usedMonthly  Int      @default(0)
  resetDaily   DateTime
  resetMonthly DateTime
}
```

### Privacy and Security
- PII detection and redaction in prompts
- No training data usage policy enforcement
- Audit logging for AI service usage
- Encrypted storage of AI responses

### Cost Control Features
- Per-request cost calculation
- Daily/monthly usage limits
- Cost alerting for administrators
- Usage analytics and reporting

## Testing Strategy

- Integration tests with Azure OpenAI service
- Unit tests for quota management logic
- Performance tests for 5-second response time
- Security tests for PII redaction
- Cost monitoring validation
- E2E tests for complete AI enhancement flow