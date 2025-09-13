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

#### Rich Text Editor Implementation
```typescript
// components/journal/JournalEditor.tsx
'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface JournalEditorProps {
  content?: string
  onChange: (content: string) => void
  onSave: (content: string) => void
  autoSave?: boolean
}

export function JournalEditor({ content, onChange, onSave, autoSave = true }: JournalEditorProps) {
  const [wordCount, setWordCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'What\'s on your mind today?'
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length)
      onChange(editor.getHTML())
    }
  })
  
  // Auto-save functionality
  const debouncedSave = useMemo(
    () => debounce(async (content: string) => {
      if (!autoSave || !content.trim()) return
      
      setIsSaving(true)
      try {
        await onSave(content)
        setLastSaved(new Date())
      } catch (error) {
        toast.error('Failed to save journal entry')
      } finally {
        setIsSaving(false)
      }
    }, 2000),
    [onSave, autoSave]
  )
  
  useEffect(() => {
    if (editor?.getHTML()) {
      debouncedSave(editor.getHTML())
    }
  }, [editor?.getHTML(), debouncedSave])
  
  return (
    <div className="space-y-4">
      {/* Editor Toolbar */}
      <EditorToolbar editor={editor} />
      
      {/* Editor Content */}
      <div className="relative">
        <EditorContent 
          editor={editor}
          className="min-h-[300px] prose prose-sm max-w-none focus:outline-none"
        />
        
        {/* Save Status Indicator */}
        <SaveStatusIndicator 
          isSaving={isSaving}
          lastSaved={lastSaved}
          className="absolute bottom-2 right-2"
        />
      </div>
      
      {/* Editor Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{wordCount} words</span>
        <WritingTimeTracker />
      </div>
    </div>
  )
}
```

#### Mood Selection Interface
```typescript
// components/journal/MoodSelector.tsx
interface MoodSelectorProps {
  value?: number
  onChange: (mood: number) => void
  disabled?: boolean
}

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Terrible', color: 'text-red-500' },
  { value: 2, emoji: '😟', label: 'Bad', color: 'text-orange-500' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
  { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
  { value: 5, emoji: '😄', label: 'Amazing', color: 'text-blue-500' },
]

export function MoodSelector({ value, onChange, disabled }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>How are you feeling today?</Label>
      
      <div className="flex gap-2 justify-center">
        {MOOD_OPTIONS.map(({ value: moodValue, emoji, label, color }) => (
          <motion.button
            key={moodValue}
            type="button"
            onClick={() => onChange(moodValue)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all",
              value === moodValue 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">{emoji}</span>
            <span className={cn("text-xs font-medium", color)}>{label}</span>
          </motion.button>
        ))}
      </div>
      
      {value && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-600"
        >
          You're feeling <span className="font-medium">
            {MOOD_OPTIONS.find(m => m.value === value)?.label.toLowerCase()}
          </span> today
        </motion.p>
      )}
    </div>
  )
}
```

#### Journal Entry Management
```typescript
// components/journal/JournalEntry.tsx
export function JournalEntry({ entry, onUpdate, onDelete }: JournalEntryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const previewContent = entry.content.length > 200 
    ? `${entry.content.slice(0, 200)}...`
    : entry.content
  
  return (
    <Card className="relative">
      <Card.Header>
        <div className="flex justify-between items-start">
          <div>
            <Card.Title className="text-lg">
              {entry.title || format(new Date(entry.createdAt), 'MMMM d, yyyy')}
            </Card.Title>
            <Card.Description>
              {format(new Date(entry.createdAt), 'h:mm a')}
              {entry.mood && (
                <MoodIndicator mood={entry.mood} size="sm" className="ml-2" />
              )}
            </Card.Description>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(entry.id)}
                className="text-red-600"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card.Header>
      
      <Card.Content>
        {isEditing ? (
          <JournalEditor
            content={entry.content}
            onChange={(content) => setEntryContent(content)}
            onSave={async (content) => {
              await onUpdate(entry.id, { content })
              setIsEditing(false)
            }}
          />
        ) : (
          <div className="space-y-2">
            <div 
              className="prose prose-sm max-w-none cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div dangerouslySetInnerHTML={{ 
                __html: isExpanded ? entry.content : previewContent 
              }} />
            </div>
            
            {entry.content.length > 200 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

// components/journal/JournalSearch.tsx
export function JournalSearch({ onSearchResults }: JournalSearchProps) {
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [moodFilter, setMoodFilter] = useQueryState('mood', parseAsInteger)
  const [dateRange, setDateRange] = useState<DateRange>()
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['journals', 'search', { searchQuery, moodFilter, dateRange }],
    queryFn: () => searchJournals({ query: searchQuery, mood: moodFilter, dateRange }),
    enabled: !!(searchQuery || moodFilter || dateRange)
  })
  
  return (
    <div className="space-y-4">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search your journal entries..."
        className="w-full"
      />
      
      <div className="flex gap-2 flex-wrap">
        <MoodFilter value={moodFilter} onChange={setMoodFilter} />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        
        {(searchQuery || moodFilter || dateRange) && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setMoodFilter(undefined)
              setDateRange(undefined)
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
      
      {isLoading && <SearchSkeleton />}
      {searchResults && <SearchResults results={searchResults} />}
    </div>
  )
}
```

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