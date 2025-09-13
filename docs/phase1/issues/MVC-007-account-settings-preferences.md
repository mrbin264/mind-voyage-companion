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

#### Settings Management Interface
```typescript
// components/settings/SettingsPage.tsx
interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    habitReminders: boolean
    journalPrompts: boolean
    weeklyReports: boolean
    email: boolean
    push: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    dataSharing: boolean
    analytics: boolean
  }
  habits: {
    defaultReminder: string // HH:MM format
    weekStart: 'monday' | 'sunday'
    streakReset: 'midnight' | 'sleep'
  }
  display: {
    density: 'comfortable' | 'compact'
    animations: boolean
    reducedMotion: boolean
  }
}

export function SettingsPage() {
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user', 'preferences'],
    queryFn: getUserPreferences,
  })
  
  const { mutate: updatePreferences, isPending } = useMutation({
    mutationFn: updateUserPreferences,
    onSuccess: () => {
      toast.success('Settings saved successfully')
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] })
    },
    onError: () => {
      toast.error('Failed to save settings')
    }
  })
  
  const [pendingChanges, setPendingChanges] = useState<Partial<UserPreferences>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const handlePreferenceChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }
  
  const handleSave = () => {
    updatePreferences(pendingChanges)
    setPendingChanges({})
    setHasUnsavedChanges(false)
  }
  
  const handleReset = () => {
    setPendingChanges({})
    setHasUnsavedChanges(false)
  }
  
  if (isLoading) return <SettingsSkeleton />
  
  const currentPreferences = { ...preferences, ...pendingChanges }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Save Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Customize your Mind Voyage experience</p>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      {/* Settings Sections */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings
            preferences={currentPreferences}
            onChange={handlePreferenceChange}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings
            preferences={currentPreferences}
            onChange={handlePreferenceChange}
          />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings
            preferences={currentPreferences}
            onChange={handlePreferenceChange}
          />
        </TabsContent>
        
        <TabsContent value="habits">
          <HabitSettings
            preferences={currentPreferences}
            onChange={handlePreferenceChange}
          />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
      
      {/* Unsaved Changes Warning */}
      <UnsavedChangesPrompt
        hasChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleReset}
      />
    </div>
  )
}

// components/settings/GeneralSettings.tsx
export function GeneralSettings({ preferences, onChange }: SettingsProps<UserPreferences>) {
  const { data: availableLanguages } = useQuery({
    queryKey: ['settings', 'languages'],
    queryFn: getAvailableLanguages,
    staleTime: Infinity,
  })
  
  const { data: timezones } = useQuery({
    queryKey: ['settings', 'timezones'],
    queryFn: getTimezones,
    staleTime: Infinity,
  })
  
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </Card.Title>
          <Card.Description>
            Customize how Mind Voyage looks and feels
          </Card.Description>
        </Card.Header>
        
        <Card.Content className="space-y-4">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <RadioGroup 
              value={preferences.theme} 
              onValueChange={(value) => onChange('theme', value as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                  <Sun className="w-4 h-4" />
                  Light
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                  <Moon className="w-4 h-4" />
                  Dark
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="w-4 h-4" />
                  System
                </label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Display Density */}
          <div className="space-y-2">
            <Label>Display Density</Label>
            <Select 
              value={preferences.display.density} 
              onValueChange={(value) => onChange('display', { 
                ...preferences.display, 
                density: value as any 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Choose how much space elements take up
            </p>
          </div>
          
          {/* Animation Preferences */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Animations</Label>
                <p className="text-xs text-gray-500">Enable smooth transitions and effects</p>
              </div>
              <Switch
                checked={preferences.display.animations}
                onCheckedChange={(checked) => onChange('display', {
                  ...preferences.display,
                  animations: checked
                })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Reduced Motion</Label>
                <p className="text-xs text-gray-500">Minimize motion for accessibility</p>
              </div>
              <Switch
                checked={preferences.display.reducedMotion}
                onCheckedChange={(checked) => onChange('display', {
                  ...preferences.display,
                  reducedMotion: checked
                })}
              />
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Localization
          </Card.Title>
          <Card.Description>
            Language and regional settings
          </Card.Description>
        </Card.Header>
        
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language */}
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => onChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages?.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Timezone */}
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={preferences.timezone} 
                onValueChange={(value) => onChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {timezones?.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
```

#### Notification & Privacy Settings
```typescript
// components/settings/NotificationSettings.tsx
export function NotificationSettings({ preferences, onChange }: SettingsProps<UserPreferences>) {
  const [testingNotification, setTestingNotification] = useState<string | null>(null)
  
  const testNotification = async (type: string) => {
    setTestingNotification(type)
    try {
      await sendTestNotification(type)
      toast.success('Test notification sent!')
    } catch (error) {
      toast.error('Failed to send test notification')
    } finally {
      setTestingNotification(null)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </Card.Title>
          <Card.Description>
            Choose when and how you'd like to be notified
          </Card.Description>
        </Card.Header>
        
        <Card.Content className="space-y-4">
          {/* Notification Types */}
          <div className="space-y-4">
            <NotificationToggle
              title="Habit Reminders"
              description="Get notified when it's time to complete your habits"
              checked={preferences.notifications.habitReminders}
              onCheckedChange={(checked) => onChange('notifications', {
                ...preferences.notifications,
                habitReminders: checked
              })}
              onTest={() => testNotification('habit')}
              isTesting={testingNotification === 'habit'}
            />
            
            <NotificationToggle
              title="Journal Prompts"
              description="Daily prompts to inspire your journaling practice"
              checked={preferences.notifications.journalPrompts}
              onCheckedChange={(checked) => onChange('notifications', {
                ...preferences.notifications,
                journalPrompts: checked
              })}
              onTest={() => testNotification('journal')}
              isTesting={testingNotification === 'journal'}
            />
            
            <NotificationToggle
              title="Weekly Reports"
              description="Summary of your progress and achievements"
              checked={preferences.notifications.weeklyReports}
              onCheckedChange={(checked) => onChange('notifications', {
                ...preferences.notifications,
                weeklyReports: checked
              })}
              onTest={() => testNotification('report')}
              isTesting={testingNotification === 'report'}
            />
          </div>
          
          <Separator />
          
          {/* Delivery Methods */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Delivery Methods</Label>
              <p className="text-sm text-gray-500">Choose how you want to receive notifications</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => onChange('notifications', {
                    ...preferences.notifications,
                    email: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-xs text-gray-500">Receive push notifications on your devices</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => onChange('notifications', {
                    ...preferences.notifications,
                    push: checked
                  })}
                />
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      
      <QuietHoursSettings preferences={preferences} onChange={onChange} />
    </div>
  )
}

// components/settings/NotificationToggle.tsx
interface NotificationToggleProps {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onTest: () => void
  isTesting: boolean
}

function NotificationToggle({ 
  title, 
  description, 
  checked, 
  onCheckedChange, 
  onTest, 
  isTesting 
}: NotificationToggleProps) {
  return (
    <div className="flex items-start justify-between space-x-4">
      <div className="flex-1">
        <Label className="text-sm font-medium">{title}</Label>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTest}
          disabled={!checked || isTesting}
        >
          {isTesting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>
        
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  )
}

// components/settings/AccountSettings.tsx
export function AccountSettings() {
  const { data: user } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
  })
  
  return (
    <div className="space-y-6">
      <ProfileCard user={user} />
      <SecuritySettings />
      <DataManagement />
      <DangerZone />
    </div>
  )
}

function DangerZone() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  return (
    <Card className="border-red-200">
      <Card.Header>
        <Card.Title className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </Card.Title>
        <Card.Description>
          Irreversible actions that affect your account
        </Card.Description>
      </Card.Header>
      
      <Card.Content className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
          <div>
            <Label className="text-red-700">Delete Account</Label>
            <p className="text-sm text-red-600">
              Permanently delete your account and all associated data
            </p>
          </div>
          
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </div>
        
        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      </Card.Content>
    </Card>
  )
}
```

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