/**
 * Sample Type Definitions Template
 *
 * This file demonstrates how to define TypeScript types for your application.
 * Copy and modify these patterns for your domain models.
 *
 * Examples: Product, Order, Cart, Profile, etc.
 */

// ============================================================================
// Basic Entity Type
// ============================================================================

export interface SampleEntity {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  updatedAt: Date
  userId: string
}

// ============================================================================
// Form/Input Types (Omit auto-generated fields)
// ============================================================================

export type CreateSampleInput = Omit<
  SampleEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type UpdateSampleInput = Partial<
  Omit<SampleEntity, 'id' | 'userId' | 'createdAt'>
>

// ============================================================================
// API Response Types
// ============================================================================

export interface SampleApiResponse {
  success: boolean
  data: SampleEntity[]
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface SampleErrorResponse {
  success: false
  error: string
  code?: string
  details?: Record<string, string[]>
}

// ============================================================================
// Filter/Query Types
// ============================================================================

export interface SampleFilters {
  status?: SampleEntity['status'][]
  userId?: string
  search?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface SampleSortOptions {
  field: keyof SampleEntity
  order: 'asc' | 'desc'
}

export interface SampleQueryParams extends SampleFilters {
  page?: number
  limit?: number
  sort?: SampleSortOptions
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface SampleCardProps {
  data: SampleEntity
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'default' | 'compact' | 'detailed'
}

export interface SampleListProps {
  items: SampleEntity[]
  loading?: boolean
  error?: string | null
  onItemClick?: (item: SampleEntity) => void
}

export interface SampleFormProps {
  initialData?: SampleEntity
  onSubmit: (data: CreateSampleInput | UpdateSampleInput) => Promise<void>
  onCancel?: () => void
  mode: 'create' | 'edit'
}

// ============================================================================
// State Management Types
// ============================================================================

export interface SampleState {
  items: SampleEntity[]
  selectedItem: SampleEntity | null
  filters: SampleFilters
  loading: boolean
  error: string | null
}

export type SampleAction =
  | { type: 'SET_ITEMS'; payload: SampleEntity[] }
  | { type: 'ADD_ITEM'; payload: SampleEntity }
  | {
      type: 'UPDATE_ITEM'
      payload: { id: string; updates: Partial<SampleEntity> }
    }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SELECT_ITEM'; payload: SampleEntity | null }
  | { type: 'SET_FILTERS'; payload: SampleFilters }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// ============================================================================
// Utility Types
// ============================================================================

// Make specific fields required
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Make specific fields optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

// Example: SampleEntity with required description
export type SampleWithDescription = RequiredFields<SampleEntity, 'description'>

// Example: SampleEntity with optional status
export type SampleWithOptionalStatus = OptionalFields<SampleEntity, 'status'>

// ============================================================================
// Validation Schema Types (for use with Zod, Yup, etc.)
// ============================================================================

export interface SampleValidationRules {
  name: {
    minLength: number
    maxLength: number
    required: boolean
  }
  description: {
    minLength: number
    maxLength: number
    required: boolean
  }
}

// ============================================================================
// Domain-Specific Types
// ============================================================================

// Nested/Related Entities
export interface SampleWithRelations extends SampleEntity {
  user?: {
    id: string
    name: string
    email: string
  }
  tags?: string[]
  metadata?: Record<string, unknown>
}

// Statistical/Analytical Types
export interface SampleStatistics {
  total: number
  byStatus: Record<SampleEntity['status'], number>
  recentItems: SampleEntity[]
  topUsers: Array<{
    userId: string
    count: number
  }>
}

// ============================================================================
// Example Usage:
// ============================================================================

/*
// In a component:
import { SampleEntity, CreateSampleInput } from '@/types/sample'

function MyComponent() {
  const [items, setItems] = useState<SampleEntity[]>([])
  
  const handleCreate = async (input: CreateSampleInput) => {
    // TypeScript ensures input has correct shape
    const response = await fetch('/api/sample', {
      method: 'POST',
      body: JSON.stringify(input)
    })
  }
}

// In an API route:
import { NextRequest, NextResponse } from 'next/server'
import { SampleApiResponse, CreateSampleInput } from '@/types/sample'

export async function POST(request: NextRequest) {
  const body = await request.json() as CreateSampleInput
  
  // TypeScript knows the shape of body
  const newItem = await createSample(body)
  
  const response: SampleApiResponse = {
    success: true,
    data: [newItem]
  }
  
  return NextResponse.json(response)
}
*/
