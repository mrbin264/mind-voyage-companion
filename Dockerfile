# Mind Voyage Companion - Docker Configuration
# Multi-stage Dockerfile for Next.js 15 with TypeScript and Tailwind CSS

# =============================================================================
# Base Stage - Common dependencies and setup
# =============================================================================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./
COPY .npmrc* ./

# Install pnpm globally
RUN npm install -g pnpm@latest

# =============================================================================
# Dependencies Stage - Install all dependencies
# =============================================================================
FROM base AS deps

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# =============================================================================
# Builder Stage - Build the application
# =============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client if using Prisma (skip if not)
# RUN npx prisma generate

# Build the application
RUN pnpm build

# =============================================================================
# Production Dependencies Stage - Install only production dependencies
# =============================================================================
FROM base AS prod-deps

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# =============================================================================
# Development Stage - For development with hot reload
# =============================================================================
FROM base AS development

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set development environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose development port
EXPOSE 3000

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start development server
CMD ["pnpm", "dev"]

# =============================================================================
# Production Stage - Optimized production image
# =============================================================================
FROM node:20-alpine AS production

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set working directory
WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Copy other necessary files
COPY --chown=nextjs:nodejs tailwind.config.ts ./tailwind.config.ts
COPY --chown=nextjs:nodejs postcss.config.mjs ./postcss.config.mjs
COPY --chown=nextjs:nodejs tsconfig.json ./tsconfig.json

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check for production
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Switch to non-root user
USER nextjs

# Start the application
CMD ["node_modules/.bin/next", "start"]

# =============================================================================
# Default target (can be overridden with --target flag)
# =============================================================================
FROM production