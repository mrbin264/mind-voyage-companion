# Next.js 15 MVP Boilerplate

> Production-ready starter with Next.js 15, TypeScript, MongoDB, NextAuth, Tailwind CSS, and Azure CI/CD

## ✨ Features

- ⚡️ **Next.js 15** - App Router, Server Components
- 📘 **TypeScript** - Strict mode enabled
- 🗄️ **MongoDB** - Mongoose ODM with pooling
- 🔐 **NextAuth.js v5** - Auth with OAuth support
- 🎨 **Tailwind CSS** - Utility-first styling
- 🧪 **Testing Ready** - Vitest + Playwright
- ☁️ **Azure CI/CD** - Auto staging, manual prod
- 🐳 **Docker** - Dev & prod containers

## 🚀 Quick Start

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env.local
pnpm generate:secrets

# 3. Start MongoDB
pnpm docker:dev

# 4. Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # Auth pages
│   ├── api/         # API routes
│   └── dashboard/   # Protected pages
├── components/      # React components
├── lib/            # Utilities & DB
└── types/          # TypeScript types
```

## 🛠️ Commands

```bash
pnpm dev             # Development
pnpm build          # Production build
pnpm lint:fix       # Fix linting
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
```

## 📚 Docs

- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Azure deployment

## 🚢 Deploy

- **Staging**: Push to `develop` (auto-deploy)
- **Production**: Push to `main` (manual approval)

---

**Start building your MVP! 🚀**
