# Dashboard & Core Features Wireframes (Desktop-First)

## 1. Main Dashboard

### Desktop Layout (1024px+) - Primary Design
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ Good morning, Maya! ☀️                         Friday, Sept 13    │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌────────────────────────────────────┐  ┌─────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ 🏛️ Daily Wisdom                    │  │ 🎯 Today's Focus        │ │ │
│ │                 │ │ │                                    │  │                         │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ "The best time to plant a tree    │  │ Complete 3 habits to    │ │ │
│ └─────────────────┘ │ │ was 20 years ago. The second      │  │ maintain your momentum  │ │ │
│                     │ │ best time is now."                 │  │                         │ │ │
│                     │ │                                    │  │ Progress: 1/3 ●○○       │ │ │
│                     │ │ — Chinese Proverb                  │  │                         │ │ │
│                     │ │                                    │  │ [View All Habits]       │ │ │
│                     │ │ [💫 Generate New Quote] [❤️ Save]   │  └─────────────────────────┘ │ │
│                     │ └────────────────────────────────────┘                            │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📈 Today's Habits                                                 [+ Add New Habit]    │ │
│ │                                                                                        │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐      │ │
│ │ │ ✅ Morning Pages │ │ 💧 Hydration     │ │ 📚 Reading      │ │ 🧘 Meditation   │      │ │
│ │ │                 │ │                 │ │                 │ │                 │      │ │
│ │ │ ✓ Completed     │ │ ○ 3/8 glasses   │ │ ○ 20 minutes    │ │ ○ Not started   │      │ │
│ │ │ 🔥 7-day streak │ │ 💪 75% complete │ │ 📖 In progress  │ │ 🎯 Planned      │      │ │
│ │ │                 │ │                 │ │                 │ │                 │      │ │
│ │ │ [View Details]  │ │ [Add Glass]     │ │ [Start Timer]   │ │ [Begin Session] │      │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘      │ │
│ └────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                            │
│ ┌─────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│ │ 📝 Quick Journal Entry              │ │ 📊 Weekly Progress                             │ │
│ │                                     │ │                                                │ │
│ │ How are you feeling today?          │ │ ┌──────────────────────────────────────────────┐ │ │
│ │                                     │ │ │        Habit Completion Rate                 │ │ │
│ │ 😔 😐 � 😄 🤗                      │ │ │                                              │ │ │
│ │     └─Selected                      │ │ │ Morning Pages  ████████░░ 80%                │ │ │
│ │                                     │ │ │ Hydration     ██████░░░░ 60%                │ │ │
│ │ ┌─────────────────────────────────┐ │ │ │ Reading       ███████░░░ 70%                │ │ │
│ │ │ What made today special?        │ │ │ │ Meditation    █████░░░░░ 50%                │ │ │
│ │ │                                 │ │ │ │                                              │ │ │
│ │ │ Today I practiced patience      │ │ │ │ [View Full Analytics]                        │ │ │
│ │ │ when dealing with a difficult   │ │ │ └──────────────────────────────────────────────┘ │ │
│ │ │ situation at work...            │ │ │                                                │ │
│ │ └─────────────────────────────────┘ │ │ 🎖️ Achievements This Week:                     │ │ │
│ │                                     │ │ ✓ 7-day Morning Pages streak                   │ │ │
│ │ [💾 Save Entry] [� Private]        │ │ ✓ 5 consecutive journaling days                │ │ │
│ │                                     │ │ ⭐ Ready for: Consistency Champion             │ │ │
│ └─────────────────────────────────────┘ └────────────────────────────────────────────────┘ │
│                                                                                            │
│ ┌─────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│ │ 🎯 Recommendations                  │ │ ⚡ Quick Actions                                │ │ │
│ │                                     │ │                                                │ │
│ │ Based on your patterns:             │ │ ┌─────────────────┐ ┌────────────────────────┐ │ │
│ │                                     │ │ │ 📝 Journal      │ │ 🏛️ Get Daily Wisdom    │ │ │
│ │ • Try meditating after reading     │ │ │ [Quick Entry]   │ │ [New Quote]            │ │ │
│ │ • Your hydration improves on        │ │ └─────────────────┘ └────────────────────────┘ │ │
│ │   journaling days                   │ │                                                │ │
│ │ • Consider a evening routine        │ │ ┌─────────────────┐ ┌────────────────────────┐ │ │
│ │                                     │ │ │ 📊 Analytics    │ │ ⚙️ Settings            │ │ │
│ │ [✨ Get Pro AI Insights]             │ │ │ [View Reports]  │ │ [Preferences]          │ │ │
│ └─────────────────────────────────────┘ │ └─────────────────┘ └────────────────────────┘ │ │
│                                         └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Layout (768px - 1023px)

### Desktop Layout (1024px+)
```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo] Mind Voyage Companion             🔔 ⚙️ 👤 Maya            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Good morning, Maya! ☀️                               Fri, Sep 13   │
│                                                                    │
│ ┌─────────────────────┐  ┌───────────────────────────────────────┐ │
│ │ Today's Stoic Quote │  │ Habit Progress Overview               │ │
│ │                     │  │                                       │ │
│ │ "The best time to   │  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │ │
│ │ plant a tree was 20 │  │ │  ✓  │ │ 3/8 │ │  ○  │ │  ✓  │      │ │
│ │ years ago. The      │  │ │Pages│ │Water│ │Read │ │Walk │      │ │
│ │ second best time    │  │ │🔥 7 │ │💧   │ │📚   │ │🚶 3 │      │ │
│ │ is now."            │  │ └─────┘ └─────┘ └─────┘ └─────┘      │ │
│ │                     │  │                                       │ │
│ │ - Chinese Proverb   │  │ Overall: 2/4 complete (50%)          │ │
│ └─────────────────────┘  └───────────────────────────────────────┘ │
│                                                                    │
│ ┌─────────────────────┐  ┌───────────────────────────────────────┐ │
│ │ Mood Check-in       │  │ Recent Journal Entries               │ │
│ │                     │  │                                       │ │
│ │ How are you feeling │  │ Sep 12 - "Today was challenging...   │ │
│ │ today?              │  │ Sep 11 - "Grateful for small wins... │ │
│ │                     │  │ Sep 10 - "Feeling more focused...    │ │
│ │ 😔 😐 😊 😄 🤗      │  │                                       │ │
│ │       ↑             │  │ [✏️ New Entry]                       │ │
│ │                     │  │                                       │ │
│ │ [Continue to        │  │ [📊 View All Entries]                │ │
│ │  Journal]           │  │                                       │ │
│ └─────────────────────┘  └───────────────────────────────────────┘ │
│                                                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ Week Overview                                                   │ │
│ │                                                                 │ │
│ │ Mon  Tue  Wed  Thu  Fri  Sat  Sun                              │ │
│ │ ✓✓✓  ✓✓○  ✓○○  ○✓✓  ??   ??   ??                              │ │
│ │                                                                 │ │
│ │ This week: 7/12 habits completed                               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
```

## 2. Habit Management

### Desktop Habit List View (1024px+) - Primary Design
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ 📈 My Habits                           [+ Add New Habit] [⚙️ Settings] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌──────────────────────────────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Today's Progress: 3/6 habits completed (50%)               │ │ │
│ │                 │ │ │ 🔥 Current longest streak: 12 days (Morning Pages)          │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ 📊 This week: 21/42 total completions                       │ │ │
│ └─────────────────┘ │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────┐ │ │
│                     │ │ All Habits    │ │ Active (6)    │ │ Paused (2)    │ │ Archive │ │ │
│                     │ │ ●●●●●●●●○○    │ │ ●●●●●●●●●●    │ │ ○○○○○○○○○○    │ │ ○○○○○○○ │ │ │
│                     │ └───────────────┘ └───────────────┘ └───────────────┘ └─────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ ✅ Morning Pages                              🔥 12 day streak │ │ │
│                     │ │ Write 3 pages of stream-of-consciousness thoughts            │ │ │
│                     │ │ Every day • Last completed: Today at 7:23 AM                 │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Weekly Progress: ●●●●●●● 100% (7/7)                        │ │ │
│                     │ │ [View Details] [Edit Habit] [⋮ More]                        │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 💧 Drink 8 Glasses of Water                         Progress │ │ │
│                     │ │ Stay hydrated throughout the day                   ████░░░░ │ │ │
│                     │ │ Every day • Current: 5/8 glasses • Goal: 8 glasses    5/8  │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Weekly Progress: ●●●●●○○ 71% (5/7)                         │ │ │
│                     │ │ [Add Glass] [View History] [Edit] [⋮ More]                  │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📚 Read for 20 Minutes                              In Progress │ │ │
│                     │ │ Expand knowledge through daily reading                       │ │ │
│                     │ │ Every day • Started: 2:30 PM • Elapsed: 12 min              │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Weekly Progress: ●●●●○○○ 57% (4/7)                         │ │ │
│                     │ │ [Continue Timer] [Pause] [Complete] [⋮ More]                │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 🚶 Evening Walk                                     Not Started │ │ │
│                     │ │ Take a peaceful walk to unwind from the day                 │ │ │
│                     │ │ Mon, Wed, Fri • Next scheduled: Today at 6:00 PM             │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Weekly Progress: ●●○ 67% (2/3 scheduled)                    │ │ │
│                     │ │ [Start Walk] [Skip Today] [Edit Schedule] [⋮ More]          │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 🧘 Meditation                                          Paused │ │ │
│                     │ │ Practice mindfulness and inner peace                         │ │ │
│                     │ │ Every day • Paused on: Sep 10 • Last streak: 5 days          │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Weekly Progress: ○○○○○○○ 0% (0/7) - Paused                  │ │ │
│                     │ │ [Resume Habit] [Delete] [View History] [⋮ More]             │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Habit Details/Edit (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ← Back to Habits          📈 Morning Pages                [Save Changes] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌──────────────────────────────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Habit Overview                                               │ │ │
│ │                 │ │ │ Current Streak: 🔥 12 days  •  Best Streak: 🏆 15 days      │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ Total Completions: 89  •  Success Rate: 78%                 │ │ │
│ └─────────────────┘ │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│                     │ │ Habit Configuration                 │ │ Progress Calendar       │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │  September 2025         │ │ │
│                     │ │ │ Habit Name                      │ │ │ Su Mo Tu We Th Fr Sa    │ │ │
│                     │ │ │ Morning Pages                   │ │ │  1  2  3  4  5  6  7    │ │ │
│                     │ │ └─────────────────────────────────┘ │ │  8  9 10 11 12 ✓ ✓    │ │ │
│                     │ │                                     │ │ ✓ ✓ ✓ ✓ ✓ ✓ ✓          │ │ │
│                     │ │ Description                         │ │ 22 23 24 25 26 27 28    │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │ 29 30                   │ │ │
│                     │ │ │ Write 3 pages of stream-of-     │ │ │                         │ │ │
│                     │ │ │ consciousness thoughts first    │ │ │ ✓ Completed  ○ Missed   │ │ │
│                     │ │ │ thing in the morning to clear  │ │ │                         │ │ │
│                     │ │ │ the mind and set intentions    │ │ │ [← Previous Month]      │ │ │
│                     │ │ │ for the day.                   │ │ │ [Next Month →]          │ │ │
│                     │ │ └─────────────────────────────────┘ │ └─────────────────────────┘ │ │
│                     │ │                                     │                           │ │
│                     │ │ Schedule                            │ ┌─────────────────────────┐ │ │
│                     │ │ ● Every day                        │ │ Statistics              │ │ │
│                     │ │ ○ Specific days:                   │ │                         │ │ │
│                     │ │   ☐M ☐T ☐W ☐T ☐F ☐S ☐S           │ │ This Month: 12/13 (92%) │ │ │
│                     │ │ ○ Weekly (every X days)            │ │ This Week: 7/7 (100%)  │ │ │
│                     │ │                                     │ │ Best Streak: 15 days    │ │ │
│                     │ │ Reminder                           │ │ Average/Week: 6.8       │ │ │
│                     │ │ ☑ Enable reminder                  │ │                         │ │ │
│                     │ │ Time: [07:00 AM ▼]                 │ │ Mood Correlation:       │ │ │
│                     │ │ ☐ Include motivational message     │ │ Happy: 78%              │ │ │
│                     │ │                                     │ │ Productive: 85%         │ │ │
│                     │ │ Category                           │ │ Stressed: 23%           │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │                         │ │ │
│                     │ │ │ 🧠 Personal Growth           ▼ │ │ │ [📊 Detailed Analytics] │ │ │
│                     │ │ └─────────────────────────────────┘ │ └─────────────────────────┘ │ │
│                     │ └─────────────────────────────────────┘                           │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ Danger Zone                                                  │ │ │
│                     │ │                                                              │ │ │
│                     │ │ [Pause Habit] [Reset Streak] [Archive Habit] [Delete Habit] │ │ │
│                     │ │                                                              │ │ │
│                     │ │ ⚠️ These actions cannot be undone                            │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Add New Habit (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ← Cancel                     Create New Habit              [Create Habit] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Habit Details                       │ │ Popular Templates       │ │ │
│ │                 │ │ │                                     │ │                         │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ ┌─────────────────────────────────┐ │ │ ┌─────────────────────┐ │ │ │
│ └─────────────────┘ │ │ │ Habit Name *                    │ │ │ │ 💧 Drink Water      │ │ │ │
│                     │ │ │                                 │ │ │ │ 8 glasses daily     │ │ │ │
│                     │ │ └─────────────────────────────────┘ │ │ │ [Use Template]      │ │ │ │
│                     │ │                                     │ │ └─────────────────────┘ │ │ │
│                     │ │ Description (Optional)              │ │                         │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │ ┌─────────────────────┐ │ │ │
│                     │ │ │ What does this habit involve?   │ │ │ │ 📚 Daily Reading    │ │ │ │
│                     │ │ │ Why is it important to you?     │ │ │ │ 20 minutes          │ │ │ │
│                     │ │ │                                 │ │ │ │ [Use Template]      │ │ │ │
│                     │ │ └─────────────────────────────────┘ │ │ └─────────────────────┘ │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ How often? *                        │ │ ┌─────────────────────┐ │ │ │
│                     │ │ ● Every day                        │ │ │ 🚶 Exercise Daily   │ │ │ │
│                     │ │ ○ Specific days of the week        │ │ │ Walk, run, or gym   │ │ │ │
│                     │ │   ☐M ☐T ☐W ☐T ☐F ☐S ☐S            │ │ │ [Use Template]      │ │ │ │
│                     │ │ ○ Every X days: [2▼] days          │ │ └─────────────────────┘ │ │ │
│                     │ │ ○ Custom schedule                  │ │                         │ │ │
│                     │ │                                     │ │ ┌─────────────────────┐ │ │ │
│                     │ │ Category                           │ │ │ 🧘 Meditation       │ │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │ │ 10 minutes daily    │ │ │ │
│                     │ │ │ 💪 Health & Fitness          ▼ │ │ │ │ [Use Template]      │ │ │ │
│                     │ │ └─────────────────────────────────┘ │ │ └─────────────────────┘ │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ ☑ Enable reminders                 │ │ ┌─────────────────────┐ │ │ │
│                     │ │ Time: [09:00 AM ▼]                 │ │ │ ✍️ Custom Habit     │ │ │ │
│                     │ │ ☐ Include motivational message     │ │ │ Create from scratch │ │ │ │
│                     │ │                                     │ │ │ [Start Fresh]       │ │ │ │
│                     │ │ Goal (Optional)                    │ │ └─────────────────────┘ │ │ │
│                     │ │ ┌─────────────────┐ ┌─────────────┐ │ └─────────────────────────┘ │ │
│                     │ │ │ Target: 1    ▼ │ │ glasses/day │ │                           │ │
│                     │ │ └─────────────────┘ └─────────────┘ │                           │ │
│                     │ └─────────────────────────────────────┘                           │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 💡 Tips for Success:                                          │ │ │
│                     │ │ • Start small - it's better to do 5 minutes daily than       │ │ │
│                     │ │   30 minutes once a week                                      │ │ │
│                     │ │ • Stack habits - attach new habits to existing routines      │ │ │
│                     │ │ • Be specific - "exercise" vs "walk for 20 minutes"          │ │ │
│                     │ │ • Track your why - understanding motivation helps consistency │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Habit Management Layouts (320px - 767px)
```
┌─────────────────────────┐
│ ← Habits           + Add│
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Morning Pages     │ │
│ │   Every day         │ │
│ │   🔥 7 day streak   │ │
│ │   ⋮                │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ○ Drink 8 glasses   │ │
│ │   Every day         │ │
│ │   💧 3/8 today      │ │
│ │   Last: 2 days ago  │ │
│ │   ⋮                │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ○ Evening walk      │ │
│ │   Mon, Wed, Fri     │ │
│ │   🚶 Next: Today    │ │
│ │   ⋮                │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ○ Meditation        │ │
│ │   Every day         │ │
│ │   🧘 Paused         │ │
│ │   ⋮                │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Habit Detail/Edit (Mobile)
```
┌─────────────────────────┐
│ ← Back             Done │
│                         │
│ Edit Habit              │
│                         │
│ ┌─────────────────────┐ │
│ │ Morning Pages       │ │
│ └─────────────────────┘ │
│                         │
│ Schedule                │
│ ● Every day             │
│ ○ Specific days         │
│ ○ Weekly                │
│                         │
│ ☐ Reminder              │
│ Time: 7:00 AM           │
│                         │
│ Notes (optional)        │
│ ┌─────────────────────┐ │
│ │ Write 3 pages of    │ │
│ │ stream of conscious │ │
│ │ thoughts first thing│ │
│ │ in the morning      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │    Save Changes     │ │
│ └─────────────────────┘ │
│                         │
│ [Archive Habit]         │
│ [Delete Habit]          │
└─────────────────────────┘
```

### Add New Habit (Mobile)
```
┌─────────────────────────┐
│ ← Cancel          Create│
│                         │
│ New Habit               │
│                         │
│ ┌─────────────────────┐ │
│ │ Habit name          │ │
│ └─────────────────────┘ │
│                         │
│ How often?              │
│ ● Every day             │
│ ○ Specific days:        │
│   ☐M ☐T ☐W ☐T ☐F ☐S ☐S │
│ ○ Weekly                │
│                         │
│ Category (optional)     │
│ ┌─────────────────────┐ │
│ │ Health & Fitness ▼  │ │
│ └─────────────────────┘ │
│                         │
│ ☐ Set reminder          │
│                         │
│ Quick templates:        │
│ ┌─────────────────────┐ │
│ │ 💧 Drink water      │ │
│ │ 📚 Read daily       │ │
│ │ 🚶 Exercise         │ │
│ │ 🧘 Meditate         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │   Create Habit      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 3. Journal Interface

### Desktop Journal Entry (1024px+) - Primary Design
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ 📝 Today's Journal Entry                     [💾 Save] [🔒 Privacy] │ │
│ │ 📊 Analytics    │ │ Friday, September 13, 2025                                         │ │
│ │ 🏛️ Wisdom       │ │                                                                    │ │
│ │ ⚙️  Settings    │ │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│ │                 │ │ │ Writing Area                        │ │ Today's Prompts         │ │ │
│ │ 🌟 Upgrade Pro  │ │ │                                     │ │                         │ │ │
│ └─────────────────┘ │ │ │ Mood Check-in:                      │ │ 💭 Reflection:          │ │ │
│                     │ │ │ 😔 😐 😊 😄 🤗                      │ │ "What small action      │ │ │
│                     │ │ │     └─ Selected: 😊                │ │ today moved you closer  │ │ │
│                     │ │ │                                     │ │ to your goals?"         │ │ │
│                     │ │ │ ┌─────────────────────────────────┐ │ │                         │ │ │
│                     │ │ │ │ Today was a wonderful day       │ │ │ 🙏 Gratitude:           │ │ │
│                     │ │ │ │ because I completed my morning  │ │ │ "What are you grateful  │ │ │
│                     │ │ │ │ pages habit for the 12th        │ │ │ for today?"             │ │ │
│                     │ │ │ │ consecutive day. This simple    │ │ │                         │ │ │
│                     │ │ │ │ practice has helped me gain     │ │ │ 🎯 Tomorrow:            │ │ │
│                     │ │ │ │ clarity about my priorities     │ │ │ "What's your intention  │ │ │
│                     │ │ │ │ and feel more centered.         │ │ │ for tomorrow?"          │ │ │
│                     │ │ │ │                                 │ │ │                         │ │ │
│                     │ │ │ │ I also made progress on my      │ │ │ [Use This Prompt]       │ │ │
│                     │ │ │ │ reading habit, finishing        │ │ │ [Get New Prompt]        │ │ │
│                     │ │ │ │ another chapter of "Meditations"│ │ └─────────────────────────┘ │ │
│                     │ │ │ │ by Marcus Aurelius. The wisdom  │ │                           │ │
│                     │ │ │ │ about accepting what we cannot  │ │ ┌─────────────────────────┐ │ │ │
│                     │ │ │ │ control really resonated with   │ │ │ Writing Statistics      │ │ │
│                     │ │ │ │ me today...                     │ │ │                         │ │ │
│                     │ │ │ │                                 │ │ │ Words: 247              │ │ │
│                     │ │ │ │ [Continue writing...]           │ │ │ Characters: 1,453       │ │ │
│                     │ │ │ └─────────────────────────────────┘ │ │ Reading time: ~1 min    │ │ │
│                     │ │ │                                     │ │                         │ │ │
│                     │ │ │ Tags (optional):                    │ │ Journal Streak:         │ │ │
│                     │ │ │ #gratitude #habits #stoicism        │ │ 🔥 5 days               │ │ │
│                     │ │ │                                     │ │                         │ │ │
│                     │ │ │ Privacy: 🔒 Private to me           │ │ Recent Entries:         │ │ │
│                     │ │ │                                     │ │ • Sep 12: "Challenging  │ │ │
│                     │ │ └─────────────────────────────────────┘ │   but rewarding..."     │ │ │
│                     │ │                                         │ • Sep 11: "Small wins   │ │ │
│                     │ │ ┌─────────────────────────────────────┐ │   add up..."            │ │ │
│                     │ │ │ AI Enhancement (Pro) ✨              │ │ • Sep 10: "Feeling     │ │ │
│                     │ │ │                                     │ │   more focused..."      │ │ │
│                     │ │ │ Enhance your writing with AI-      │ │                         │ │ │
│                     │ │ │ powered suggestions for grammar,    │ │ [View All Entries]      │ │ │
│                     │ │ │ style, and emotional expression.    │ │                         │ │ │
│                     │ │ │                                     │ │ ⭐ Pro Tip:             │ │ │
│                     │ │ │ [✨ Enhance Writing] [Learn More]    │ │ Try writing after       │ │ │
│                     │ │ └─────────────────────────────────────┘ │ completing habits for   │ │ │
│                     │ │                                         │ better reflection!      │ │ │
│                     │ └─────────────────────────────────────────┘ └─────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Journal History (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ 📖 Journal History            [🔍 Search Entries] [📤 Export] [⚙️ Settings] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌──────────────────────────────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ 📊 Journal Overview                                          │ │ │
│ │                 │ │ │ Total entries: 127 • Current streak: 🔥 5 days               │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ Average words: 234 • Most active: Evenings                  │ │ │
│ └─────────────────┘ │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────┐ │ │
│                     │ │ All Entries   │ │ This Month    │ │ Favorites     │ │ Tags    │ │ │
│                     │ │ ●●●●●●●●●●    │ │ ●●●●●●●●○○    │ │ ●●●○○○○○○○    │ │ ○○○○○○○ │ │ │
│                     │ └───────────────┘ └───────────────┘ └───────────────┘ └─────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📝 Today • Friday, September 13, 2025              😊 Content │ │ │
│                     │ │ "Today was a wonderful day because I completed my morning     │ │ │
│                     │ │ pages habit for the 12th consecutive day. This simple        │ │ │
│                     │ │ practice has helped me gain clarity..."                      │ │ │
│                     │ │                                                              │ │ │
│                     │ │ 247 words • 2 min read • Tags: #gratitude #habits #stoicism │ │ │
│                     │ │ [Read Full Entry] [Edit] [❤️ Favorite] [🔗 Share]            │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📝 Yesterday • Thursday, September 12, 2025        😐 Neutral │ │ │
│                     │ │ "Today was challenging, but I'm learning to embrace          │ │ │
│                     │ │ difficulties as opportunities for growth. My meditation      │ │ │
│                     │ │ practice helped me stay centered when things got busy..."    │ │ │
│                     │ │                                                              │ │ │
│                     │ │ 312 words • 3 min read • Tags: #challenges #growth #meditation │ │ │
│                     │ │ [Read Full Entry] [Edit] [❤️ Favorite] [🔗 Share]            │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📝 Sep 11 • Wednesday                                😄 Happy │ │ │
│                     │ │ "Small wins are adding up! I successfully completed all my   │ │ │
│                     │ │ habits today and felt a real sense of accomplishment. The    │ │ │
│                     │ │ key seems to be consistency rather than perfection..."       │ │ │
│                     │ │                                                              │ │ │
│                     │ │ 189 words • 2 min read • Tags: #progress #consistency #wins  │ │ │
│                     │ │ [Read Full Entry] [Edit] [❤️ Favorite] [🔗 Share]            │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📝 Sep 10 • Tuesday                                😊 Content │ │ │
│                     │ │ "Feeling more focused after establishing my morning routine.  │ │ │
│                     │ │ The combination of journaling and light exercise really sets │ │ │
│                     │ │ a positive tone for the entire day..."                       │ │ │
│                     │ │                                                              │ │ │
│                     │ │ 203 words • 2 min read • Tags: #routine #focus #morning      │ │ │
│                     │ │ [Read Full Entry] [Edit] [❤️ Favorite] [🔗 Share]            │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ [Load More Entries...]                                             │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tablet Journal Interface (768px - 1023px)
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ ☰ Mind Voyage Companion           🔍 [Search] 🔔 [3] 👤 Maya    │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 📝 Today's Journal Entry        [💾 Save] [🔒 Privacy]     │ │
│ │ Friday, September 13, 2025                                  │ │
│ │                                                            │ │
│ │ ┌──────────────────────────────────────────────────────┐   │ │
│ │ │ Writing Area                                         │   │ │
│ │ │                                                      │   │ │
│ │ │ Mood: 😔 😐 😊 😄 🤗  └─ Selected: 😊               │   │ │
│ │ │                                                      │   │ │
│ │ │ ┌──────────────────────────────────────────────────┐ │   │ │
│ │ │ │ Today was a wonderful day because I completed    │ │   │ │
│ │ │ │ my morning pages habit for the 12th consecutive  │ │   │ │
│ │ │ │ day. This simple practice has helped me gain     │ │   │ │
│ │ │ │ clarity about my priorities and feel more        │ │   │ │
│ │ │ │ centered.                                        │ │   │ │
│ │ │ │                                                  │ │   │ │
│ │ │ │ I also made progress on my reading habit...      │ │   │ │
│ │ │ │                                                  │ │   │ │
│ │ │ │ [Continue writing...]                            │ │   │ │
│ │ │ └──────────────────────────────────────────────────┘ │   │ │
│ │ │                                                      │   │ │
│ │ │ Tags: #gratitude #habits #stoicism                   │   │ │
│ │ │ Privacy: 🔒 Private to me                            │   │ │
│ │ └──────────────────────────────────────────────────────┘   │ │
│ │                                                            │ │
│ │ ┌──────────────────────┐ ┌──────────────────────────────┐ │ │
│ │ │ Today's Prompts      │ │ Writing Statistics           │ │ │
│ │ │                      │ │                              │ │ │
│ │ │ 💭 Reflection:       │ │ Words: 247                   │ │ │
│ │ │ "What small action   │ │ Characters: 1,453            │ │ │
│ │ │ today moved you      │ │ Reading time: ~1 min         │ │ │
│ │ │ closer to goals?"    │ │                              │ │ │
│ │ │                      │ │ Journal Streak: 🔥 5 days    │ │ │
│ │ │ [Use This Prompt]    │ │                              │ │ │
│ │ │ [Get New Prompt]     │ │ Recent Entries:              │ │ │
│ │ │                      │ │ • Sep 12: "Challenging..."   │ │ │
│ │ └──────────────────────┘ │ • Sep 11: "Small wins..."    │ │ │
│ │                          │ • Sep 10: "More focused..."  │ │ │
│ │ ┌─────────────────────────┘                             │ │ │
│ │ │ AI Enhancement (Pro) ✨                               │ │ │
│ │ │ [✨ Enhance Writing] [Learn More]                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Journal Interface (320px - 767px)
```
┌─────────────────────────┐
│ ← Back             Save │
│                         │
│ Today's Entry           │
│ Friday, September 13    │
│                         │
│ Mood Check-in           │
│ 😔 😐 😊 😄 🤗          │
│       ↑ Selected        │
│                         │
│ Today's Prompt:         │
│ ┌─────────────────────┐ │
│ │ "What small action  │ │
│ │ today moved you     │ │
│ │ closer to your      │ │
│ │ goals?"             │ │
│ └─────────────────────┘ │
│                         │
│ Your Reflection:        │
│ ┌─────────────────────┐ │
│ │ Today I completed   │ │
│ │ my morning pages    │ │
│ │ which helped me     │ │
│ │ clarify my          │ │
│ │ priorities. I'm     │ │
│ │ grateful for small  │ │
│ │ moments of peace    │ │
│ │ in a busy day...    │ │
│ │                     │ │
│ │ [Continue writing]  │ │
│ └─────────────────────┘ │
│                         │
│ Word count: 234         │
└─────────────────────────┘
```

### Journal History (Mobile)
```
┌─────────────────────────┐
│ ← Back       🔍 Filter   │
│                         │
│ Journal Entries         │
│                         │
│ This Week               │
│ ┌─────────────────────┐ │
│ │ Today 🤗            │ │
│ │ "Today I completed  │ │
│ │ my morning..."      │ │
│ │ 234 words          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Yesterday 😊        │ │
│ │ "Feeling grateful   │ │
│ │ for progress..."    │ │
│ │ 156 words          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Sep 11 😐           │ │
│ │ "Challenging day    │ │
│ │ but stayed..."      │ │
│ │ 89 words           │ │
│ └─────────────────────┘ │
│                         │
│ Previous Week           │
│ ┌─────────────────────┐ │
│ │ Sep 8 😄            │ │
│ │ "Great breakthrough │ │
│ │ in understanding..."│ │
│ │ 312 words          │ │
│ └─────────────────────┘ │
│                         │
│ [+ New Entry]           │
└─────────────────────────┘
```

## 4. Progress Analytics

### Statistics View (Mobile)
```
┌─────────────────────────┐
│ ← Back        📊 Export  │
│                         │
│ Your Progress           │
│                         │
│ ┌─────────────────────┐ │
│ │ Current Streaks     │ │
│ │                     │ │
│ │ Morning Pages 🔥 7  │ │
│ │ Evening Walk  🔥 3  │ │
│ │ Meditation    🔥 1  │ │
│ │                     │ │
│ │ Longest: 21 days    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ This Week           │ │
│ │                     │ │
│ │ Habits: 15/21 (71%) │ │
│ │ Journal: 5/7 days   │ │
│ │ Avg Mood: 😊 (4.2)  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Monthly Trends      │ │
│ │                     │ │
│ │ [📈 Chart showing   │ │
│ │  habit completion   │ │
│ │  and mood trends    │ │
│ │  over time]         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Journal Insights    │ │
│ │                     │ │
│ │ Total entries: 45   │ │
│ │ Average words: 187  │ │
│ │ Most active: Tues   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 5. Settings & Profile

### Settings Menu (Mobile)
```
┌─────────────────────────┐
│ ← Back                  │
│                         │
│ Settings                │
│                         │
│ Account                 │
│ ┌─────────────────────┐ │
│ │ 👤 Profile         >│ │
│ │ 🔔 Notifications   >│ │
│ │ 🔐 Privacy         >│ │
│ └─────────────────────┘ │
│                         │
│ Preferences             │
│ ┌─────────────────────┐ │
│ │ 🌍 Language        >│ │
│ │ 🕒 Timezone        >│ │
│ │ 🎨 Theme           >│ │
│ └─────────────────────┘ │
│                         │
│ Data                    │
│ ┌─────────────────────┐ │
│ │ 📤 Export Data     >│ │
│ │ 🗂️ Import Data     >│ │
│ │ 🗑️ Delete Account  >│ │
│ └─────────────────────┘ │
│                         │
│ Support                 │
│ ┌─────────────────────┐ │
│ │ 📚 Help & FAQ      >│ │
│ │ 💬 Contact Support >│ │
│ │ 📝 Privacy Policy  >│ │
│ │ 📄 Terms of Use    >│ │
│ └─────────────────────┘ │
│                         │
│ Version 1.0.0           │
└─────────────────────────┘
```

## Interactive States & Animations

### Habit Completion Animation
```
Before:                After:
┌─────────────────────┐  ┌─────────────────────┐
│ ○ Morning Pages     │  │ ✓ Morning Pages     │
│   Every day         │  │   Every day         │
│   🔥 6 day streak   │  │   🔥 7 day streak   │
└─────────────────────┘  └─────────────────────┘
                           ↑ 
                         Bounce animation
                         + Green highlight
                         + Streak increment
```

### Loading States
```
┌─────────────────────────┐
│ Loading your habits...  │
│                         │
│ ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │ ← Skeleton cards
│                         │
│ ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│                         │
│ ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
└─────────────────────────┘
```

### Empty States
```
┌─────────────────────────┐
│                         │
│ 🌱                      │
│                         │
│ No habits yet           │
│                         │
│ Start building better   │
│ habits today! Create    │
│ your first habit to     │
│ begin your journey.     │
│                         │
│ ┌─────────────────────┐ │
│ │   Add First Habit   │ │
│ └─────────────────────┘ │
│                         │
│ [Browse Templates]      │
└─────────────────────────┘
```

This wireframe specification covers all core functionality with clear interaction patterns, proper responsive behavior, and consistent visual hierarchy for optimal user experience.