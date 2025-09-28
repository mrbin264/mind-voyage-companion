'use client'

import {
  Layout,
  PageHeader,
  PageContent,
  Section,
  Grid,
  Stack,
} from '@/components/ui/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Skeleton,
  Spinner,
  LoadingState,
  EmptyState,
  ErrorState,
  Alert,
  AlertTitle,
  AlertDescription,
  Progress,
  StatusIndicator,
} from '@/components/ui/feedback'
import {
  FormField,
  Textarea,
  Select,
  FormActions,
  Checkbox,
} from '@/components/ui/form'
import {
  Heart,
  Star,
  Coffee,
  Dumbbell,
  Book,
  Palette,
  Shield,
  Plus,
  Download,
  Settings,
  User,
  Bell,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react'

export default function StyleGuidePage() {
  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  return (
    <Layout>
      <PageContent>
        <PageHeader
          title="Design System Style Guide"
          description="A comprehensive showcase of all UI components, design tokens, and patterns used in the Mind Voyage Companion application."
        />

        {/* Color Palette */}
        <Section
          title="Color Palette"
          description="Our semantic color system ensures consistency and accessibility across the application."
        >
          <Grid cols={3} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Colors</CardTitle>
                <CardDescription>
                  Contemplative Blue - Our brand identity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-500" />
                    <span className="text-sm font-mono">
                      primary-500 (#0ca5e9)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-400" />
                    <span className="text-sm font-mono">primary-400</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary-600" />
                    <span className="text-sm font-mono">primary-600</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Secondary Colors</CardTitle>
                <CardDescription>
                  Wisdom Gold - For achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary-500" />
                    <span className="text-sm font-mono">
                      secondary-500 (#f59e0b)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary-400" />
                    <span className="text-sm font-mono">secondary-400</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-secondary-600" />
                    <span className="text-sm font-mono">secondary-600</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semantic Colors</CardTitle>
                <CardDescription>Status and feedback colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-success-500" />
                    <span className="text-sm font-mono">success-500</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-warning-500" />
                    <span className="text-sm font-mono">warning-500</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-error-500" />
                    <span className="text-sm font-mono">error-500</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-info-500" />
                    <span className="text-sm font-mono">info-500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          description="Consistent text hierarchy for improved readability."
        >
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1 - Hero Text</h1>
                  <code className="text-xs text-muted-foreground">
                    text-4xl font-bold
                  </code>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Heading 2 - Page Title</h2>
                  <code className="text-xs text-muted-foreground">
                    text-3xl font-bold
                  </code>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">
                    Heading 3 - Section Title
                  </h3>
                  <code className="text-xs text-muted-foreground">
                    text-2xl font-semibold
                  </code>
                </div>
                <div>
                  <h4 className="text-xl font-medium">
                    Heading 4 - Subsection
                  </h4>
                  <code className="text-xs text-muted-foreground">
                    text-xl font-medium
                  </code>
                </div>
                <div>
                  <p className="text-base">
                    Body text - This is the default text size for body content
                    and general reading.
                  </p>
                  <code className="text-xs text-muted-foreground">
                    text-base
                  </code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Small text - Used for secondary information and captions.
                  </p>
                  <code className="text-xs text-muted-foreground">
                    text-sm text-muted-foreground
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Buttons */}
        <Section
          title="Buttons"
          description="Interactive elements for user actions with multiple variants and states."
        >
          <Grid cols={2} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Button Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="md">
                  <Button>Default Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link Button</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Button Sizes & States</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="md">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading loadingText="Processing...">
                    Loading State
                  </Button>
                  <div className="flex gap-2">
                    <Button size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon-sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="icon-lg">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Form Elements */}
        <Section
          title="Form Elements"
          description="Input components with validation states and accessibility features."
        >
          <Grid cols={2} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="lg">
                  <Input
                    label="Default Input"
                    placeholder="Enter text here..."
                    description="This is a helper text"
                  />
                  <Input
                    label="Email Input"
                    type="email"
                    placeholder="john@example.com"
                    icon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Password Input"
                    type="password"
                    placeholder="Your password"
                  />
                  <Input
                    label="Error State"
                    error="This field is required"
                    placeholder="Invalid input"
                  />
                  <Input
                    label="Success State"
                    success="Perfect! This looks good"
                    placeholder="Valid input"
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Other Form Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="lg">
                  <Textarea
                    label="Message"
                    placeholder="Enter your message..."
                    description="Maximum 500 characters"
                  />
                  <Select
                    label="Select Option"
                    options={selectOptions}
                    placeholder="Choose an option..."
                  />
                  <Checkbox
                    label="Agreement"
                    description="I agree to the terms and conditions"
                  />
                  <FormActions align="between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Submit Form</Button>
                  </FormActions>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Cards */}
        <Section
          title="Cards"
          description="Container components for grouping related content."
        >
          <Grid cols={3} gap="md">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  A basic card with header and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the card content area where you can place any content.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" interactive>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover to see the effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card responds to hover and click interactions.
                </p>
              </CardContent>
            </Card>

            <Card variant="success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Success Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Success state with semantic colors.</p>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Badges */}
        <Section
          title="Badges"
          description="Small status indicators and labels."
        >
          <Card>
            <CardContent>
              <Grid cols={4} gap="md">
                <div className="space-y-3">
                  <h4 className="font-medium">Status Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Mood Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="mood-1">1</Badge>
                    <Badge variant="mood-2">2</Badge>
                    <Badge variant="mood-3">3</Badge>
                    <Badge variant="mood-4">4</Badge>
                    <Badge variant="mood-5">5</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">With Icons</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge icon={<Heart className="h-3 w-3" />}>Loved</Badge>
                    <Badge
                      variant="success"
                      icon={<CheckCircle className="h-3 w-3" />}
                    >
                      Complete
                    </Badge>
                    <Badge
                      variant="warning"
                      icon={<AlertCircle className="h-3 w-3" />}
                    >
                      Pending
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Sizes</h4>
                  <div className="flex flex-wrap gap-2 items-end">
                    <Badge size="sm">Small</Badge>
                    <Badge size="default">Default</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </Grid>
            </CardContent>
          </Card>
        </Section>

        {/* Feedback Components */}
        <Section
          title="Feedback & States"
          description="Loading states, alerts, and user feedback components."
        >
          <Grid cols={2} gap="lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loading States</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="lg">
                  <div className="space-y-2">
                    <h4 className="font-medium">Spinners</h4>
                    <div className="flex items-center gap-4">
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Skeletons</h4>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Status Indicators</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="online" />
                        <span className="text-sm">Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="away" />
                        <span className="text-sm">Away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="busy" />
                        <span className="text-sm">Busy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status="offline" />
                        <span className="text-sm">Offline</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Progress</h4>
                    <Progress value={75} />
                    <Progress value={45} variant="warning" />
                    <Progress value={90} variant="success" />
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alerts & Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack direction="vertical" gap="md">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is a default informational alert message.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your changes have been saved successfully.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Please review your input before proceeding.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Something went wrong. Please try again.
                    </AlertDescription>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Empty and Error States */}
          <Grid cols={2} gap="lg" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={<Book className="h-16 w-16" />}
                  title="No journal entries yet"
                  description="Start your mindfulness journey by creating your first journal entry."
                  action={<Button>Create Entry</Button>}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <ErrorState
                  title="Unable to load data"
                  description="We couldn't fetch your information. Please check your connection and try again."
                  action={<Button variant="outline">Try Again</Button>}
                />
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Icons */}
        <Section
          title="Iconography"
          description="Our curated icon set using Lucide React for consistency and clarity."
        >
          <Card>
            <CardContent>
              <Grid cols={6} gap="md">
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Heart className="h-6 w-6" />
                  <span className="text-xs text-center">Heart</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Star className="h-6 w-6" />
                  <span className="text-xs text-center">Star</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Coffee className="h-6 w-6" />
                  <span className="text-xs text-center">Coffee</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Dumbbell className="h-6 w-6" />
                  <span className="text-xs text-center">Dumbbell</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Book className="h-6 w-6" />
                  <span className="text-xs text-center">Book</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs text-center">Calendar</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Settings className="h-6 w-6" />
                  <span className="text-xs text-center">Settings</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <User className="h-6 w-6" />
                  <span className="text-xs text-center">User</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Bell className="h-6 w-6" />
                  <span className="text-xs text-center">Bell</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-xs text-center">TrendingUp</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Shield className="h-6 w-6" />
                  <span className="text-xs text-center">Shield</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg border">
                  <Download className="h-6 w-6" />
                  <span className="text-xs text-center">Download</span>
                </div>
              </Grid>
            </CardContent>
          </Card>
        </Section>
      </PageContent>
    </Layout>
  )
}
