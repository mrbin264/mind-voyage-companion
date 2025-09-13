# [MVC-006] Progress dashboard

**Phase**: 1 (MVP)  
**Priority**: High  
**GitHub Issue**: [#6](https://github.com/mrbin264/mind-voyage-companion/issues/6)

## User Story

**ID**: MVC-006  
**Description**: As a user, I want to see a visual summary of my habit streaks and mood trends so that I can quickly understand my progress and patterns

## Acceptance Criteria

- [ ] Dashboard loads in under 300ms with cached data
- [ ] Streak tiles show current streak count and visual progress indicators
- [ ] Mood trend chart displays 7-day and 30-day patterns with clear visualization
- [ ] Empty states provide helpful guidance for new users with no data
- [ ] Dashboard updates in real-time when habits are marked complete

## Priority

High - Phase 1 (MVP)

## Technical Notes

- Dashboard component with performance optimization
- Chart library integration for mood trends (Chart.js or D3)
- Real-time updates using optimistic UI patterns
- Caching strategy for dashboard data
- Responsive design for mobile and desktop

## Definition of Done

- [ ] Dashboard layout with streak tiles
- [ ] Mood trend visualization (7/30 days)
- [ ] Real-time updates on habit completion
- [ ] Empty state handling for new users
- [ ] Performance meets <300ms load time target
- [ ] Responsive design implemented

## Dependencies

- MVC-003 (Habit completion) - Required for streak data
- MVC-004 (Journaling) - Required for mood data
- MVC-001 (Authentication) - Required for user context

## Estimated Effort

**Story Points**: 13  
**Time Estimate**: 2-3 weeks

## Technical Implementation Details

### Frontend Components

#### Dashboard Overview
```typescript
// components/dashboard/ProgressDashboard.tsx
interface DashboardMetrics {
  habitStreak: { current: number, longest: number }
  completionRate: { today: number, week: number, month: number }
  journalEntries: { total: number, thisWeek: number }
  reflectionMinutes: { total: number, average: number }
  mindfulnessSessions: { total: number, averageLength: number }
}

export function ProgressDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: getDashboardMetrics,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
  
  const { data: weeklyProgress } = useQuery({
    queryKey: ['dashboard', 'weekly-progress'],
    queryFn: getWeeklyProgress,
  })
  
  if (isLoading) return <DashboardSkeleton />
  
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader />
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Streak"
          value={metrics.habitStreak.current}
          unit="days"
          subtitle={`Longest: ${metrics.habitStreak.longest} days`}
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Today's Progress"
          value={metrics.completionRate.today}
          unit="%"
          subtitle={`Week avg: ${metrics.completionRate.week}%`}
          icon={<Target className="w-6 h-6 text-blue-500" />}
          trend={{ value: 5, isPositive: true }}
        />
        
        <MetricCard
          title="Journal Entries"
          value={metrics.journalEntries.thisWeek}
          unit="this week"
          subtitle={`${metrics.journalEntries.total} total`}
          icon={<BookOpen className="w-6 h-6 text-green-500" />}
        />
        
        <MetricCard
          title="Reflection Time"
          value={metrics.reflectionMinutes.average}
          unit="min avg"
          subtitle={`${metrics.reflectionMinutes.total} min total`}
          icon={<Brain className="w-6 h-6 text-purple-500" />}
        />
      </div>
      
      {/* Progress Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProgressChart data={weeklyProgress} />
        <HabitCompletionHeatmap />
      </div>
      
      {/* Activity Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

// components/dashboard/MetricCard.tsx
interface MetricCardProps {
  title: string
  value: number
  unit: string
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number, isPositive: boolean }
  onClick?: () => void
}

export function MetricCard({ title, value, unit, subtitle, icon, trend, onClick }: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", onClick && "cursor-pointer hover:shadow-md transition-shadow")} onClick={onClick}>
      <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title className="text-sm font-medium text-gray-600">
          {title}
        </Card.Title>
        {icon}
      </Card.Header>
      
      <Card.Content>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">
              {value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {unit}
            </div>
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}% from last week
            </div>
          )}
        </div>
      </Card.Content>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-50" />
    </Card>
  )
}
```

#### Advanced Progress Visualizations
```typescript
// components/dashboard/WeeklyProgressChart.tsx
interface WeeklyProgressData {
  date: string
  habitsCompleted: number
  totalHabits: number
  journalEntries: number
  reflectionMinutes: number
}

export function WeeklyProgressChart({ data }: { data: WeeklyProgressData[] }) {
  const [activeTab, setActiveTab] = useState<'habits' | 'journal' | 'reflection'>('habits')
  
  const chartData = data.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    fullDate: day.date,
    habits: day.totalHabits > 0 ? (day.habitsCompleted / day.totalHabits) * 100 : 0,
    journal: day.journalEntries,
    reflection: day.reflectionMinutes,
  }))
  
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <Card.Title>Weekly Progress</Card.Title>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="habits" className="text-xs">Habits</TabsTrigger>
              <TabsTrigger value="journal" className="text-xs">Journal</TabsTrigger>
              <TabsTrigger value="reflection" className="text-xs">Reflect</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card.Header>
      
      <Card.Content>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'habits' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white border rounded-lg shadow-lg p-3">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-blue-600">
                            Completion: {Math.round(payload[0].value)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="habits" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
            
            {activeTab === 'journal' && (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="journal" 
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            )}
            
            {activeTab === 'reflection' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="reflection" 
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card.Content>
    </Card>
  )
}

// components/dashboard/HabitCompletionHeatmap.tsx
export function HabitCompletionHeatmap() {
  const { data: heatmapData, isLoading } = useQuery({
    queryKey: ['dashboard', 'heatmap'],
    queryFn: getHabitHeatmapData,
  })
  
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year'>('3months')
  
  if (isLoading) return <Skeleton className="h-64 w-full" />
  
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <Card.Title>Habit Consistency</Card.Title>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card.Header>
      
      <Card.Content>
        <CalendarHeatmap
          startDate={subMonths(new Date(), selectedPeriod === '3months' ? 3 : selectedPeriod === '6months' ? 6 : 12)}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => {
            if (!value || value.count === 0) return 'color-empty'
            if (value.count < 25) return 'color-scale-1'
            if (value.count < 50) return 'color-scale-2'
            if (value.count < 75) return 'color-scale-3'
            return 'color-scale-4'
          }}
          tooltipDataAttrs={{
            'data-tooltip': 'This is a tooltip',
          }}
          showWeekdayLabels
        />
        
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  level === 1 && "bg-green-100",
                  level === 2 && "bg-green-200",
                  level === 3 && "bg-green-300",
                  level === 4 && "bg-green-400"
                )}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card.Content>
    </Card>
  )
}

// components/dashboard/RecentActivity.tsx
export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: getRecentActivity,
  })
  
  if (isLoading) return <ActivitySkeleton />
  
  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent Activity</Card.Title>
      </Card.Header>
      
      <Card.Content>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                activity.type === 'habit' && "bg-blue-100 text-blue-600",
                activity.type === 'journal' && "bg-green-100 text-green-600",
                activity.type === 'reflection' && "bg-purple-100 text-purple-600",
                activity.type === 'quote' && "bg-amber-100 text-amber-600"
              )}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              
              {activity.type === 'habit' && activity.streak && (
                <Badge variant="secondary" className="text-xs">
                  {activity.streak} day streak
                </Badge>
              )}
            </motion.div>
          ))}
          
          {activities?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No recent activity</p>
              <p className="text-xs">Complete a habit or journal entry to get started</p>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'habit': return <Check className="w-4 h-4" />
    case 'journal': return <BookOpen className="w-4 h-4" />
    case 'reflection': return <MessageCircle className="w-4 h-4" />
    case 'quote': return <Quote className="w-4 h-4" />
    default: return <Circle className="w-4 h-4" />
  }
}
```

### Backend API Endpoints
- `GET /api/dashboard` - Get dashboard summary data
- `GET /api/dashboard/streaks` - Get habit streak data
- `GET /api/dashboard/mood-trends` - Get mood trend data

### Data Aggregation
```typescript
interface DashboardData {
  streaks: {
    habitId: string;
    title: string;
    currentStreak: number;
    longestStreak: number;
    completedToday: boolean;
  }[];
  moodTrends: {
    date: string;
    averageMood: number;
    entryCount: number;
  }[];
  summary: {
    totalHabits: number;
    activeStreaks: number;
    journalEntries: number;
    averageMood: number;
  };
}
```

### Performance Optimizations
- Server-side caching for dashboard data
- Incremental static regeneration for streak calculations
- Optimistic UI updates for real-time feel
- Lazy loading for chart components

### Chart Visualizations
- Streak progress bars with color coding
- Mood trend line chart with smooth curves
- Mini calendars showing completion patterns
- Progress circles for habit completion rates

## Testing Strategy

- Performance tests to verify <300ms load time
- Unit tests for data aggregation logic
- Integration tests for dashboard API
- Visual regression tests for chart components
- E2E tests for real-time updates
- Responsive design tests across devices