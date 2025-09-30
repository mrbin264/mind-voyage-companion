# API Security Implementation Guide

## 🔐 Overview

This document outlines the comprehensive security implementation for the Mind Voyage Companion API, including rate limiting, authentication, validation, sanitization, and error handling.

## 🏗️ Architecture

### Security Layers

1. **Rate Limiting** - Prevents abuse and DDoS attacks
2. **Authentication** - Validates user sessions using NextAuth
3. **Input Validation** - Ensures data integrity using Zod schemas
4. **Sanitization** - Prevents injection attacks and XSS
5. **Error Handling** - Provides security-conscious error responses
6. **Audit Logging** - Tracks security events and errors

## 📁 File Structure

```
src/lib/
├── middleware/
│   ├── rate-limit.ts        # Rate limiting middleware
│   ├── auth.ts              # Authentication middleware  
│   ├── error-handler.ts     # Standardized error handling
│   └── security.ts          # Security middleware composer
├── validation/
│   └── schemas.ts           # Zod validation schemas
└── security/
    └── sanitization.ts      # Input sanitization utilities
```

## 🚦 Rate Limiting

### Configuration Options

```typescript
import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit'

// Predefined configurations
- auth: 5 requests per 15 minutes
- api: 100 requests per minute  
- mutation: 30 requests per minute
- upload: 10 requests per minute
- public: 20 requests per minute
```

### Usage Examples

```typescript
// Apply rate limiting to an endpoint
const rateLimitMiddleware = apiRateLimit()
const result = await rateLimitMiddleware(request)
if (result) return result // Rate limited

// Custom rate limiting
const customRateLimit = rateLimit({
  windowMs: 300000, // 5 minutes
  maxRequests: 10,
  keyGenerator: keyGenerators.user
})
```

### Key Generation Strategies

- **IP-based**: `keyGenerators.ip` - Rate limit by IP address
- **User-based**: `keyGenerators.user` - Rate limit by authenticated user
- **Combined**: `keyGenerators.combined` - Rate limit by user + IP

## 🔑 Authentication

### NextAuth Integration

```typescript
import { requireAuth, optionalAuth, withAuth } from '@/lib/middleware/auth'

// Require authentication
const authResult = await requireAuth()(request)
if (!authResult.success) return authResult.error

// Optional authentication
const authResult = await optionalAuth()(request) 
// Sets guest session if not authenticated

// Higher-order wrapper
export const GET = withAuth(async (request, session) => {
  // session is guaranteed to be valid
  const userId = session.user.id
}, { required: true, verified: true })
```

### Authorization Levels

```typescript
// Basic authentication
auth: { required: true }

// Require verified email
auth: { required: true, verified: true }

// Require specific roles
auth: { required: true, roles: ['admin', 'moderator'] }
```

## ✅ Input Validation

### Zod Schema Usage

```typescript
import schemas from '@/lib/validation/schemas'

// Validate request body
const result = await parseAndValidate(request, schemas.createHabit)
if (!result.success) {
  // Handle validation errors
  return errorResponse(result.errors)
}

// Validate query parameters
const queryResult = validateSearchParams(schemas.habitQuery, searchParams)
if (!queryResult.success) {
  throw new ValidationError('Invalid query parameters')
}
```

### Available Schemas

- **User schemas**: `createUser`, `updateUser`, `login`
- **Habit schemas**: `createHabit`, `updateHabit`, `logHabit`, `habitQuery`  
- **Journal schemas**: `createJournalEntry`, `updateJournalEntry`, `journalQuery`
- **Common schemas**: `pagination`, `search`, `sort`, `dateRange`

### Custom Validation

```typescript
// Password validation with security requirements
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, and number")

// Email with sanitization
const emailSchema = z.string()
  .email("Invalid email format")
  .toLowerCase()
  .transform(sanitizeEmail)
```

## 🧹 Sanitization

### Sanitization Functions

```typescript
import { 
  sanitizeHtml, 
  sanitizeText, 
  sanitizeMongoQuery,
  createSafeRegex 
} from '@/lib/security/sanitization'

// HTML/XSS prevention
const cleanText = sanitizeHtml(userInput)

// MongoDB injection prevention  
const safeQuery = sanitizeMongoQuery(queryObject)

// Safe regex for search
const searchRegex = createSafeRegex(searchTerm)
if (searchRegex) {
  query.$or = [
    { title: searchRegex },
    { description: searchRegex }
  ]
}
```

### Security Features

- **XSS Prevention**: Removes script tags, event handlers, dangerous protocols
- **SQL Injection**: Sanitizes MongoDB operators and queries
- **ReDoS Prevention**: Validates and limits regex complexity
- **File Security**: Sanitizes filenames and paths
- **Deep Sanitization**: Recursively cleans nested objects

## ❌ Error Handling

### Standardized Error Responses

```typescript
import { 
  handleError, 
  throwValidationError,
  throwNotFoundError,
  withErrorHandling 
} from '@/lib/middleware/error-handler'

// Throw specific errors
throwValidationError('Invalid input data', { field: 'email' })
throwNotFoundError('Habit')
throwAuthError('Invalid credentials')

// Wrap handlers with error handling
export const GET = withErrorHandling(async (request) => {
  // Any thrown error is automatically handled
  throw new APIError('Something went wrong', 500)
}, { logRequests: true })
```

### Error Categories & Severity

```typescript
enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication', 
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  DATABASE = 'database',
  SERVER = 'server'
}

enum ErrorSeverity {
  LOW = 'low',        // Validation errors
  MEDIUM = 'medium',  // Auth errors
  HIGH = 'high',      // Database errors
  CRITICAL = 'critical' // System errors
}
```

## 🛡️ Security Middleware Composer

### Simple Usage with Presets

```typescript
import { secureEndpoint } from '@/lib/middleware/security'

// Public endpoint (no auth, basic rate limiting)
export const GET = secureEndpoint.public(async (request, context) => {
  // context.session may be null
})

// Standard API endpoint (auth required)  
export const GET = secureEndpoint.api(async (request, context) => {
  const { session } = context // guaranteed valid session
  const userId = session.user.id
})

// Mutation endpoint (stricter rate limiting)
export const POST = secureEndpoint.mutation(async (request, context) => {
  const { session, validatedBody } = context
})

// Admin endpoint (role-based access)
export const DELETE = secureEndpoint.admin(async (request, context) => {
  // Only admin users can access
})
```

### Custom Security Configuration

```typescript
export const PUT = secureEndpoint.custom(async (request, context) => {
  const { session, validatedBody, sanitizedBody } = context
}, {
  rateLimit: { 
    type: 'custom', 
    maxRequests: 5, 
    windowMs: 300000 
  },
  auth: { 
    required: true, 
    verified: true, 
    roles: ['premium'] 
  },
  validation: {
    body: schemas.updateHabit,
    query: schemas.pagination
  },
  sanitization: {
    sanitizeBody: true,
    sanitizeQuery: true
  },
  logging: {
    logRequests: true,
    logResponses: true
  }
})
```

## 📊 Security Monitoring

### Rate Limit Statistics

```typescript
import { getRateLimitStats, resetRateLimit } from '@/lib/middleware/rate-limit'

// Get current rate limit stats
const stats = getRateLimitStats()
console.log('Active rate limits:', stats.totalKeys)

// Reset rate limit for a specific key (admin function)
resetRateLimit('user:12345')
```

### Error Logging

```typescript
// Errors are automatically logged with context
- Request details (method, URL, headers)
- User information (if authenticated)
- Error severity and category
- Stack traces (development only)
- Request ID for tracing
```

## 🚀 Implementation Examples

### Secure Habits API

```typescript
// GET /api/habits - List habits with security
export const GET = secureEndpoint.api(async (request, context) => {
  const { session } = context
  
  // Query validation happens automatically
  const { searchParams } = new URL(request.url)
  const queryValidation = schemas.habitQuery.safeParse({
    status: searchParams.get('status') || 'active',
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '20'
  })
  
  if (!queryValidation.success) {
    throwValidationError('Invalid query parameters')
  }
  
  const filters = queryValidation.data
  
  // Build secure query
  const query = { 
    userId: session.user.id,
    ...buildSecureFilters(filters)
  }
  
  const habits = await HabitModel.find(query)
    .limit(filters.limit)
    .skip((filters.page - 1) * filters.limit)
  
  return NextResponse.json({
    success: true,
    data: habits,
    meta: { pagination: { page: filters.page, limit: filters.limit } }
  })
})

// POST /api/habits - Create habit with validation
export const POST = secureEndpoint.mutation(async (request, context) => {
  const { session } = context
  
  // Parse and validate body
  const body = await request.json()
  const validation = schemas.createHabit.safeParse(body)
  
  if (!validation.success) {
    throwValidationError('Invalid habit data', validation.error.issues)
  }
  
  const habitData = validation.data
  
  // Additional business validation
  const existingCount = await HabitModel.countDocuments({ 
    userId: session.user.id,
    'status.archived': false
  })
  
  if (existingCount >= 50) {
    throwValidationError('Maximum habits limit reached')
  }
  
  // Create with secure defaults
  const habit = await HabitModel.create({
    ...habitData,
    userId: session.user.id,
    createdAt: new Date()
  })
  
  return NextResponse.json({
    success: true,
    data: habit
  }, { status: 201 })
})
```

## 🔧 Configuration

### Environment Variables

```bash
# NextAuth configuration (already configured)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional: API keys for server-to-server communication
API_KEYS=key1,key2,key3

# Optional: JWT secret for custom tokens
JWT_SECRET=your-jwt-secret
```

### Production Considerations

1. **Redis Rate Limiting**: Replace in-memory store with Redis for production
2. **Error Tracking**: Integrate with Sentry or similar service
3. **API Keys**: Implement API key authentication for server-to-server calls
4. **CORS**: Configure proper CORS headers
5. **Security Headers**: Add security headers middleware
6. **Request Size Limits**: Configure body parser limits

## 🏁 Migration Guide

### Converting Existing Routes

1. **Replace manual error handling**:
   ```typescript
   // Before
   try {
     // route logic
   } catch (error) {
     return NextResponse.json({ error: 'Something went wrong' })
   }
   
   // After  
   export const GET = secureEndpoint.api(async (request, context) => {
     // Errors handled automatically
     // Just throw or let errors bubble up
   })
   ```

2. **Replace manual auth checks**:
   ```typescript
   // Before
   const session = await auth()
   if (!session?.user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
   }
   
   // After
   export const GET = secureEndpoint.api(async (request, context) => {
     const { session } = context // Already validated
   })
   ```

3. **Replace manual validation**:
   ```typescript
   // Before  
   const body = await request.json()
   if (!body.title || !body.frequency) {
     return NextResponse.json({ error: 'Missing fields' })
   }
   
   // After
   const validation = schemas.createHabit.safeParse(body)
   if (!validation.success) {
     throwValidationError('Invalid data', validation.error.issues)
   }
   ```

## 📈 Benefits

✅ **Consistent Security**: All endpoints follow the same security patterns
✅ **Reduced Boilerplate**: Security handled declaratively  
✅ **Type Safety**: Full TypeScript support with proper types
✅ **Comprehensive Logging**: Security events and errors tracked
✅ **Performance**: Efficient rate limiting and caching
✅ **Scalability**: Easy to extend and customize
✅ **Maintainability**: Centralized security configuration

This security implementation provides enterprise-grade protection while maintaining developer productivity and code maintainability.