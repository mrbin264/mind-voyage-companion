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

#### AI-Enhanced Journal Editor
```typescript
// components/journal/AIJournalEditor.tsx
interface AIEnhancement {
  type: 'sentiment' | 'themes' | 'suggestions' | 'insights'
  content: string
  confidence: number
  timestamp: string
}

export function AIJournalEditor({ 
  initialContent, 
  onSave, 
  onAIEnhance 
}: AIJournalEditorProps) {
  const [content, setContent] = useState(initialContent || '')
  const [aiEnhancements, setAIEnhancements] = useState<AIEnhancement[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAISidebar, setShowAISidebar] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  
  const { mutate: analyzeContent, isPending: isAnalyzing } = useMutation({
    mutationFn: analyzeJournalContent,
    onSuccess: (enhancements) => {
      setAIEnhancements(enhancements)
      setShowAISidebar(true)
      toast.success('AI analysis complete!')
    },
    onError: () => {
      toast.error('Failed to analyze content')
    }
  })
  
  const { mutate: applySuggestion } = useMutation({
    mutationFn: applyAISuggestion,
    onSuccess: (newContent) => {
      setContent(newContent)
      toast.success('Suggestion applied!')
    }
  })
  
  // Auto-analyze content when user pauses typing
  const debouncedAnalyze = useMemo(
    () => debounce((text: string) => {
      if (text.length > 50 && !isAnalyzing) {
        analyzeContent({ content: text, type: 'live' })
      }
    }, 3000),
    [analyzeContent, isAnalyzing]
  )
  
  useEffect(() => {
    if (content) {
      debouncedAnalyze(content)
    }
  }, [content, debouncedAnalyze])
  
  const handleApplySuggestion = (suggestion: AIEnhancement) => {
    setSelectedSuggestion(suggestion.content)
    applySuggestion({
      originalContent: content,
      suggestion: suggestion.content,
      type: suggestion.type
    })
  }
  
  return (
    <div className="flex gap-6 h-[600px]">
      {/* Main Editor */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Journal Entry</h3>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => analyzeContent({ content, type: 'full' })}
              disabled={!content.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              AI Enhance
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAISidebar(!showAISidebar)}
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>
        
        <Card className="relative">
          <Card.Content className="p-0">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? Let AI help you explore your thoughts..."
              className="min-h-[400px] border-0 resize-none focus:ring-0"
            />
            
            {/* AI Analysis Indicator */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-4 right-4"
                >
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI analyzing...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card.Content>
        </Card>
        
        {/* Smart Suggestions Bar */}
        {aiEnhancements.some(e => e.type === 'suggestions') && (
          <SmartSuggestionsBar
            suggestions={aiEnhancements.filter(e => e.type === 'suggestions')}
            onApply={handleApplySuggestion}
            selectedSuggestion={selectedSuggestion}
          />
        )}
      </div>
      
      {/* AI Sidebar */}
      <AnimatePresence>
        {showAISidebar && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-80 space-y-4"
          >
            <AISidebar
              enhancements={aiEnhancements}
              onApplySuggestion={handleApplySuggestion}
              onClose={() => setShowAISidebar(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// components/journal/AISidebar.tsx
interface AISidebarProps {
  enhancements: AIEnhancement[]
  onApplySuggestion: (suggestion: AIEnhancement) => void
  onClose: () => void
}

export function AISidebar({ enhancements, onApplySuggestion, onClose }: AISidebarProps) {
  const sentimentEnhancement = enhancements.find(e => e.type === 'sentiment')
  const themeEnhancements = enhancements.filter(e => e.type === 'themes')
  const insightEnhancements = enhancements.filter(e => e.type === 'insights')
  const suggestionEnhancements = enhancements.filter(e => e.type === 'suggestions')
  
  return (
    <Card className="h-full">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            AI Insights
          </Card.Title>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card.Header>
      
      <Card.Content className="space-y-6 overflow-y-auto">
        {/* Sentiment Analysis */}
        {sentimentEnhancement && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Emotional Tone
            </h4>
            
            <SentimentVisualization sentiment={sentimentEnhancement} />
          </div>
        )}
        
        {/* Key Themes */}
        {themeEnhancements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Tags className="w-4 h-4 text-green-500" />
              Key Themes
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {themeEnhancements.map((theme, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {theme.content}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Insights */}
        {insightEnhancements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Insights
            </h4>
            
            <div className="space-y-3">
              {insightEnhancements.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 border-l-4 border-yellow-200 rounded-lg"
                >
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    {insight.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Writing Suggestions */}
        {suggestionEnhancements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-500" />
              Suggestions
            </h4>
            
            <div className="space-y-2">
              {suggestionEnhancements.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <p className="text-sm text-purple-800 mb-2">
                    {suggestion.content}
                  </p>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="w-full"
                  >
                    Apply Suggestion
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {enhancements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No AI insights available yet</p>
            <p className="text-xs">Write more to get AI analysis</p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}
```

#### AI-Powered Reflection Prompts
```typescript
// components/journal/AIReflectionPrompts.tsx
interface AIPromptContext {
  recentEntries: string[]
  currentMood: number
  habitProgress: { completed: number, total: number }
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  dayOfWeek: string
}

export function AIReflectionPrompts({ context, onSelectPrompt }: AIReflectionPromptsProps) {
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['ai-prompts', context],
    queryFn: () => generatePersonalizedPrompts(context),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null)
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Personalized Reflection Prompts</h3>
        <Badge variant="secondary" className="text-xs">
          AI-Generated
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {prompts?.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all cursor-pointer group">
              <Card.Content 
                className="p-4"
                onClick={() => setExpandedPrompt(expandedPrompt === prompt.id ? null : prompt.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            prompt.category === 'growth' && "border-green-200 text-green-700",
                            prompt.category === 'gratitude' && "border-blue-200 text-blue-700",
                            prompt.category === 'reflection' && "border-purple-200 text-purple-700"
                          )}
                        >
                          {prompt.category}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {prompt.estimatedTime}m
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {prompt.question}
                      </p>
                      
                      {expandedPrompt === prompt.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 mt-3"
                        >
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {prompt.explanation}
                          </p>
                          
                          {prompt.followUpQuestions && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">
                                Follow-up questions:
                              </p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {prompt.followUpQuestions.map((q, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="text-gray-400">•</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectPrompt(prompt)
                            }}
                            className="mt-3"
                          >
                            Start Reflecting
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {expandedPrompt === prompt.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Generate New Prompts */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries(['ai-prompts'])}
          className="text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Prompts
        </Button>
      </div>
    </div>
  )
}

// components/journal/SentimentVisualization.tsx
export function SentimentVisualization({ sentiment }: { sentiment: AIEnhancement }) {
  const sentimentData = JSON.parse(sentiment.content)
  const { overall, emotions, confidence } = sentimentData
  
  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-600 bg-green-100'
    if (score < -0.1) return 'text-red-600 bg-red-100'
    return 'text-yellow-600 bg-yellow-100'
  }
  
  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return 'Very Positive'
    if (score > 0.1) return 'Positive'
    if (score < -0.5) return 'Very Negative'
    if (score < -0.1) return 'Negative'
    return 'Neutral'
  }
  
  return (
    <div className="space-y-4">
      {/* Overall Sentiment */}
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
          getSentimentColor(overall)
        )}>
          <div className="w-2 h-2 rounded-full bg-current" />
          {getSentimentLabel(overall)}
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Confidence: {Math.round(confidence * 100)}%
        </div>
      </div>
      
      {/* Emotional Breakdown */}
      {emotions && Object.keys(emotions).length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-700">
            Emotional Tone Breakdown
          </Label>
          
          <div className="space-y-1">
            {Object.entries(emotions)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([emotion, score]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-20 capitalize">
                    {emotion}
                  </span>
                  
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.abs(score) * 100}%` }}
                    />
                  </div>
                  
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round(score * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

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