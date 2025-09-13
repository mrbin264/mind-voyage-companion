# Mind Voyage Companion

A privacy-first habit tracking and journaling application designed to help users build consistent routines, engage in reflective writing with Stoic-inspired prompts, and improve their English through journal-based language learning.

## 🎯 Product Vision

Mind Voyage Companion combines daily habit tracking with thoughtful reflection to create a comprehensive personal growth platform. Built as a progressive web application, it offers a freemium model with AI-enhanced features available through a Pro subscription.

## ✨ Key Features

### Core Features (Free)
- **Habit Tracking**: Create, schedule, and track daily/weekly habits with streak visualization
- **Personal Journaling**: Write private journal entries with mood tracking (1-5 scale)
- **Daily Stoic Content**: Curated quotes and reflection prompts from Stoic philosophy
- **Progress Dashboard**: Visual summary of habit streaks and mood trends
- **Multi-language Support**: English and Vietnamese interface

### Pro Features
- **AI Journal Enhancement**: Translate and improve journal entries to English with explanations
- **Weekly AI Insights**: Personalized reports analyzing habits, moods, and journal themes
- **Advanced Visualizations**: Habit Garden and Mood Galaxy interactive visualizations
- **Data Export**: Export personal data in CSV/JSON formats
- **Priority Support**: Enhanced customer support for Pro subscribers

## 🏗️ Technology Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Cloud**: Azure App Service, Azure Key Vault, Azure Application Insights
- **AI**: Azure OpenAI for translation and content improvement
- **Authentication**: Custom email/password with session management

## 📋 Development Phases

### Phase 1 - MVP Foundation (6-10 weeks)
Core authentication, habit tracking, journaling, Stoic daily content, basic dashboard, and essential settings functionality.

### Phase 2 - Pro Features (6-8 weeks)
AI journaling capabilities, weekly reflection reports, data visualizations, export functionality, and subscription billing integration.

### Phase 3 - Expansion Features (8-12 weeks)
AI mentor personas, lifestyle content packs, optional social features, and PWA push notification capabilities.

## 📊 Success Metrics

- **Activation**: ≥25% of users completing ≥3 habit check-ins + ≥1 journal in first week
- **Retention**: ≥25% Day 7 retention rate
- **Conversion**: ≥3% free-to-Pro conversion rate
- **Performance**: <1.5s First Contentful Paint, <3s Time to Interactive

## 🚀 Development Workflow

### GitHub Project Management
- **Project Board**: [Mind Voyage Companion - Development](https://github.com/users/mrbin264/projects/4)
- **User Stories**: 13 stories organized in phases (MVC-000 to MVC-012)
- **Workflow Documentation**: See `.github/workflows/DEVELOPER_WORKFLOW.md`

### Quick Start for Developers

1. **Setup Environment**
   ```bash
   # Clone repository
   git clone https://github.com/mrbin264/mind-voyage-companion.git
   cd mind-voyage-companion
   
   # Install dependencies
   npm install
   
   # Setup environment variables
   cp .env.example .env.local
   ```

2. **Start Development**
   ```bash
   # View available user stories
   ./scripts/manage-project.sh view-project
   
   # Start working on a story
   ./scripts/manage-project.sh start-story <issue-number> <assignee>
   
   # Create feature branch
   git checkout -b feature/mvc-xxx-description
   ```

3. **VS Code Tasks** (Cmd/Ctrl + Shift + P → "Tasks: Run Task")
   - Start User Story
   - Run Development Server
   - Code Quality Check
   - Create Feature Branch
   - Create Pull Request

### Workflow Files
- **📋 Full Workflow Guide**: `.github/workflows/DEVELOPER_WORKFLOW.md`
- **⚡ Quick Reference**: `.github/workflows/QUICK_REFERENCE.md` 
- **🔧 Project Management Script**: `scripts/manage-project.sh`
- **⚙️ VS Code Tasks**: `.vscode/tasks.json`

## 🔒 Privacy & Security

- Privacy-first architecture with no user data monetization
- All user data encrypted at rest with Azure-managed keys
- GDPR compliance with data export and deletion capabilities
- PII redaction in AI prompts with strict no-training policies
- Row-level security ensuring users can only access their own data

## 📚 Documentation

- [Product Requirements Document (PRD)](./docs/prd.md) - Comprehensive product specification
- [System Requirements Specification](./requirements.md) - Technical requirements and constraints

## 🎯 Target Users

- **Young Professionals**: Seeking structured personal development with time-efficient tools
- **Students**: Building study and wellness habits with motivational progress tracking
- **Self-Growth Enthusiasts**: Interested in Stoic philosophy and deep self-reflection

## 🚀 Getting Started

*Development setup instructions will be added when the project structure is initialized.*

## 📄 License

*License information will be added upon project completion.*

---

**Note**: This project is currently in the planning and design phase. Development will begin following the three-phase roadmap outlined above.