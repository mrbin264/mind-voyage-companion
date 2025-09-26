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

## 4. Analytics & Insights

### Desktop Analytics Dashboard (1024px+) - Primary Design
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ 📊 Analytics & Insights               [📤 Export Report] [⚙️ Settings] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌──────────────────────────────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ 📈 Overview - September 2025                                 │ │ │
│ │                 │ │ │ Current streak: 🔥 12 days  •  Best month: August (94%)      │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ Total habits completed: 247  •  Journal entries: 23          │ │ │
│ └─────────────────┘ │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌─────────┐ │ │
│                     │ │ This Week     │ │ This Month    │ │ 3 Months      │ │ All Time│ │ │
│                     │ │ ●●●●●●●●●●    │ │ ●●●●●●●●○○    │ │ ●●●●●●●○○○    │ │ ○○○○○○○ │ │ │
│                     │ └───────────────┘ └───────────────┘ └───────────────┘ └─────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│                     │ │ 📈 Habit Completion Trends          │ │ 🎯 Current Streaks      │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ ┌─────────────────────────────────┐ │ │ ┌─────────────────────┐ │ │ │
│                     │ │ │          Weekly Progress        │ │ │ │ 📝 Morning Pages   │ │ │ │
│                     │ │ │                                 │ │ │ │    🔥 12 days      │ │ │ │
│                     │ │ │ 100% ┌─┐     ┌─┐     ┌─┐       │ │ │ │    Best: 21 days   │ │ │ │
│                     │ │ │  75% │ │ ┌─┐ │ │ ┌─┐ │ │       │ │ │ └─────────────────────┘ │ │ │
│                     │ │ │  50% │ │ │ │ │ │ │ │ │ │ ┌─┐   │ │ │                         │ │ │
│                     │ │ │  25% │ │ │ │ │ │ │ │ │ │ │ │   │ │ │ ┌─────────────────────┐ │ │ │
│                     │ │ │   0% └─┘ └─┘ └─┘ └─┘ └─┘ └─┘   │ │ │ │ 💧 Hydration       │ │ │ │
│                     │ │ │      W37  W38  W39  W40  W41   │ │ │ │    🔥 5 days       │ │ │ │
│                     │ │ │                                 │ │ │ │    Best: 15 days   │ │ │ │
│                     │ │ └─────────────────────────────────┘ │ │ └─────────────────────┘ │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ Overall Completion: 78% this month  │ │ ┌─────────────────────┐ │ │ │
│                     │ │ Best performing: Weekends (89%)     │ │ │ 📚 Reading         │ │ │ │
│                     │ │ Needs attention: Weekdays (71%)     │ │ │    🔥 3 days       │ │ │ │
│                     │ │                                     │ │ │    Best: 8 days    │ │ │ │
│                     │ └─────────────────────────────────────┘ │ └─────────────────────┘ │ │ │
│                     │                                         │                         │ │ │
│                     │ ┌─────────────────────────────────────┐ │ 🏆 Achievements:        │ │ │
│                     │ │ 😊 Mood & Habit Correlation         │ │ ✓ Week Warrior          │ │ │ │
│                     │ │                                     │ │ ✓ Consistency Champion  │ │ │ │
│                     │ │ Your mood is highest on days when:  │ │ ⭐ Next: Monthly Master │ │ │ │
│                     │ │                                     │ │   (Progress: 23/30)    │ │ │ │
│                     │ │ ✓ Morning Pages completed (4.2/5)   │ │                         │ │ │
│                     │ │ ✓ 3+ habits done (4.1/5)           │ │ [View All Badges]       │ │ │ │
│                     │ │ ✓ Journal entry written (3.9/5)     │ │                         │ │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ Lowest mood correlation:            │ │                         │ │ │
│                     │ │ ○ No meditation (2.8/5)            │ │                         │ │ │ │
│                     │ │ ○ <2 habits completed (2.3/5)       │ │                         │ │ │ │
│                     │ └─────────────────────────────────────┘ │                         │ │ │
│                     │                                         └─────────────────────────┘ │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 📝 Journal Analytics                                          │ │ │
│                     │ │                                                              │ │ │
│                     │ │ ┌────────────────┐ ┌────────────────┐ ┌────────────────────┐ │ │ │
│                     │ │ │ Total Entries  │ │ Avg Words      │ │ Writing Consistency │ │ │ │
│                     │ │ │     127        │ │     234        │ │     23/30 days     │ │ │ │
│                     │ │ │   +3 this week │ │   +12 vs avg   │ │     (77%)          │ │ │ │
│                     │ │ └────────────────┘ └────────────────┘ └────────────────────┘ │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Most active writing time: 8:00 PM (32% of entries)          │ │ │ │
│                     │ │ Favorite topics: #gratitude (45), #growth (23), #habits (18) │ │ │ │
│                     │ │ Mood distribution: 😄 35% • 😊 28% • 😐 22% • 😔 15%          │ │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌──────────────────────────────────────────────────────────────┐ │ │
│                     │ │ 🔮 AI Insights (Pro Feature) ✨                               │ │ │
│                     │ │                                                              │ │ │
│                     │ │ Based on your patterns, we've discovered:                    │ │ │
│                     │ │ • Your completion rate improves by 23% when you journal first │ │ │
│                     │ │ • Tuesday is your most challenging day (suggest easier goals) │ │ │
│                     │ │ • You're most consistent with habits after 7 AM              │ │ │
│                     │ │ • Weekend routines could use morning structure               │ │ │
│                     │ │                                                              │ │ │
│                     │ │ [✨ Upgrade to Pro] [Learn More About AI Insights]           │ │ │
│                     │ └──────────────────────────────────────────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Habit-Specific Analytics (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ← Back to Analytics      📈 Morning Pages Analytics   [Export Data] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌──────────────────────────────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Performance Summary                                          │ │ │
│ │                 │ │ │ Current streak: 🔥 12 days  •  Best streak: 21 days          │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ Success rate: 78% (89/114 days)  •  Average per week: 5.4   │ │ │
│ └─────────────────┘ │ └──────────────────────────────────────────────────────────────┘ │ │
│                     │                                                                    │ │
│                     │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│                     │ │ 📅 Completion Calendar              │ │ 📊 Weekly Pattern       │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │    September 2025                   │ │ Monday    ████████░░ 80%│ │ │ │
│                     │ │ Su Mo Tu We Th Fr Sa                │ │ Tuesday   ██████░░░░ 60%│ │ │ │
│                     │ │     1  2  3  4  5  6                │ │ Wednesday ███████░░░ 70%│ │ │ │
│                     │ │  7 ✓  8 ✓  9 ✓ 10 ✓ 11 ✓ 12 ✓ 13 ✓ │ │ Thursday  █████░░░░░ 50%│ │ │ │
│                     │ │ 14 ✓ 15 ✓ 16 ✓ 17 ✓ 18 ✓ 19 ✓ 20 ✓ │ │ Friday    ████████░░ 80%│ │ │ │
│                     │ │ 21 ✓ 22 ✓ 23 ○ 24 ✓ 25 ✓ 26 ○ 27 │ │ Saturday  ██████████ 95%│ │ │ │
│                     │ │ 28 29 30                            │ │ Sunday    █████████░ 90%│ │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ Legend: ✓ Completed ○ Missed        │ │ Best day: Saturday      │ │ │ │
│                     │ │                                     │ │ Needs work: Thursday    │ │ │ │
│                     │ │ [← August] [October →]              │ │                         │ │ │ │
│                     │ └─────────────────────────────────────┘ │ [View Time Analysis]    │ │ │ │
│                     │                                         └─────────────────────────┘ │ │
│                     │ ┌─────────────────────────────────────┐ ┌─────────────────────────┐ │ │
│                     │ │ 📈 Progress Trends (90 days)        │ │ 🎯 Completion Timeline  │ │ │
│                     │ │                                     │ │                         │ │ │
│                     │ │ 100% ┌─────────────────────────────┐ │ │ Today                   │ │ │ │
│                     │ │  80% │     ●───●       ●───●───●   │ │ │ ✓ 7:23 AM (+3 min)     │ │ │ │
│                     │ │  60% │ ●───●       ●───●           │ │ │                         │ │ │ │
│                     │ │  40% │                             │ │ │ Yesterday               │ │ │ │
│                     │ │  20% │                             │ │ │ ✓ 7:28 AM (+8 min)     │ │ │ │
│                     │ │   0% └─────────────────────────────┘ │ │                         │ │ │
│                     │ │      Jun    Jul    Aug    Sep       │ │ Sep 24                  │ │ │ │
│                     │ │                                     │ │ ✓ 7:15 AM (-5 min)     │ │ │ │
│                     │ │ Trend: +23% improvement over 3 months │ │                         │ │ │ │
│                     │ │ Best period: Aug 15-29 (100%)       │ │ Sep 23                  │ │ │ │
│                     │ │ Recovery time: 2.1 days avg         │ │ ○ Missed (Travel)       │ │ │ │
│                     │ └─────────────────────────────────────┘ │                         │ │ │
│                     │                                         │ Average time: 7:20 AM  │ │ │ │
│                     │ ┌─────────────────────────────────────┐ │ Consistency: 94%        │ │ │ │
│                     │ │ 💡 Insights & Recommendations       │ │                         │ │ │ │
│                     │ │                                     │ │ [View Full History]     │ │ │ │
│                     │ │ What's working well:                │ └─────────────────────────┘ │ │
│                     │ │ ✓ Weekend consistency (95% success) │                           │ │
│                     │ │ ✓ Morning routine stability         │                           │ │
│                     │ │ ✓ Quick recovery from missed days   │                           │ │
│                     │ │                                     │                           │ │
│                     │ │ Areas for improvement:              │                           │ │
│                     │ │ ⚠️ Thursday completion rate (50%)    │                           │ │
│                     │ │ ⚠️ Time consistency (+/- 15 min)    │                           │ │
│                     │ │                                     │                           │ │
│                     │ │ Suggested optimizations:            │                           │ │
│                     │ │ • Set Thursday reminder 10min early │                           │ │
│                     │ │ • Link to existing Thursday routine │                           │ │
│                     │ │ • Consider Wednesday prep ritual    │                           │ │
│                     │ └─────────────────────────────────────┘                           │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Analytics View (320px - 767px)
```
┌─────────────────────────┐
│ ← Back        📊 Export  │
│                         │
│ Your Progress           │
│                         │
│ ┌─────────────────────┐ │
│ │ Current Streaks     │ │
│                     │ │
│ │ Morning Pages 🔥 7  │ │
│ │ Evening Walk  🔥 3  │ │
│ │ Meditation    🔥 1  │ │
│                     │ │
│ │ Longest: 21 days    │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ This Week           │ │
│                     │ │
│ │ Habits: 15/21 (71%) │ │
│ │ Journal: 5/7 days   │ │
│ │ Avg Mood: 😊 (4.2)  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Monthly Trends      │ │
│                     │ │
│ │ [📈 Chart showing   │ │
│ │  habit completion   │ │
│ │  and mood trends    │ │
│ │  over time]         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Journal Insights    │ │
│                     │ │
│ │ Total entries: 45   │ │
│ │ Average words: 187  │ │
│ │ Most active: Tues   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 5. Settings & Profile

### Desktop Settings Dashboard (1024px+) - Primary Design
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ⚙️ Settings                                        [Save Changes] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌─────────────────────┐ ┌───────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Settings Navigation │ │ Account & Profile                     │ │ │
│ │                 │ │ │                     │ │                                       │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ ┌─────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │ │
│ └─────────────────┘ │ │ │ 👤 Profile      │ │ │ │ Profile Photo                       │ │ │ │
│                     │ │ │ ●●●●●●●●●●      │ │ │ │                                     │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │     ┌─────────────┐               │ │ │ │
│                     │ │                     │ │ │ │     │     🧑      │               │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │     │             │               │ │ │ │
│                     │ │ │ 🔔 Notifications│ │ │ │ │     │    Maya     │               │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │     └─────────────┘               │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │                                     │ │ │ │
│                     │ │                     │ │ │ │ [Change Photo] [Remove]             │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ └─────────────────────────────────────┘ │ │ │
│                     │ │ │ 🔐 Privacy      │ │ │ │                                       │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ Personal Information                │ │ │ │
│                     │ │                     │ │ │ │                                     │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ ┌───────────────┐ ┌───────────────┐ │ │ │ │
│                     │ │ │ 🎨 Preferences  │ │ │ │ │ │ First Name    │ │ Last Name     │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ Maya          │ │ Thompson      │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ └───────────────┘ └───────────────┘ │ │ │ │
│                     │ │                     │ │ │ │                                     │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ Email Address                       │ │ │ │
│                     │ │ │ 🗂️ Data         │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ maya.thompson@email.com             │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │                     │ │ │ │ ☑ Email verified                    │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │                                     │ │ │ │
│                     │ │ │ 🛡️ Security     │ │ │ │ Time Zone                           │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ (GMT-8) Pacific Time             ▼ │ │ │ │ │
│                     │ │                     │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │                                     │ │ │ │
│                     │ │ │ 💰 Subscription │ │ │ │ Language                            │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ English (US)                     ▼ │ │ │ │ │
│                     │ │                     │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │                                     │ │ │ │
│                     │ │ │ 💬 Support      │ │ │ │ About Me (Optional)                 │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ I'm on a journey to build better    │ │ │ │ │
│                     │ └─────────────────────┘ │ │ │ │ habits and live more mindfully.     │ │ │ │ │
│                     │                         │ │ │ │ Daily reflection and consistent     │ │ │ │ │
│                     │                         │ │ │ │ action are my tools for growth.     │ │ │ │ │
│                     │                         │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │                         │ │ └─────────────────────────────────────┘ │ │ │
│                     │                         │ │                                       │ │ │
│                     │                         │ │ ┌─────────────────────────────────────┐ │ │ │
│                     │                         │ │ │ Account Statistics                  │ │ │ │
│                     │                         │ │ │                                     │ │ │ │
│                     │                         │ │ │ Member since: January 15, 2025      │ │ │ │
│                     │                         │ │ │ Total login days: 78                │ │ │ │
│                     │                         │ │ │ Habits created: 12                  │ │ │ │
│                     │                         │ │ │ Journal entries: 127                │ │ │ │
│                     │                         │ │ │ Longest streak: 21 days             │ │ │ │ │
│                     │                         │ │ └─────────────────────────────────────┘ │ │ │
│                     │                         └───────────────────────────────────────┘ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Settings - Notifications Panel (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ⚙️ Settings > Notifications                       [Save Changes] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌─────────────────────┐ ┌───────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Settings Navigation │ │ Notification Preferences               │ │ │
│ │                 │ │ │                     │ │                                       │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ ┌─────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │ │
│ └─────────────────┘ │ │ │ 👤 Profile      │ │ │ │ 🔔 General Notifications            │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │                                     │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ ☑ Enable all notifications          │ │ │ │
│                     │ │                     │ │ │ │ ☑ Email notifications               │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ ☑ Push notifications                │ │ │ │
│                     │ │ │ 🔔 Notifications│ │ │ │ ☐ SMS notifications (Pro)           │ │ │ │
│                     │ │ │ ●●●●●●●●●●      │ │ │ │                                     │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ Quiet Hours                         │ │ │ │
│                     │ │                     │ │ │ │ ☑ Enable quiet hours               │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ From: [10:00 PM ▼] To: [7:00 AM ▼] │ │ │ │ │
│                     │ │ │ 🔐 Privacy      │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │                                       │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │                     │ │ │ │ │ 📝 Habit Reminders                 │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │                                     │ │ │ │ │
│                     │ │ │ 🎨 Preferences  │ │ │ │ │ │ ☑ Daily habit reminders            │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ ☑ Streak achievement alerts         │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ ☑ Weekly progress summaries        │ │ │ │ │
│                     │ │                     │ │ │ │ │ │ ☐ Habit suggestion reminders       │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ │                                     │ │ │ │ │
│                     │ │ │ 🗂️ Data         │ │ │ │ │ │ Reminder Style                      │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ ● Gentle encouragement              │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ ○ Direct reminders                  │ │ │ │ │
│                     │ │                     │ │ │ │ │ │ ○ Motivational quotes               │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ │ 🛡️ Security     │ │ │ │                                       │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ 📊 Progress Notifications           │ │ │ │ │
│                     │ │                     │ │ │ │ │                                     │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ │ ☑ Weekly progress reports           │ │ │ │ │
│                     │ │ │ 💰 Subscription │ │ │ │ │ │ ☑ Monthly insights                  │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ ☑ Achievement unlocks               │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ ☐ Milestone celebrations            │ │ │ │ │
│                     │ │                     │ │ │ │ │ │                                     │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ │ Delivery Method                     │ │ │ │ │
│                     │ │ │ 💬 Support      │ │ │ │ │ │ ☑ In-app notifications              │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ ☑ Email digest (Weekly)             │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ ☐ Email digest (Daily)              │ │ │ │ │
│                     │ └─────────────────────┘ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │                         │ │                                       │ │ │
│                     │                         │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │                         │ │ │ 📱 Mobile App Notifications (Pro)   │ │ │ │ │
│                     │                         │ │ │                                     │ │ │ │ │
│                     │                         │ │ │ ☐ Enable mobile notifications       │ │ │ │ │
│                     │                         │ │ │ ☐ Smart timing (AI-powered)         │ │ │ │ │
│                     │                         │ │ │ ☐ Location-based reminders          │ │ │ │ │
│                     │                         │ │ │                                     │ │ │ │ │
│                     │                         │ │ │ [✨ Upgrade to Pro] [Learn More]    │ │ │ │ │
│                     │                         │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │                         │ └───────────────────────────────────────┘ │ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Desktop Settings - Subscription Panel (1024px+)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────┐ Mind Voyage Companion                    🔍 [Search] 🔔 [3] 👤 Maya    │
│ │ 🏠 Dashboard    │                                                                        │
│ │ 📈 Habits       │ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Journal      │ │ ⚙️ Settings > Subscription                       [Manage Billing] │ │
│ │ 📊 Analytics    │ │                                                                    │ │
│ │ 🏛️ Wisdom       │ │ ┌─────────────────────┐ ┌───────────────────────────────────────┐ │ │
│ │ ⚙️  Settings    │ │ │ Settings Navigation │ │ Your Plan                             │ │ │
│ │                 │ │ │                     │ │                                       │ │ │
│ │ 🌟 Upgrade Pro  │ │ │ ┌─────────────────┐ │ │ ┌─────────────────────────────────────┐ │ │ │
│ └─────────────────┘ │ │ │ 👤 Profile      │ │ │ │ ✨ Mind Voyage Pro                  │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │                                     │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ Monthly Subscription                │ │ │ │
│                     │ │                     │ │ │ │ $9.99/month                        │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │                                     │ │ │ │ │
│                     │ │ │ 🔔 Notifications│ │ │ │ │ Next billing: October 15, 2025      │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ Payment method: •••• 4532            │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │                                     │ │ │ │
│                     │ │                     │ │ │ │ [Update Payment] [Change Plan]      │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ │ 🔐 Privacy      │ │ │ │                                       │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ Pro Features                        │ │ │ │ │
│                     │ │                     │ │ │ │ │                                     │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ ✓ AI-powered insights               │ │ │ │ │
│                     │ │ │ 🎨 Preferences  │ │ │ │ │ │ ✓ Advanced analytics                │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ ✓ Unlimited habit tracking          │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ ✓ Custom themes & personalization   │ │ │ │ │
│                     │ │                     │ │ │ │ │ │ ✓ Priority support                  │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ │ ✓ Data export & backup              │ │ │ │ │
│                     │ │ │ 🗂️ Data         │ │ │ │ │ │ ✓ Mobile app access                 │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │                                     │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │ [Learn More About Pro Features]     │ │ │ │ │
│                     │ │                     │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │                                       │ │ │
│                     │ │ │ 🛡️ Security     │ │ │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ Billing History                     │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │                                     │ │ │ │ │
│                     │ │                     │ │ │ │ │ Oct 2025  $9.99  [Invoice] [PDF]   │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ Sep 2025  $9.99  [Invoice] [PDF]   │ │ │ │ │
│                     │ │ │ 💰 Subscription │ │ │ │ │ │ Aug 2025  $9.99  [Invoice] [PDF]   │ │ │ │ │
│                     │ │ │ ●●●●●●●●●●      │ │ │ │ │ │ Jul 2025  $9.99  [Invoice] [PDF]   │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ │ │                                     │ │ │ │ │
│                     │ │                     │ │ │ │ │ │ Total paid: $39.96                  │ │ │ │ │
│                     │ │ ┌─────────────────┐ │ │ │ │ │ │ Member since: July 15, 2025         │ │ │ │ │
│                     │ │ │ 💬 Support      │ │ │ │ │ │                                     │ │ │ │ │
│                     │ │ │ ○○○○○○○○○○      │ │ │ │ │ │ [View All Invoices]                 │ │ │ │ │
│                     │ │ └─────────────────┘ │ │ │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │ └─────────────────────┘ │ │                                       │ │ │
│                     │                         │ │ ┌─────────────────────────────────────┐ │ │ │ │
│                     │                         │ │ │ Manage Subscription                 │ │ │ │ │
│                     │                         │ │ │                                     │ │ │ │ │
│                     │                         │ │ │ [Switch to Annual] (Save 17%)       │ │ │ │ │
│                     │                         │ │ │ [Pause Subscription]                │ │ │ │ │
│                     │                         │ │ │ [Cancel Subscription]               │ │ │ │ │
│                     │                         │ │ │                                     │ │ │ │ │
│                     │                         │ │ │ ⚠️ Canceling will downgrade you to   │ │ │ │ │
│                     │                         │ │ │    the free plan at your next       │ │ │ │ │
│                     │                         │ │ │    billing cycle.                   │ │ │ │ │
│                     │                         │ │ └─────────────────────────────────────┘ │ │ │ │
│                     │                         │ └───────────────────────────────────────┘ │ │ │
│                     └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Settings Menu (320px - 767px)
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

### Mobile Profile View (320px - 767px)
```
┌─────────────────────────┐
│ ← Settings        Save  │
│                         │
│ Profile                 │
│                         │
│ ┌─────────────────────┐ │
│ │       ┌───────┐     │ │
│ │       │   🧑   │     │ │
│ │       │ Maya   │     │ │
│ │       └───────┘     │ │
│ │                     │ │
│ │ [Change Photo]      │ │
│ └─────────────────────┘ │
│                         │
│ First Name              │
│ ┌─────────────────────┐ │
│ │ Maya                │ │
│ └─────────────────────┘ │
│                         │
│ Last Name               │
│ ┌─────────────────────┐ │
│ │ Thompson            │ │
│ └─────────────────────┘ │
│                         │
│ Email                   │
│ ┌─────────────────────┐ │
│ │ maya@email.com      │ │
│ └─────────────────────┘ │
│ ✓ Verified              │
│                         │
│ Time Zone               │
│ ┌─────────────────────┐ │
│ │ Pacific Time      ▼ │ │
│ └─────────────────────┘ │
│                         │
│ About Me                │
│ ┌─────────────────────┐ │
│ │ Building better     │ │
│ │ habits daily...     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```
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