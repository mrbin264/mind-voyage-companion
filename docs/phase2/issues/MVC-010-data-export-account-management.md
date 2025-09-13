# [MVC-010] Data export and account management

**Phase**: 2 (Pro Features)  
**Priority**: Medium  
**GitHub Issue**: [#10](https://github.com/mrbin264/mind-voyage-companion/issues/10)

## User Story

**ID**: MVC-010  
**Description**: As a Pro user concerned about data portability, I want to export my personal data in standard formats so that I can maintain control over my information

## Acceptance Criteria

- [ ] Export generates comprehensive CSV and JSON files with all user data
- [ ] Export process is secure and only accessible to authenticated account owner
- [ ] File generation completes within reasonable time and provides download link
- [ ] Exported data includes habits, logs, journal entries, and account settings
- [ ] Export functionality respects privacy settings and user consent preferences

## Priority

Medium - Phase 2 (Pro Feature)

## Technical Notes

- Data export service for CSV/JSON formats
- Secure file generation and download
- Comprehensive data inclusion (habits, logs, journals, settings)
- Privacy compliance and user consent handling
- Background job processing for large datasets

## Definition of Done

- [ ] Export service generating CSV/JSON files
- [ ] Secure download mechanism implemented
- [ ] All user data included in export
- [ ] Privacy settings respected in export
- [ ] Performance optimized for large datasets
- [ ] GDPR compliance verified

## Dependencies

- MVC-011 (Subscription) - Required for Pro feature access
- All data-generating features for comprehensive export
- Background job processing system

## Estimated Effort

**Story Points**: 13  
**Time Estimate**: 2-3 weeks

## Technical Implementation Details

### Frontend Components
- ExportRequestForm with format selection
- ExportProgress with status updates
- DownloadManager for secure file access
- DataPreview showing export contents
- PrivacyControls for selective export

### Backend API Endpoints
- `POST /api/export/request` - Request data export
- `GET /api/export/status/:id` - Check export status
- `GET /api/export/download/:id` - Download export file
- `DELETE /api/export/:id` - Delete export file

### Data Export Engine
```typescript
interface ExportRequest {
  userId: string;
  format: 'csv' | 'json' | 'both';
  includeData: {
    habits: boolean;
    habitLogs: boolean;
    journals: boolean;
    settings: boolean;
    reports: boolean;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ExportResult {
  files: {
    filename: string;
    format: string;
    size: number;
    downloadUrl: string;
  }[];
  metadata: {
    exportedAt: Date;
    recordCounts: Record<string, number>;
    version: string;
  };
}
```

### Database Schema
```sql
ExportJob {
  id          UUID      @id @default(uuid())
  userId      UUID      @relation(User)
  format      String[]  -- ['csv', 'json']
  includeData Json      -- Export configuration
  status      ExportStatus @default(PENDING)
  progress    Int       @default(0)
  files       Json?     -- Generated file information
  error       String?
  expiresAt   DateTime  -- Auto-delete after 7 days
  createdAt   DateTime  @default(now())
  completedAt DateTime?
}

enum ExportStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  EXPIRED
}
```

### Export Data Formats

#### JSON Structure
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "settings": {...}
  },
  "habits": [...],
  "habitLogs": [...],
  "journals": [...],
  "reports": [...],
  "metadata": {
    "exportedAt": "2025-09-13T00:00:00Z",
    "version": "1.0"
  }
}
```

#### CSV Files
- `habits.csv` - All user habits
- `habit_logs.csv` - All completion logs
- `journals.csv` - All journal entries
- `user_settings.csv` - Account preferences
- `weekly_reports.csv` - AI-generated reports

### Security and Privacy
- Secure temporary file storage
- Time-limited download URLs
- Automatic file cleanup after 7 days
- Audit logging for export requests
- Privacy setting compliance

### Background Job Processing
```typescript
async function processExportJob(jobId: string) {
  const job = await getExportJob(jobId);
  
  try {
    await updateJobStatus(jobId, 'PROCESSING');
    
    const userData = await collectUserData(job.userId, job.includeData);
    const files = await generateExportFiles(userData, job.format);
    
    await updateJobWithFiles(jobId, files);
    await updateJobStatus(jobId, 'COMPLETED');
    
    // Send notification email
    await notifyExportComplete(job.userId, files);
    
  } catch (error) {
    await updateJobStatus(jobId, 'FAILED', error.message);
  }
}
```

## Testing Strategy

- Unit tests for data collection and formatting
- Integration tests for export API endpoints
- Security tests for file access controls
- Performance tests with large datasets
- Privacy compliance testing
- E2E tests for complete export flow