# Local Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js 20+** (LTS recommended)
  - Install via [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm)

  ```bash
  fnm install 20
  fnm use 20
  ```

- **pnpm 9.12.2+** (Package Manager)

  ```bash
  npm install -g pnpm@9.12.2
  ```

- **MongoDB** (Choose one option):
  - **Option A:** Docker (Recommended) - See Docker setup below
  - **Option B:** Local MongoDB Community Edition
  - **Option C:** MongoDB Atlas (Cloud) - Get free tier at https://mongodb.com/atlas

- **Git** - For version control

## Quick Start (One Command Setup)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-name>
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```bash
# Copy the environment template
cp .env.example .env.local

# Generate secure secrets
pnpm generate:secrets

# Copy the generated secrets to .env.local
# Or use:
pnpm generate:secrets:env >> .env.local
```

Edit `.env.local` and configure:

```env
# Required: Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/your_database_name

# Required: Authentication Secrets
JWT_SECRET=<generated-secret>
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000

# Optional: OAuth Providers (e.g., Microsoft Entra ID)
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
```

### 4. Start MongoDB (Choose one)

#### Option A: Docker (Recommended)

```bash
pnpm docker:dev
```

#### Option B: Local MongoDB

```bash
mongod
```

#### Option C: MongoDB Atlas

Use the connection string from your Atlas dashboard

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎉 You're Done!

The application is now running locally with:

- ✅ Next.js 15 development server
- ✅ MongoDB database connection
- ✅ NextAuth authentication ready
- ✅ Hot module reloading enabled

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev                # Start development server
pnpm build             # Build for production
pnpm start             # Start production server

# Code Quality
pnpm lint              # Run ESLint
pnpm lint:fix          # Fix linting issues automatically
pnpm format            # Format code with Prettier
pnpm format:check      # Check code formatting
pnpm type-check        # TypeScript type checking

# Testing
pnpm test              # Run unit tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Generate test coverage report
pnpm test:e2e          # Run end-to-end tests (Playwright)
pnpm test:e2e:ui       # Run E2E tests with UI

# Database
pnpm db:cleanup        # Clean up MongoDB processes

# Docker
pnpm docker:dev        # Start development containers
pnpm docker:dev:stop   # Stop development containers
pnpm docker:clean      # Remove all containers and volumes

# Security
pnpm generate:secrets  # Generate JWT and NextAuth secrets
```

### Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth route group (login, register)
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # NextAuth endpoints
│   │   │   ├── example/    # Sample API route
│   │   │   └── health/     # Health check endpoint
│   │   ├── dashboard/      # Protected dashboard
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # UI components (Button, Card, etc.)
│   │   ├── layout/        # Layout components
│   │   └── auth/          # Auth-related components
│   ├── lib/               # Shared utilities
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # MongoDB connection
│   │   ├── models/        # Mongoose models
│   │   └── utils.ts       # Helper functions
│   ├── types/             # TypeScript type definitions
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── e2e/                   # End-to-end tests
├── docs/                  # Documentation
└── infrastructure/        # Azure deployment configs
```

### Database Models

The boilerplate includes a sample User model:

```typescript
// src/lib/models/User.ts
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String }, // Hashed
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
```

**To add your own models:**

1. Create a new file in `src/lib/models/`
2. Define your Mongoose schema
3. Export the model
4. Use in API routes or server components

### API Routes

Sample API route structure:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/db'

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Connect to database
  await connectDB()

  // Your logic here...

  return NextResponse.json({ success: true })
}
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**

Solution:

```bash
# Check if MongoDB is running
pgrep -l mongod

# Start MongoDB (Docker)
pnpm docker:dev

# Or (Local)
mongod --dbpath /path/to/data
```

### Port Already in Use

**Error: "Port 3000 is already in use"**

Solution:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Environment Variables Not Loading

**Issue: Secrets not found or invalid**

Solution:

```bash
# Regenerate secrets
pnpm generate:secrets

# Ensure .env.local exists
cp .env.example .env.local

# Restart the server
pnpm dev
```

### TypeScript Errors

**Error: "Cannot find module '@/...'"**

Solution:

```bash
# Clear TypeScript cache
rm -rf .next
rm tsconfig.tsbuildinfo

# Rebuild
pnpm dev
```

## Next Steps

1. **Customize the UI**: Edit `src/app/page.tsx` and components in `src/components/`
2. **Add Features**: Create new pages in `src/app/` and API routes in `src/app/api/`
3. **Define Models**: Add Mongoose schemas in `src/lib/models/`
4. **Configure Auth**: Update OAuth providers in `src/lib/auth.ts`
5. **Write Tests**: Add unit tests alongside components and E2E tests in `e2e/`
6. **Deploy**: Follow the [Deployment Guide](./DEPLOYMENT.md) for Azure deployment

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Getting Help

- Check existing [GitHub Issues](https://github.com/your-org/your-repo/issues)
- Review the [documentation](./docs/)
- Ask questions in team Slack/Discord

---

**Happy Coding! 🚀**
