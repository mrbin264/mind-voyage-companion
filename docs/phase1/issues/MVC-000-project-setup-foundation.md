# [MVC-000] Project Setup and Foundation

**Phase**: 0 (Foundation)  
**Priority**: Critical  
**GitHub Issue**: [#13](https://github.com/mrbin264/mind-voyage-companion/issues/13)

## User Story

**ID**: MVC-000  
**Description**: As a developer, I want to establish a complete Next.js 14+ fullstack project foundation with modern tooling, CI/CD, and deployment infrastructure so that all subsequent features can be built on a production-ready codebase.

## Acceptance Criteria

- [ ] Next.js 14+ App Router project initialized with TypeScript strict mode
- [ ] Complete development environment setup with ESLint, Prettier, and Husky
- [ ] Database schema and ODM (Mongoose) configured with MongoDB (Azure)
- [ ] Authentication system (Auth.js v5) implemented with Azure AD integration
- [ ] UI component system (shadcn/ui + Radix + Tailwind CSS) established
- [ ] CI/CD pipeline configured with GitHub Actions
- [ ] Azure deployment infrastructure provisioned (App Service, Key Vault, MongoDB)
- [ ] Monitoring and observability (Application Insights) configured
- [ ] Documentation and development guidelines established

## Priority

Critical - Phase 0 (Must be completed before any feature development)

## Technical Notes

- Modern Next.js 13+ patterns with RSC-first architecture
- TypeScript strict mode with comprehensive type safety
- Azure cloud infrastructure for production deployment
- Security-first approach with proper secrets management
- Performance monitoring and error tracking from day one

## Definition of Done

- [ ] Complete project scaffolding with proper folder structure
- [ ] All development tools configured and working
- [ ] Database connection and schema validation working
- [ ] Basic authentication flow implemented
- [ ] UI component library integrated and documented
- [ ] CI/CD pipeline successfully deploying to staging
- [ ] Production environment configured and accessible
- [ ] Security scans passing and secrets properly managed
- [ ] Performance monitoring active with baseline metrics
- [ ] README and contribution guidelines complete

## Dependencies

- Azure subscription and resource provisioning
- GitHub repository with proper access permissions
- Development team access to necessary tools and services

## Estimated Effort

**Story Points**: 34  
**Time Estimate**: 1-2 weeks

## Technical Implementation Details

### Project Architecture Foundation
```typescript
// Project structure for scalable development
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (app)/             # Main app routes
│   ├── api/               # API route handlers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
├── lib/                  # Shared utilities
│   ├── auth.ts           # Auth.js configuration
│   ├── db.ts             # MongoDB connection
│   ├── models/           # Mongoose schemas
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── server/               # Server-side logic
│   ├── auth/             # Auth handlers
│   ├── db/               # Database operations
│   └── api/              # API logic
├── styles/               # Additional stylesheets
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

### Technology Stack Setup
```json
// Key dependencies and their purposes
{
  "dependencies": {
    "next": "^14.2.0",           // Next.js App Router
    "@auth/mongodb-adapter": "*", // Auth.js MongoDB adapter
    "mongoose": "^8.0.0",        // MongoDB ODM
    "@radix-ui/react-*": "*",    // Accessible UI primitives
    "@tanstack/react-query": "*", // Server state management
    "framer-motion": "*",         // Animations
    "tailwindcss": "^3.4.0",    // Utility-first CSS
    "zod": "^3.22.0",            // Schema validation
    "next-intl": "*",            // Internationalization
    "nuqs": "*"                  // URL state management
  },
  "devDependencies": {
    "@types/node": "*",          // Node.js types
    "eslint": "*",               // Code linting
    "prettier": "*",             // Code formatting
    "husky": "*",                // Git hooks
    "lint-staged": "*",          // Staged file linting
    "@playwright/test": "*",     // E2E testing
    "vitest": "*"                // Unit testing
  }
}
```

### Database Schema Foundation
```typescript
// lib/models/user.ts - Mongoose User schema
import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface ISession extends Document {
  sessionToken: string
  userId: mongoose.Types.ObjectId
  expires: Date
}

export interface IUser extends Document {
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
  timezone: string
  preferences: Record<string, any>
}

export interface IVerificationToken extends Document {
  identifier: string
  token: string
  expires: Date
}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String
}, {
  indexes: [
    { provider: 1, providerAccountId: 1 }, // Unique compound index
  ]
})

const SessionSchema = new Schema<ISession>({
  sessionToken: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expires: { type: Date, required: true }
})

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, required: true, unique: true },
  emailVerified: Date,
  image: String,
  timezone: { type: String, default: 'UTC' },
  preferences: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
})

const VerificationTokenSchema = new Schema<IVerificationToken>({
  identifier: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
}, {
  indexes: [
    { identifier: 1, token: 1 }, // Unique compound index
  ]
})

export const Account = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema)
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema)
```

### Database Connection Configuration
```typescript
// lib/db.ts - MongoDB connection utility
import mongoose from 'mongoose'

declare global {
  var mongoose: any
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
```

### Authentication Configuration
```typescript
// lib/auth.ts - Auth.js v5 configuration
import { NextAuthConfig } from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import AzureAD from "next-auth/providers/azure-ad"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DATABASE
  }),
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
}
```

### CI/CD Pipeline Configuration
```yaml
# .github/workflows/ci.yml - Comprehensive CI/CD
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm run build
      
      - name: Run E2E tests
        run: npx playwright test

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Azure Staging
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'mind-voyage-staging'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_STAGING }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Azure Production
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'mind-voyage-production'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_PROD }}
```

### Azure Infrastructure Setup
```typescript
// Infrastructure as Code (Bicep) for Azure resources
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: 'mind-voyage-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2021-02-01' = {
  name: 'mind-voyage-app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appSettings: [
        {
          name: 'NEXTAUTH_SECRET'
          value: '@Microsoft.KeyVault(VaultName=mind-voyage-kv;SecretName=nextauth-secret)'
        }
        {
          name: 'MONGODB_URI'
          value: '@Microsoft.KeyVault(VaultName=mind-voyage-kv;SecretName=mongodb-uri)'
        }
      ]
    }
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {
  name: 'mind-voyage-kv'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
    enableRbacAuthorization: true
  }
}

resource mongoDbAccount 'Microsoft.DocumentDB/databaseAccounts@2021-06-15' = {
  name: 'mind-voyage-mongodb'
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
    minimalTlsVersion: 'Tls12'
  }
}

resource mongoDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2021-06-15' = {
  parent: mongoDbAccount
  name: 'mindvoyage'
  properties: {
    resource: {
      id: 'mindvoyage'
    }
  }
}
```

### Development Environment Setup
```typescript
// Configuration files for optimal developer experience

// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@next/eslint-config-next',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}

// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... shadcn/ui color system
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
```

### Performance Monitoring Setup
```typescript
// lib/analytics.ts - Application Insights integration
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
})

appInsights.loadAppInsights()

// Web Vitals tracking
export function reportWebVitals({ id, name, label, value }: any) {
  appInsights.trackMetric({ name: `${label}.${name}`, average: value })
}
```

### Documentation Standards
```markdown
# Development Guidelines

## Code Standards
- TypeScript strict mode with comprehensive typing
- ESLint + Prettier for consistent formatting
- Conventional commits for clear git history
- Component documentation with JSDoc comments

## Architecture Principles
- RSC-first approach with strategic client components
- Server Actions for form handling and mutations
- React Query for client-side state management
- Compound components for complex UI patterns

## Testing Strategy
- Unit tests for utility functions and hooks
- Component tests with React Testing Library
- E2E tests with Playwright for critical user flows
- Performance tests for Core Web Vitals compliance

## Deployment Process
- Feature branches merged to develop
- Staging deployment on develop branch
- Production deployment on main branch
- Automated rollback on performance regressions
```

## Testing Strategy

- Infrastructure provisioning tests
- Database connection and schema validation tests  
- Authentication flow integration tests
- CI/CD pipeline validation tests
- Security vulnerability scanning
- Performance baseline establishment
- Documentation completeness verification

This foundational user story establishes the complete technical infrastructure needed for building a production-grade Next.js application with modern development practices, robust security, and scalable deployment architecture using MongoDB (Azure) with Mongoose ODM and pnpm package management.