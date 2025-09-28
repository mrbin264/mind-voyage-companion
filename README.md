# Mind Voyage Companion

# Mind Voyage Companion

A privacy-first habit tracking and journaling application designed to help users build consistent routines, engage in reflective writing with Stoic-inspired prompts, and improve their English through journal-based language learning.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended: use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))
- pnpm 9.12.2+
- MongoDB (local development or MongoDB Atlas)
- Azure account (for Microsoft Entra ID authentication and deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrbin264/mind-voyage-companion.git
   cd mind-voyage-companion
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   
   # Generate secure JWT and NextAuth secrets
   pnpm generate:secrets
   
   # Or generate in .env format to copy directly
   pnpm generate:secrets:env >> .env.local
   
   # Edit .env.local with your other configuration values
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or using MongoDB Community Edition
   mongod
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── (app)/             # Main app routes
│   │   ├── api/               # API route handlers
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/                  # Shared utilities
│   │   ├── auth.ts           # Auth.js configuration
│   │   ├── db.ts             # MongoDB connection
│   │   ├── models/           # Mongoose schemas
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   ├── server/               # Server-side logic
│   │   ├── auth/             # Auth handlers
│   │   ├── db/               # Database operations
│   │   └── api/              # API logic
│   ├── styles/               # Additional stylesheets
│   ├── types/                # TypeScript definitions
│   └── hooks/                # Custom React hooks
├── e2e/                      # End-to-end tests
├── docs/                     # Project documentation
├── design/                   # Design specifications
└── scripts/                  # Project management scripts
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server (uses MongoDB Memory Server)
pnpm dev:clean           # Clean up and start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm db:cleanup          # Clean up MongoDB Memory Server instances

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix linting issues
pnpm format             # Format code with Prettier
pnpm format:check       # Check code formatting
pnpm type-check         # Run TypeScript type checking

# Testing
pnpm test               # Unit tests (deferred to future user stories)
pnpm test:run           # Unit tests (deferred to future user stories)
pnpm test:coverage      # Test coverage (deferred to future user stories)
pnpm test:e2e           # Run end-to-end tests (Playwright configured)
pnpm test:e2e:ui        # Run E2E tests with UI (Playwright configured)
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

#### 🔐 **Secure Secret Generation**
```bash
# Generate cryptographically secure secrets automatically
pnpm generate:secrets                # Interactive format with validation
pnpm generate:secrets:env           # .env format for direct copy/paste
```

#### 📋 **Required Variables**
```env
# JWT Configuration (REQUIRED - minimum 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-chars-long

# NextAuth.js Configuration (REQUIRED - minimum 32 characters)  
NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars-long
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration (Production only - development uses Memory Server)
MONGODB_URI=mongodb://localhost:27017/mindvoyage

# Microsoft Entra ID Configuration (formerly Azure AD)
AZURE_AD_CLIENT_ID=your-entra-id-application-client-id
AZURE_AD_CLIENT_SECRET=your-entra-id-application-client-secret
AZURE_AD_TENANT_ID=your-entra-id-tenant-id

# Application Insights (Optional)
NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY=your-app-insights-key
```

#### 🛡️ **Security Requirements**
- **JWT_SECRET** and **NEXTAUTH_SECRET** are **REQUIRED** for authentication
- Minimum 32 characters length for all secrets
- Use the `pnpm generate:secrets` command to create cryptographically secure secrets
- **Never commit secrets to version control** - they are excluded in `.gitignore`
- Use different secrets for each environment (dev, staging, production)
- Store production secrets securely in Azure Key Vault

**Note**: In development mode, the `MONGODB_URI` is optional as the app automatically uses MongoDB Memory Server.

### Database Setup

The application uses MongoDB with Mongoose ODM. The database connection is automatically established when the application starts.

**For development:**
- **MongoDB Memory Server**: Automatically runs an in-memory MongoDB instance (no setup required)
- Database schemas are automatically created on first connection
- No manual migrations required - Mongoose handles schema validation
- Data is reset on each development server restart

**For production:**
- Set `MONGODB_URI` in your environment variables to point to your production MongoDB instance
- Recommended: MongoDB Atlas or Azure Cosmos DB with MongoDB API

**Models included:**
- User authentication (NextAuth.js compatible)
- Account linking for OAuth providers
- Session management
- Verification tokens

**MongoDB Memory Server Benefits:**
- Zero configuration for development
- No external dependencies
- Fast, isolated testing environment
- Automatic cleanup on server restart

## 🧪 Testing

### Testing Infrastructure Setup
**Note**: Complete testing infrastructure (Vitest unit tests and Playwright E2E tests) will be configured in subsequent user stories to ensure optimal compatibility with the final application architecture and dependencies.

### Testing Infrastructure

**Current Status (MVC-000 Foundation)**:
- ✅ **Testing Dependencies**: Vitest, React Testing Library, Playwright installed
- ✅ **E2E Testing**: Playwright configured and ready
- ⏳ **Unit Testing**: Vitest configuration deferred to MVC-002 (Habit Management) or later user stories
- ✅ **CI/CD Integration**: GitHub Actions pipeline prepared for testing

The foundation is prepared with:
- Testing framework dependencies installed
- Test directory structure planned
- CI/CD pipeline configured for future test integration

**Rationale**: Unit testing configuration has complex tooling compatibility issues that are better resolved when implementing specific features rather than during foundation setup.

### Manual Testing
- **Development Server**: `pnpm dev` - Test application locally with MongoDB Memory Server
- **Production Build**: `pnpm build` - Validate build process
- **Type Safety**: `pnpm type-check` - Ensure TypeScript compliance
- **Code Quality**: `pnpm lint` - Check code standards
- **Health Check**: Visit `/api/health` - Verify database connectivity

## 📦 Deployment

### Azure Deployment

The project is configured for Azure deployment with:
- **App Service**: Node.js 20 runtime
- **Key Vault**: Secure secrets management
- **MongoDB Atlas**: Cloud database
- **Application Insights**: Monitoring and analytics

### CI/CD Pipeline

GitHub Actions workflow includes:
1. **Testing**: Unit tests, integration tests, E2E tests
2. **Code Quality**: ESLint, Prettier, TypeScript checks
3. **Build**: Production build validation
4. **Deploy**: Automatic deployment to staging (develop branch) and production (main branch)

### Environment Setup

1. **Staging**: `develop` branch → `mind-voyage-staging`
2. **Production**: `main` branch → `mind-voyage-production`

## 🎨 Design System

### UI Components
- **Base**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Light/dark mode support
- **Typography**: Inter font family
- **Icons**: Lucide React

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- Color contrast validation

## 🔒 Security

### Authentication
- **Provider**: Microsoft Entra ID (NextAuth.js v5)
- **Session**: Secure HTTP-only cookies
- **Database**: MongoDB session storage
- **CSRF**: Built-in protection

### Data Protection
- **Environment Variables**: Secure secrets management
- **Database**: Encrypted connections (TLS)
- **API**: Input validation with Zod schemas
- **Headers**: Security headers configured

## 📚 Documentation

- **Project Requirements**: `requirements.md`
- **User Stories**: `docs/phase1/issues/` and `docs/phase2/issues/`
- **Design Specifications**: `design/`
- **API Documentation**: Generated from code comments
- **Developer Workflow**: `.github/workflows/DEVELOPER_WORKFLOW.md`

## 🤝 Contributing

1. **Follow the Developer Workflow**: See `.github/workflows/DEVELOPER_WORKFLOW.md`
2. **Create Feature Branch**: `git checkout -b feature/mvc-xxx-description`
3. **Commit Convention**: Use conventional commits
4. **Testing**: Ensure all tests pass
5. **Code Quality**: Run linting and formatting
6. **Pull Request**: Target `develop` branch

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended + custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

## 📋 User Stories & Roadmap

### Phase 0: Foundation ✅
- [x] **MVC-000**: Project Setup and Foundation

### Phase 1: MVP (In Progress)
- [ ] **MVC-001**: User Registration and Authentication
- [ ] **MVC-002**: Daily Habit Management
- [ ] **MVC-003**: Habit Completion Tracking
- [ ] **MVC-004**: Personal Journaling
- [ ] **MVC-005**: Daily Stoic Inspiration
- [ ] **MVC-006**: Progress Dashboard
- [ ] **MVC-007**: Account Settings and Preferences

### Phase 2: Pro Features (Planned)
- [ ] **MVC-008**: AI-Powered Journal Enhancement
- [ ] **MVC-009**: Weekly AI Reflection Report
- [ ] **MVC-010**: Data Export and Account Management
- [ ] **MVC-011**: Subscription Management
- [ ] **MVC-012**: Advanced Data Visualizations

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGODB_URI` in `.env.local`
   - Ensure MongoDB is running (local) or accessible (Atlas)
   - Verify network connectivity and firewall settings

2. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Clear pnpm cache: `pnpm store prune`
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`

3. **TypeScript Errors**
   - Run type check: `pnpm type-check`
   - Check import paths use `@/` alias
   - Ensure all dependencies have type definitions

4. **Test Failures**
   - Check test database connection
   - Verify test environment variables
   - Run tests individually to isolate issues

### Getting Help

- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check existing docs and guides
- **Developer Workflow**: Follow the established process

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🎯 Project Goals

**Mind Voyage Companion** aims to be the definitive privacy-first platform for:

1. **Habit Formation**: Simple, consistent daily habit tracking
2. **Reflective Journaling**: Stoic-inspired prompts for personal growth
3. **Language Learning**: English improvement through guided writing
4. **Personal Analytics**: Meaningful insights without data exploitation
5. **Privacy Protection**: Complete data ownership and security

Built with modern web technologies, focusing on performance, accessibility, and user experience while maintaining the highest standards of data privacy and security.

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