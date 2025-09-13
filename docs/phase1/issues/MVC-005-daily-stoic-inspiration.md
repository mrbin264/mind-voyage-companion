# [MVC-005] Daily Stoic inspiration

**Phase**: 1 (MVP)  
**Priority**: High  
**GitHub Issue**: [#5](https://github.com/mrbin264/mind-voyage-companion/issues/5)

## User Story

**ID**: MVC-005  
**Description**: As a user interested in personal growth, I want to receive daily Stoic quotes and reflection prompts so that I can incorporate philosophical thinking into my routine

## Acceptance Criteria

- [ ] Same quote and prompt displayed consistently for each user's local date
- [ ] Content refreshes at local midnight based on user's timezone setting
- [ ] Quotes are sourced from authenticated Stoic philosophers and texts
- [ ] Reflection prompts encourage thoughtful consideration of daily experiences
- [ ] Content is cached for performance and offline availability

## Priority

High - Phase 1 (MVP)

## Technical Notes

- Curated database of Stoic quotes and prompts
- Deterministic content selection algorithm (date-based)
- Timezone-aware content refresh logic
- Caching strategy for performance optimization
- Content management system for adding new quotes/prompts

## Definition of Done

- [ ] Stoic content database populated with verified quotes
- [ ] Daily content selection algorithm implemented
- [ ] Timezone-aware refresh mechanism
- [ ] Caching layer for performance
- [ ] Content displays on home/dashboard
- [ ] Admin interface for content management

## Dependencies

- MVC-001 (Authentication) - Required for user timezone preferences

## Estimated Effort

**Story Points**: 8  
**Time Estimate**: 1-2 weeks

## Technical Implementation Details

### Frontend Components

#### Daily Quote Display
```typescript
// components/stoic/DailyQuote.tsx
interface DailyQuoteProps {
  quote: StoicQuote
  onSave: (quoteId: string) => void
  onReflect: (quoteId: string, reflection: string) => void
  isSaved?: boolean
}

export function DailyQuote({ quote, onSave, onReflect, isSaved }: DailyQuoteProps) {
  const [isReflecting, setIsReflecting] = useState(false)
  const [reflection, setReflection] = useState('')
  const [showShare, setShowShare] = useState(false)
  
  const handleSubmitReflection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reflection.trim()) return
    
    try {
      await onReflect(quote.id, reflection)
      setReflection('')
      setIsReflecting(false)
      toast.success('Reflection saved')
    } catch (error) {
      toast.error('Failed to save reflection')
    }
  }
  
  return (
    <Card className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <StoicPattern />
      </div>
      
      <Card.Header className="text-center space-y-4 relative">
        <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
          <Scroll className="w-8 h-8 text-amber-600" />
        </div>
        
        <div>
          <Card.Title className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Daily Stoic Wisdom
          </Card.Title>
          <Card.Description className="text-xs text-gray-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Card.Description>
        </div>
      </Card.Header>
      
      <Card.Content className="space-y-6 relative">
        {/* Quote */}
        <blockquote className="text-center space-y-4">
          <p className="text-lg md:text-xl leading-relaxed font-medium text-gray-800 italic">
            "{quote.text}"
          </p>
          
          <footer className="text-sm text-gray-600">
            <cite className="font-medium">— {quote.author}</cite>
            {quote.source && (
              <div className="text-xs text-gray-500 mt-1">
                from <em>{quote.source}</em>
              </div>
            )}
          </footer>
        </blockquote>
        
        {/* Context/Commentary */}
        {quote.commentary && (
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 text-sm mb-1">
                  Today's Insight
                </h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {quote.commentary}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(quote.id)}
            className={cn(isSaved && "bg-blue-50 border-blue-200 text-blue-700")}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReflecting(true)}
          >
            <PenTool className="w-4 h-4 mr-2" />
            Reflect
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShare(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
        
        {/* Reflection Panel */}
        <AnimatePresence>
          {isReflecting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 space-y-3"
            >
              <Label htmlFor="reflection" className="text-sm font-medium">
                Your Reflection
              </Label>
              <form onSubmit={handleSubmitReflection} className="space-y-3">
                <Textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="How does this quote apply to your life today? What insights does it spark?"
                  rows={4}
                  className="resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsReflecting(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!reflection.trim()}>
                    Save Reflection
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Card.Content>
      
      {/* Share Modal */}
      <ShareQuoteModal 
        quote={quote}
        open={showShare}
        onOpenChange={setShowShare}
      />
    </Card>
  )
}
```

#### Quote History & Search
```typescript
// components/stoic/QuoteHistory.tsx
export function QuoteHistory() {
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [authorFilter, setAuthorFilter] = useQueryState('author', parseAsString)
  const [tagFilter, setTagFilter] = useQueryState('tag', parseAsString)
  const [sortBy, setSortBy] = useQueryState('sort', parseAsStringLiteral(['date', 'author', 'saved'] as const).withDefault('date'))
  
  const { data: quotes, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['quotes', 'history', { searchQuery, authorFilter, tagFilter, sortBy }],
    queryFn: ({ pageParam = 0 }) => getQuoteHistory({
      page: pageParam,
      query: searchQuery,
      author: authorFilter,
      tag: tagFilter,
      sortBy
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })
  
  const { data: authors } = useQuery({
    queryKey: ['quotes', 'authors'],
    queryFn: getQuoteAuthors,
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
  
  const { data: tags } = useQuery({
    queryKey: ['quotes', 'tags'],
    queryFn: getQuoteTags,
    staleTime: 30 * 60 * 1000,
  })
  
  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search quotes by text, author, or theme..."
          className="w-full"
        />
        
        <div className="flex gap-2 flex-wrap">
          <Select value={authorFilter || ''} onValueChange={setAuthorFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All authors</SelectItem>
              {authors?.map((author) => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={tagFilter || ''} onValueChange={setTagFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All themes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All themes</SelectItem>
              {tags?.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="saved">Saved first</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchQuery || authorFilter || tagFilter) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setAuthorFilter('')
                setTagFilter('')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Quote Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes?.pages.flatMap(page => page.quotes).map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                showDate
                compact
              />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="text-center">
              <Button 
                onClick={() => fetchNextPage()} 
                variant="outline"
              >
                Load More Quotes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// components/stoic/QuoteCard.tsx
interface QuoteCardProps {
  quote: StoicQuote & { isSaved?: boolean, reflection?: string }
  showDate?: boolean
  compact?: boolean
  onSave?: (id: string) => void
  onReflect?: (id: string, reflection: string) => void
}

export function QuoteCard({ quote, showDate, compact, onSave, onReflect }: QuoteCardProps) {
  const [showReflection, setShowReflection] = useState(false)
  
  return (
    <Card className={cn("relative", compact && "p-4")}>
      {showDate && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="text-xs">
            {format(new Date(quote.dateShown), 'MMM d')}
          </Badge>
        </div>
      )}
      
      <Card.Content className={cn("space-y-3", compact && "p-0")}>
        <blockquote className="space-y-2">
          <p className={cn(
            "leading-relaxed font-medium text-gray-800",
            compact ? "text-sm" : "text-base"
          )}>
            "{quote.text}"
          </p>
          
          <footer className="text-sm text-gray-600">
            <cite>— {quote.author}</cite>
            {quote.source && (
              <div className="text-xs text-gray-500">
                from <em>{quote.source}</em>
              </div>
            )}
          </footer>
        </blockquote>
        
        {quote.tags && quote.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {quote.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        
        {quote.reflection && (
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReflection(!showReflection)}
              className="text-xs text-gray-600 p-0 h-auto"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              {showReflection ? 'Hide' : 'View'} reflection
            </Button>
            
            {showReflection && (
              <p className="text-xs text-gray-600 mt-2 italic">
                "{quote.reflection}"
              </p>
            )}
          </div>
        )}
        
        {(onSave || onReflect) && (
          <div className="flex gap-2 pt-2">
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave(quote.id)}
                className={cn("h-8", quote.isSaved && "text-blue-600")}
              >
                {quote.isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            )}
            
            {onReflect && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <PenTool className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
```

### Backend API Endpoints
- `GET /api/stoic/daily` - Get daily quote and prompt
- `GET /api/stoic/quote/:date` - Get quote for specific date
- `POST /api/admin/stoic` - Add new content (admin only)

### Database Schema
```sql
StoicQuote {
  id        UUID     @id @default(uuid())
  quote     Text
  author    String
  source    String?
  createdAt DateTime @default(now())
}

StoicPrompt {
  id        UUID     @id @default(uuid())
  prompt    Text
  category  String?  -- e.g., "reflection", "gratitude", "wisdom"
  createdAt DateTime @default(now())
}

DailyContent {
  id       UUID       @id @default(uuid())
  date     DateTime   @db.Date
  quoteId  UUID       @relation(StoicQuote)
  promptId UUID       @relation(StoicPrompt)
  
  @@unique([date])
}
```

### Content Selection Algorithm
```typescript
function getDailyContent(date: Date): { quote: StoicQuote, prompt: StoicPrompt } {
  // Deterministic selection based on date
  // Ensures same content for all users on same date
  // Rotates through available content cyclically
}
```

### Curated Content Sources
- Marcus Aurelius - Meditations
- Epictetus - Discourses and Enchiridion
- Seneca - Letters and Essays
- Modern Stoic interpretations
- Reflection prompts based on Stoic principles

## Testing Strategy

- Unit tests for content selection algorithm
- Integration tests for API endpoints
- Timezone testing for different user locations
- Performance tests for caching mechanisms
- Content validation tests for quote authenticity