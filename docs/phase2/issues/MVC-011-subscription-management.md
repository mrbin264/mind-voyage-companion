# [MVC-011] Subscription management

**Phase**: 2 (Pro Features)  
**Priority**: Medium  
**GitHub Issue**: [#11](https://github.com/mrbin264/mind-voyage-companion/issues/11)

## User Story

**ID**: MVC-011  
**Description**: As a user interested in Pro features, I want to easily subscribe, modify, and cancel my subscription so that I have full control over my billing and account status

## Acceptance Criteria

- [ ] Clear pricing information and feature comparison between Free and Pro tiers
- [ ] Secure payment processing with support for major credit cards
- [ ] Immediate access to Pro features upon successful subscription activation
- [ ] Easy cancellation process with access maintained through current billing period
- [ ] Billing history and receipt access for subscription management

## Priority

Medium - Phase 2 (Pro Feature)

## Technical Notes

- Payment processing integration (Stripe recommended)
- Subscription management system
- Feature flags for Pro tier access
- Billing history and receipt generation
- Webhook handling for subscription events

## Definition of Done

- [ ] Payment processing system integrated
- [ ] Subscription management interface
- [ ] Pro feature access control implemented
- [ ] Cancellation flow with period-end access
- [ ] Billing history and receipts available
- [ ] Webhook system for subscription updates

## Dependencies

- Feature flags system for Pro access control
- Email system for billing notifications
- External payment processor (Stripe) integration

## Estimated Effort

**Story Points**: 21  
**Time Estimate**: 3-4 weeks

## Technical Implementation Details

### Frontend Components
- PricingPage with tier comparison
- SubscriptionModal with payment form
- BillingDashboard showing current status
- PaymentHistory with downloadable receipts
- CancellationFlow with retention attempts

### Backend API Endpoints
- `GET /api/billing/plans` - Get available subscription plans
- `POST /api/billing/subscribe` - Create new subscription
- `GET /api/billing/subscription` - Get current subscription
- `PATCH /api/billing/subscription` - Modify subscription
- `DELETE /api/billing/subscription` - Cancel subscription
- `GET /api/billing/history` - Get billing history
- `POST /api/billing/webhook` - Handle payment processor webhooks

### Database Schema
```sql
Subscription {
  id               UUID      @id @default(uuid())
  userId           UUID      @unique @relation(User)
  stripeCustomerId String    @unique
  subscriptionId   String    @unique
  plan             Plan      @default(FREE)
  status           SubStatus @default(ACTIVE)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean   @default(false)
  canceledAt         DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

Invoice {
  id             UUID     @id @default(uuid())
  userId         UUID     @relation(User)
  subscriptionId UUID?    @relation(Subscription)
  stripeInvoiceId String  @unique
  amount         Decimal  @db.Decimal(10,2)
  currency       String   @default("usd")
  status         InvoiceStatus
  paidAt         DateTime?
  dueDate        DateTime
  createdAt      DateTime @default(now())
}

enum Plan {
  FREE
  PRO_MONTHLY
  PRO_YEARLY
}

enum SubStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  UNPAID
  INCOMPLETE
}

enum InvoiceStatus {
  DRAFT
  OPEN
  PAID
  UNCOLLECTIBLE
  VOID
}
```

### Stripe Integration
```typescript
interface SubscriptionConfig {
  priceIds: {
    monthly: string;
    yearly: string;
  };
  features: {
    free: string[];
    pro: string[];
  };
}

class SubscriptionService {
  async createSubscription(userId: string, priceId: string) {
    // Create Stripe customer and subscription
    // Update local database
    // Activate Pro features
  }
  
  async cancelSubscription(userId: string, cancelImmediately: boolean = false) {
    // Cancel Stripe subscription
    // Update local status
    // Schedule feature deactivation
  }
  
  async handleWebhook(event: Stripe.Event) {
    // Handle subscription lifecycle events
    // Update local database state
    // Send user notifications
  }
}
```

### Feature Access Control
```typescript
interface FeatureFlags {
  aiJournaling: boolean;
  weeklyReports: boolean;
  dataVisualization: boolean;
  dataExport: boolean;
  prioritySupport: boolean;
}

function getFeatureFlags(user: User): FeatureFlags {
  const isProActive = user.subscription?.status === 'ACTIVE' && 
                     user.subscription?.plan !== 'FREE';
  
  return {
    aiJournaling: isProActive,
    weeklyReports: isProActive,
    dataVisualization: isProActive,
    dataExport: isProActive,
    prioritySupport: isProActive,
  };
}
```

### Pricing Strategy
- **Free Tier**: Core habit tracking, basic journaling, daily Stoic quotes
- **Pro Monthly**: $9.99/month - All features included
- **Pro Yearly**: $99.99/year - 2 months free (16% savings)

### Billing and Invoicing
- Automatic monthly/yearly billing
- Prorated charges for mid-cycle upgrades
- Downloadable PDF receipts
- Tax calculation and compliance
- Failed payment retry logic

### Customer Communication
- Welcome email for new subscribers
- Payment confirmation receipts
- Billing reminder notifications
- Cancellation feedback collection
- Win-back campaigns for cancelled users

## Testing Strategy

- Integration tests with Stripe test environment
- Unit tests for subscription logic
- Webhook testing with mock events
- E2E tests for subscription flows
- Payment failure scenario testing
- Security testing for payment data handling