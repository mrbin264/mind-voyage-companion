# [MVC-001] User registration and authentication

**Phase**: 1 (MVP)  
**Priority**: Critical  
**GitHub Issue**: [#1](https://github.com/mrbin264/mind-voyage-companion/issues/1)

## User Story

**ID**: MVC-001  
**Description**: As a new user, I want to create an account with my email and password so that I can securely access my personal habit tracking and journaling data

## Acceptance Criteria

- [ ] User can register with valid email address and secure password (8+ characters)
- [ ] Email validation prevents duplicate account creation
- [ ] Confirmation email is sent for account verification (optional in MVP)
- [ ] User receives immediate access to core features after registration
- [ ] Password requirements are clearly communicated during registration

## Priority

Critical - Phase 1 (MVP)

## Technical Notes

- Implement secure email/password authentication
- Use session management with httpOnly cookies
- Password reset functionality required
- Consider using bcrypt for password hashing
- Row-level security for user data isolation

## Definition of Done

- [ ] User registration form implemented with validation
- [ ] Login/logout functionality working
- [ ] Password reset flow implemented
- [ ] Unit tests for authentication logic
- [ ] E2E tests for auth flows
- [ ] Security audit completed

## Dependencies

None - foundational feature

## Estimated Effort

**Story Points**: 8  
**Time Estimate**: 1-2 weeks

## Technical Implementation Details

### Frontend Components

#### Authentication Forms (RSC + Client Components)
```typescript
// app/(auth)/register/page.tsx - Server Component
export default function RegisterPage() {
  return <AuthLayout><RegisterForm /></AuthLayout>
}

// components/auth/RegisterForm.tsx - Client Component
'use client'
interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, null)
  const [pending, startTransition] = useTransition()
  
  return (
    <form action={formAction} className="space-y-4">
      <FormField 
        name="email" 
        type="email" 
        label="Email"
        error={state?.fieldErrors?.email}
        required
      />
      <PasswordField 
        name="password"
        label="Password" 
        requirements={{
          minLength: 8,
          requireNumbers: true,
          requireSpecialChars: true
        }}
        error={state?.fieldErrors?.password}
      />
      <FormSubmitButton pending={pending}>
        Create Account
      </FormSubmitButton>
    </form>
  )
}
```

#### Validation & Form Handling
```typescript
// lib/validations/auth.ts
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
})

// lib/actions/auth.ts - Server Actions
export async function registerAction(prevState: any, formData: FormData) {
  const validation = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name')
  })
  
  if (!validation.success) {
    return { fieldErrors: validation.error.flatten().fieldErrors }
  }
  
  // Registration logic...
  redirect('/onboarding')
}
```

#### Component Architecture
- **AuthLayout** - Shared layout for auth pages with branding
- **FormField** - Reusable form input with validation states
- **PasswordField** - Enhanced password input with strength indicator
- **FormSubmitButton** - Button with loading states and pending UI
- **AuthGuard** - HOC for protecting authenticated routes
- **SessionProvider** - Context for auth state management

### Backend API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-request` - Password reset request
- `POST /api/auth/reset-confirm` - Password reset confirmation

### Database Schema
```sql
User {
  id        UUID      @id @default(uuid())
  email     String    @unique
  password  String    -- hashed with bcrypt
  name      String?
  verified  Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## Testing Strategy

- Unit tests for password validation logic
- Integration tests for auth API endpoints
- E2E tests for complete registration and login flows
- Security testing for password hashing and session management