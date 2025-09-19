# Authentication API Documentation

## Overview

This document provides comprehensive documentation for the Mind Voyage Companion authentication API endpoints. All endpoints are RESTful and return JSON responses with consistent error handling and validation.

## Base URL

```
/api/auth
```

## Authentication

Most endpoints require authentication via JWT tokens stored in secure HTTP-only cookies. The token is automatically included in requests when authenticated.

## Response Format

All API responses follow this consistent format:

```typescript
{
  success: boolean
  message: string
  data?: any // Response data (varies by endpoint)
  errors?: Record<string, string[]> // Validation errors
  user?: UserObject // User data (when applicable)
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Endpoints

### 1. User Registration

Register a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```typescript
{
  email: string          // Valid email address
  password: string       // Min 8 chars, uppercase, lowercase, number/special
  confirmPassword: string // Must match password
  name: string          // Min 2 characters
  timezone?: string     // Optional timezone (defaults to UTC)
}
```

**Response:**
```typescript
{
  success: true,
  message: "Account created successfully",
  user: {
    id: string
    email: string
    name: string
    verified: boolean
    timezone: string
    createdAt: string
  }
}
```

**Errors:**
- Email already in use
- Password validation failures
- Password confirmation mismatch

---

### 2. User Login

Authenticate user and create session.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```typescript
{
  email: string     // User's email
  password: string  // User's password
}
```

**Response:**
```typescript
{
  success: true,
  message: "Login successful",
  user: {
    id: string
    email: string
    name: string
    verified: boolean
    timezone: string
    createdAt: string
    preferences: object
  }
}
```

**Errors:**
- Invalid credentials
- Account not found

---

### 3. User Logout

End user session and clear authentication cookie.

**Endpoint:** `POST /api/auth/logout` or `GET /api/auth/logout`

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  message: "Logged out successfully"
}
```

---

### 4. Password Reset Request

Request a password reset token via email.

**Endpoint:** `POST /api/auth/reset-request`

**Request Body:**
```typescript
{
  email: string  // User's email address
}
```

**Response:**
```typescript
{
  success: true,
  message: "If your email is registered, you will receive a password reset link.",
  resetToken?: string // Only in development environment
}
```

**Note:** For security, the same response is returned regardless of whether the email exists.

---

### 5. Password Reset Confirmation

Confirm password reset with token and set new password.

**Endpoint:** `POST /api/auth/reset-confirm`

**Request Body:**
```typescript
{
  token: string     // Reset token from email
  password: string  // New password (same validation as registration)
}
```

**Response:**
```typescript
{
  success: true,
  message: "Password has been reset successfully. You can now log in with your new password."
}
```

**Errors:**
- Invalid or expired token
- Password validation failures

---

### 6. Get Current User

Get information about the currently authenticated user.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  user: {
    id: string
    email: string
    name: string
  }
}
```

**Errors:**
- Not authenticated (401)

---

### 7. Get User Profile

Get detailed profile information for the authenticated user.

**Endpoint:** `GET /api/auth/profile`

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  user: {
    id: string
    email: string
    name: string
    verified: boolean
    timezone: string
    preferences: {
      theme: 'light' | 'dark' | 'system'
      notifications: {
        email: boolean
        push: boolean
      }
      privacy: {
        publicProfile: boolean
      }
    }
    createdAt: string
    updatedAt: string
  }
}
```

---

### 8. Update User Profile

Update user profile information and preferences.

**Endpoint:** `PATCH /api/auth/profile`

**Authentication:** Required

**Request Body:**
```typescript
{
  name?: string        // Optional: Update display name
  timezone?: string    // Optional: Update timezone
  preferences?: {      // Optional: Update preferences
    theme?: 'light' | 'dark' | 'system'
    notifications?: {
      email?: boolean
      push?: boolean
    }
    privacy?: {
      publicProfile?: boolean
    }
  }
}
```

**Response:**
```typescript
{
  success: true,
  message: "Profile updated successfully",
  user: UserProfileObject // Updated user data
}
```

---

### 9. Change Password

Change user password (requires current password verification).

**Endpoint:** `POST /api/auth/change-password`

**Authentication:** Required

**Request Body:**
```typescript
{
  currentPassword: string  // User's current password
  newPassword: string     // New password (same validation as registration)
}
```

**Response:**
```typescript
{
  success: true,
  message: "Password changed successfully"
}
```

**Errors:**
- Current password incorrect
- New password same as current
- Password validation failures

---

### 10. Delete Account

Permanently delete user account and all associated data.

**Endpoint:** `DELETE /api/auth/profile`

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  message: "Account deleted successfully"
}
```

**Note:** This action is irreversible and will immediately log out the user.

---

## Middleware Features

### Rate Limiting

All authentication endpoints are protected by rate limiting:
- Default: 10 requests per minute per IP
- Returns `429 Too Many Requests` when exceeded

### Input Validation

All request bodies are validated using Zod schemas with detailed error messages:
```typescript
{
  success: false,
  message: "Validation failed",
  errors: {
    fieldName: ["Error message 1", "Error message 2"]
  }
}
```

### Security Features

- **Password Hashing:** bcryptjs with salt rounds of 12
- **JWT Tokens:** 7-day expiration with secure configuration
- **HTTP-Only Cookies:** Prevent XSS attacks
- **CSRF Protection:** SameSite cookie attribute
- **Secure Headers:** Production environment enforces HTTPS

### CORS Support

CORS headers are automatically added to all responses for cross-origin requests.

## Usage Examples

### JavaScript/TypeScript Client

```typescript
// Register new user
const registerResponse = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    name: 'John Doe',
    timezone: 'America/New_York'
  }),
})

const registerData = await registerResponse.json()

// Login user
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  }),
})

const loginData = await loginResponse.json()

// Get current user (requires authentication cookie)
const userResponse = await fetch('/api/auth/me', {
  credentials: 'include', // Include cookies
})

const userData = await userResponse.json()

// Update profile
const updateResponse = await fetch('/api/auth/profile', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Updated Name',
    preferences: {
      theme: 'dark',
      notifications: {
        email: false
      }
    }
  }),
})

// Logout
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
})
```

### Error Handling

```typescript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })

  const data = await response.json()

  if (!data.success) {
    // Handle validation errors
    if (data.errors) {
      Object.entries(data.errors).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`)
      })
    } else {
      console.error(data.message)
    }
    return
  }

  // Success - handle user data
  console.log('Logged in as:', data.user.name)

} catch (error) {
  console.error('Network error:', error)
}
```

## Environment Variables

Required environment variables for authentication:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mind-voyage-companion
MONGODB_DATABASE=mind-voyage-companion

# JWT Secret
NEXTAUTH_SECRET=your-super-secure-secret-key-here

# Application URL
NEXTAUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Testing

The authentication API includes comprehensive error handling and logging for debugging purposes. In development mode:

- Detailed error messages are returned
- Password reset tokens are included in responses for testing
- Console logging provides debugging information

In production mode:
- Error messages are generic for security
- Sensitive information is excluded from responses
- Comprehensive logging is maintained server-side

For testing the API endpoints, use tools like:
- Postman
- cURL
- Jest with supertest for automated testing
- VS Code REST Client extension

---

This documentation covers all authentication-related API endpoints in the Mind Voyage Companion application. For questions or issues, please refer to the project repository or contact the development team.