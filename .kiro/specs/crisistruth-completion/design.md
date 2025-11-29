# Design Document

## Overview

CrisisTruth is a full-stack fact verification platform that combines AI-powered analysis with human expert review to combat misinformation during crisis situations. The system architecture follows a modern three-tier design with a Next.js frontend, Node.js/Express backend API, and PostgreSQL database. The platform implements real-time updates using WebSockets, integrates with external AI services for claim analysis, and provides a RESTful API for third-party integrations. The business model is based on tiered subscriptions with feature-gated access.

## Architecture

### System Architecture

The system follows a client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  Next.js 14 + React + TypeScript + Tailwind CSS             │
│  - User Interface Components                                 │
│  - Real-time WebSocket Client                                │
│  - State Management (React Context/Zustand)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  Express.js + TypeScript                                     │
│  - Authentication Middleware                                 │
│  - Rate Limiting                                             │
│  - Request Validation                                        │
│  - API Routing                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Business Logic Layer   │  │   WebSocket Server       │
│  - Verification Service  │  │  - Real-time Updates     │
│  - User Service          │  │  - Event Broadcasting    │
│  - Crisis Service        │  │  - Connection Management │
│  - Source Service        │  └──────────────────────────┘
│  - Analytics Service     │
└──────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│  - Repository Pattern                                        │
│  - Query Builders                                            │
│  - Transaction Management                                    │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  PostgreSQL 15+                                              │
│  - User Data                                                 │
│  - Claims & Verifications                                    │
│  - Sources & Credibility                                     │
│  - Crises & Analytics                                        │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  OpenAI API      │  │  Email Service   │  │  Payment Gateway │
│  (GPT-4)         │  │  (SendGrid)      │  │  (Stripe)        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- Socket.io-client (WebSocket)
- Zod (validation)
- React Hook Form

**Backend:**
- Node.js 20+
- Express.js
- TypeScript
- Socket.io (WebSocket server)
- Prisma ORM
- JWT (authentication)
- bcrypt (password hashing)

**Database:**
- PostgreSQL 15+
- Redis (caching & session storage)

**External Services:**
- OpenAI API (AI verification)
- SendGrid (email notifications)
- Stripe (payment processing)

## Components and Interfaces

### 1. Authentication Service

**Purpose:** Manages user registration, login, session management, and authorization.

**Interface:**
```typescript
interface AuthService {
  register(userData: RegisterDTO): Promise<User>
  login(credentials: LoginDTO): Promise<AuthResponse>
  logout(userId: string): Promise<void>
  verifyToken(token: string): Promise<TokenPayload>
  refreshToken(refreshToken: string): Promise<AuthResponse>
  resetPassword(email: string): Promise<void>
  updatePassword(userId: string, newPassword: string): Promise<void>
}

interface RegisterDTO {
  email: string
  password: string
  name: string
  role?: UserRole
}

interface LoginDTO {
  email: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
}
```

**Implementation Details:**
- Passwords hashed using bcrypt with salt rounds of 12
- JWT tokens with 15-minute expiry for access tokens, 7-day expiry for refresh tokens
- Session data stored in Redis for fast lookup
- Rate limiting on login attempts (5 attempts per 15 minutes per IP)

### 2. Verification Service

**Purpose:** Orchestrates the AI-powered claim verification process.

**Interface:**
```typescript
interface VerificationService {
  verifyClaim(claimId: string): Promise<VerificationResult>
  getVerificationStatus(claimId: string): Promise<VerificationStatus>
  calculateConfidenceScore(evidence: Evidence[]): number
  queryExternalSources(claim: string): Promise<Source[]>
  generateVerificationReport(claimId: string): Promise<Report>
}

interface VerificationResult {
  claimId: string
  status: 'verified' | 'disputed' | 'unverified'
  confidenceScore: number
  summary: string
  sources: Source[]
  evidence: Evidence
  processingTime: number
}

interface Evidence {
  supporting: number
  contradicting: number
  neutral: number
  details: EvidenceDetail[]
}

interface Source {
  id: string
  title: string
  url: string
  credibility: number
  excerpt: string
  type: SourceType
}
```

**Implementation Details:**
- Uses OpenAI GPT-4 for natural language understanding and claim extraction
- Queries multiple external APIs (fact-checking databases, news APIs, scientific databases)
- Implements caching for frequently verified claims (24-hour TTL)
- Confidence score algorithm weights source credibility and consensus level
- Async processing with progress updates via WebSocket

### 3. Claim Service

**Purpose:** Manages claim submission, storage, and retrieval.

**Interface:**
```typescript
interface ClaimService {
  submitClaim(claimData: CreateClaimDTO): Promise<Claim>
  getClaim(claimId: string): Promise<Claim>
  getUserClaims(userId: string, pagination: Pagination): Promise<PaginatedResult<Claim>>
  updateClaimStatus(claimId: string, status: ClaimStatus): Promise<Claim>
  associateWithCrisis(claimId: string, crisisId: string): Promise<void>
  searchClaims(query: SearchQuery): Promise<PaginatedResult<Claim>>
}

interface CreateClaimDTO {
  text: string
  userId: string
  category?: string
  tags?: string[]
}

interface Claim {
  id: string
  text: string
  userId: string
  status: ClaimStatus
  verificationResult?: VerificationResult
  createdAt: Date
  updatedAt: Date
  crisisId?: string
}

type ClaimStatus = 'pending' | 'processing' | 'verified' | 'disputed' | 'unverified' | 'in-review'
```

### 4. Crisis Service

**Purpose:** Manages crisis situations and aggregates related claims.

**Interface:**
```typescript
interface CrisisService {
  createCrisis(crisisData: CreateCrisisDTO): Promise<Crisis>
  getCrisis(crisisId: string): Promise<Crisis>
  updateCrisis(crisisId: string, updates: UpdateCrisisDTO): Promise<Crisis>
  listCrises(filters: CrisisFilters): Promise<PaginatedResult<Crisis>>
  getCrisisStatistics(crisisId: string): Promise<CrisisStats>
  associateClaim(crisisId: string, claimId: string): Promise<void>
}

interface Crisis {
  id: string
  title: string
  description: string
  location: string
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'resolved' | 'monitoring'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface CrisisStats {
  totalClaims: number
  verifiedClaims: number
  disputedClaims: number
  pendingClaims: number
  averageConfidence: number
}
```

### 5. User Service

**Purpose:** Manages user profiles, roles, and permissions.

**Interface:**
```typescript
interface UserService {
  getUser(userId: string): Promise<User>
  updateUser(userId: string, updates: UpdateUserDTO): Promise<User>
  getUsersByRole(role: UserRole): Promise<User[]>
  updateSubscription(userId: string, tier: SubscriptionTier): Promise<User>
  checkFeatureAccess(userId: string, feature: Feature): Promise<boolean>
}

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  subscriptionTier: SubscriptionTier
  createdAt: Date
  profile?: UserProfile
}

type UserRole = 'user' | 'fact-checker' | 'admin'
type SubscriptionTier = 'free' | 'pro' | 'enterprise'

interface UserProfile {
  specialization?: string
  verificationsCount: number
  accuracyRate: number
}
```

### 6. Source Service

**Purpose:** Manages trusted sources and their credibility ratings.

**Interface:**
```typescript
interface SourceService {
  addSource(sourceData: CreateSourceDTO): Promise<Source>
  updateSourceCredibility(sourceId: string, credibility: number): Promise<Source>
  getSource(sourceId: string): Promise<Source>
  listSources(filters: SourceFilters): Promise<Source[]>
  markSourceInactive(sourceId: string): Promise<void>
}

interface CreateSourceDTO {
  title: string
  url: string
  type: SourceType
  credibility: number
  apiEndpoint?: string
}

type SourceType = 'scientific' | 'news' | 'government' | 'fact-check' | 'academic'
```

### 7. Analytics Service

**Purpose:** Generates platform analytics and reporting.

**Interface:**
```typescript
interface AnalyticsService {
  getPlatformStats(): Promise<PlatformStats>
  getVerificationAccuracy(timeRange: TimeRange): Promise<AccuracyMetrics>
  getUserEngagement(timeRange: TimeRange): Promise<EngagementMetrics>
  generateReport(reportType: ReportType, params: ReportParams): Promise<Report>
}

interface PlatformStats {
  totalUsers: number
  totalClaims: number
  totalVerifications: number
  averageAccuracy: number
  activeFactCheckers: number
}
```

### 8. WebSocket Service

**Purpose:** Provides real-time updates to connected clients.

**Interface:**
```typescript
interface WebSocketService {
  broadcastVerificationUpdate(claimId: string, update: VerificationUpdate): void
  broadcastCrisisUpdate(crisisId: string, update: CrisisUpdate): void
  sendToUser(userId: string, event: string, data: any): void
  subscribeToRoom(socketId: string, room: string): void
  unsubscribeFromRoom(socketId: string, room: string): void
}
```

## Data Models

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  verifications_count INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  bio TEXT,
  UNIQUE(user_id)
);

-- Claims Table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  category VARCHAR(100),
  crisis_id UUID REFERENCES crises(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verifications Table
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  confidence_score INTEGER NOT NULL,
  summary TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(claim_id)
);

-- Sources Table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  credibility INTEGER NOT NULL CHECK (credibility >= 0 AND credibility <= 100),
  is_active BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verification Sources (Junction Table)
CREATE TABLE verification_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID REFERENCES verifications(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  excerpt TEXT,
  relevance_score DECIMAL(5,2),
  UNIQUE(verification_id, source_id)
);

-- Crises Table
CREATE TABLE crises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crisis Tags Table
CREATE TABLE crisis_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crisis_id UUID REFERENCES crises(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL
);

-- Fact Checker Assignments Table
CREATE TABLE fact_checker_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  fact_checker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  review_notes TEXT
);

-- Flagged Content Table
CREATE TABLE flagged_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  flagged_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL,
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- API Keys Table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Usage Tracking Table
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_claims_user_id ON claims(user_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_crisis_id ON claims(crisis_id);
CREATE INDEX idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX idx_verifications_claim_id ON verifications(claim_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sources_type ON sources(type);
CREATE INDEX idx_sources_is_active ON sources(is_active);
CREATE INDEX idx_usage_tracking_user_id_created_at ON usage_tracking(user_id, created_at);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Authentication and Authorization Properties

Property 1: Valid registration creates encrypted account
*For any* valid user registration data (email, password, name), submitting the registration should result in a new user account being created in the database with the password encrypted (not stored in plaintext)
**Validates: Requirements 1.1**

Property 2: Valid credentials authenticate successfully
*For any* user account with valid credentials, attempting to log in with those credentials should result in successful authentication and session creation
**Validates: Requirements 1.2**

Property 3: Invalid credentials are rejected
*For any* invalid credential combination (wrong password, non-existent email), login attempts should be rejected and no session should be created
**Validates: Requirements 1.3**

Property 4: Authorization gates protected resources
*For any* protected resource and any authenticated user, access should only be granted if the user's role has permission for that resource
**Validates: Requirements 1.4**

Property 5: Password reset sends secure link
*For any* registered user email, requesting a password reset should result in a secure reset link being sent to that email address
**Validates: Requirements 1.5**

Property 6: Expired sessions require re-authentication
*For any* user session that has expired, attempting to access protected resources should require re-authentication before access is granted
**Validates: Requirements 1.6**

### Claim Management Properties

Property 7: Valid claims are stored with metadata
*For any* valid claim text (non-empty, within length limits), submitting the claim should result in it being stored in the database with timestamp and user association
**Validates: Requirements 2.1**

Property 8: Claim IDs are unique
*For any* set of claims created in the system, all claim IDs should be unique with no duplicates
**Validates: Requirements 2.2**

Property 9: Whitespace-only claims are rejected
*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), attempting to submit it as a claim should be rejected with an error message
**Validates: Requirements 2.3**

Property 10: User claim history is complete
*For any* user, retrieving their claim history should return exactly the set of claims they submitted, with no claims from other users
**Validates: Requirements 2.5**

### Verification Engine Properties

Property 11: Claims are analyzed for assertions
*For any* claim submitted for verification, the system should extract key assertions using NLP before querying sources
**Validates: Requirements 3.1**

Property 12: Multiple sources are queried
*For any* claim verification, the system should query at least two different trusted sources for information
**Validates: Requirements 3.2**

Property 13: Confidence scores reflect source credibility
*For any* verification result, the confidence score should be calculated based on the credibility ratings of the sources used and their consensus level
**Validates: Requirements 3.3**

Property 14: Verification reports are comprehensive
*For any* completed verification, the generated report should include status, confidence score, summary, and supporting evidence
**Validates: Requirements 3.4**

### Source Management Properties

Property 15: Sources are stored with credibility
*For any* source added by an administrator, the source should be stored in the database with its credibility rating (0-100)
**Validates: Requirements 4.1**

Property 16: Source credibility affects confidence scores
*For any* two verifications using different sources, the verification using higher-credibility sources should have a higher confidence score (all else being equal)
**Validates: Requirements 4.2, 4.5**

Property 17: Credibility updates apply to future verifications
*For any* source with updated credibility, verifications performed after the update should use the new credibility value
**Validates: Requirements 4.3**

Property 18: Inactive sources are excluded
*For any* source marked as inactive, it should not be included in verification queries
**Validates: Requirements 4.4**

### Crisis Management Properties

Property 19: Crisis data is stored completely
*For any* crisis created by an administrator, all provided information (title, location, description, priority) should be stored in the database
**Validates: Requirements 5.1**

Property 20: Claim-crisis associations are maintained
*For any* claim associated with a crisis, querying the crisis should return that claim in the associated claims list
**Validates: Requirements 5.2**

Property 21: Crisis views show all associated claims
*For any* crisis, viewing the crisis should display all claims associated with it along with their current verification statuses
**Validates: Requirements 5.3**

Property 22: Crisis statistics are accurate
*For any* crisis, the calculated statistics (total claims, verified count, disputed count) should match the actual counts of associated claims in each status
**Validates: Requirements 5.4**

### Fact-Checker Management Properties

Property 23: Fact-checker profiles are stored
*For any* fact-checker account created by an administrator, the profile including specialization and credentials should be stored in the database
**Validates: Requirements 6.1**

Property 24: Claim assignment updates status and notifies
*For any* claim assigned to a fact-checker, the claim status should be updated to "in-review" and the fact-checker should receive a notification
**Validates: Requirements 6.2**

Property 25: Reviews update verification status
*For any* fact-checker review submission, the review should be stored and the claim's verification status should be updated accordingly
**Validates: Requirements 6.3**

Property 26: Performance metrics are calculated correctly
*For any* fact-checker, their accuracy rate should equal (correct reviews / total reviews) and verification count should equal the number of reviews they've completed
**Validates: Requirements 6.4**

Property 27: Deactivated fact-checkers preserve history
*For any* deactivated fact-checker, they should not receive new claim assignments, but all their historical reviews should remain accessible
**Validates: Requirements 6.5**

### API Properties

Property 28: Valid API requests return JSON
*For any* valid API request with proper authentication, the response should be in valid JSON format
**Validates: Requirements 7.1**

Property 29: API returns current claim status
*For any* claim ID requested via API, the response should include the current verification status and confidence score
**Validates: Requirements 7.2**

Property 30: Rate limits are enforced
*For any* API client exceeding the rate limit, subsequent requests should be rejected with HTTP 429 status code
**Validates: Requirements 7.3**

Property 31: Invalid API credentials are rejected
*For any* API request with invalid authentication credentials, the request should be rejected with an authentication error
**Validates: Requirements 7.4**

Property 32: API requests are logged
*For any* API endpoint access, a log entry should be created with timestamp, user, endpoint, and result
**Validates: Requirements 7.5**

### Database Properties

Property 33: Referential integrity is enforced
*For any* attempt to create a record with an invalid foreign key reference, the database should reject the operation
**Validates: Requirements 8.1**

Property 34: Passwords are encrypted
*For any* user stored in the database, the password field should contain a hashed value, not the plaintext password
**Validates: Requirements 8.2**

Property 35: Transactions maintain ACID properties
*For any* database transaction that fails partway through, all changes should be rolled back leaving the database in a consistent state
**Validates: Requirements 8.4**

Property 36: Foreign key constraints exist
*For any* relationship between entities, foreign key constraints should be defined and enforced by the database
**Validates: Requirements 8.5**

### Real-Time Update Properties

Property 37: Verification updates are broadcast
*For any* completed verification, all connected dashboard clients should receive the update via WebSocket
**Validates: Requirements 9.1**

Property 38: Crisis statistics updates are broadcast
*For any* change to crisis statistics, all users subscribed to that crisis should receive the updated metrics
**Validates: Requirements 9.2**

Property 39: Dashboard connections are established
*For any* user opening the dashboard, a WebSocket connection should be established for real-time updates
**Validates: Requirements 9.3**

Property 40: Disconnections trigger reconnection
*For any* WebSocket connection that is interrupted, the client should automatically attempt to reconnect
**Validates: Requirements 9.4**

Property 41: Multi-client synchronization works
*For any* crisis viewed by multiple users, updates should be synchronized across all connected clients
**Validates: Requirements 9.5**

### Subscription and Business Model Properties

Property 42: Subscription activation works
*For any* user selecting a subscription tier and completing payment, the subscription should be activated and features should be accessible
**Validates: Requirements 10.1**

Property 43: Feature access is gated by tier
*For any* premium feature, users should only be able to access it if their subscription tier includes that feature
**Validates: Requirements 10.2**

Property 44: Expired subscriptions downgrade
*For any* subscription that expires, the user should be automatically downgraded to free tier and premium features should be restricted
**Validates: Requirements 10.3**

Property 45: Subscription changes are immediate
*For any* subscription status change (upgrade, downgrade, cancellation), the user's access permissions should be updated immediately
**Validates: Requirements 10.4**

Property 46: Usage limits are enforced
*For any* subscription tier with usage limits, the system should track usage and prevent actions that would exceed the limit
**Validates: Requirements 10.5**

### Analytics Properties

Property 47: Analytics reports are comprehensive
*For any* analytics request, the generated report should include verification counts, accuracy rates, and user engagement metrics
**Validates: Requirements 11.1**

Property 48: Accuracy is calculated from comparisons
*For any* verification accuracy calculation, the result should be based on comparing AI predictions against fact-checker reviews
**Validates: Requirements 11.2**

Property 49: Trends are aggregated correctly
*For any* time period specified for trend analysis, data should be aggregated only from that period
**Validates: Requirements 11.3**

Property 50: Performance metrics reflect reality
*For any* performance metric request, the reported values should be calculated from actual system measurements
**Validates: Requirements 11.4**

Property 51: Export formats are standard
*For any* analytics data export, the output should be in valid CSV or JSON format
**Validates: Requirements 11.5**

### Content Moderation Properties

Property 52: Flags are recorded
*For any* content flagging action, a record should be created with the flag reason and timestamp
**Validates: Requirements 12.1**

Property 53: Multiple flags trigger escalation
*For any* content receiving more than a threshold number of flags, it should be automatically escalated to administrator review
**Validates: Requirements 12.2**

Property 54: Moderation actions are available
*For any* flagged content under administrator review, the system should provide options to remove, approve, or warn
**Validates: Requirements 12.3**

Property 55: Removed content is soft-deleted
*For any* content removed by moderation, it should be hidden from public view but remain in the database for audit purposes
**Validates: Requirements 12.4**

Property 56: Moderation is logged
*For any* moderation action taken, an audit log entry should be created with the action, moderator, and timestamp
**Validates: Requirements 12.5**

### Multi-Language Properties

Property 57: UI displays in selected language
*For any* language selection, all interface text should be displayed in that language
**Validates: Requirements 13.1**

Property 58: Verification uses language-appropriate sources
*For any* claim submitted in a specific language, the verification should query sources relevant to that language
**Validates: Requirements 13.2**

Property 59: Results are localized
*For any* verification result, the summary and report should be presented in the user's selected language
**Validates: Requirements 13.3**

Property 60: Language preferences persist
*For any* user who sets a language preference, that preference should be maintained across logout and login
**Validates: Requirements 13.4**

### Email Notification Properties

Property 61: Verification completion sends email
*For any* completed verification, an email notification should be sent to the user who submitted the claim
**Validates: Requirements 14.1**

Property 62: Assignment sends email
*For any* claim assigned to a fact-checker, an email notification with claim details should be sent to that fact-checker
**Validates: Requirements 14.2**

Property 63: Critical alerts email admins
*For any* critical system alert, email notifications should be sent to all administrators
**Validates: Requirements 14.3**

Property 64: Opt-out preferences are respected
*For any* user who has opted out of non-critical emails, they should not receive those emails
**Validates: Requirements 14.4**

### Search and Filtering Properties

Property 65: Search returns matching results
*For any* search query, the returned results should include all claims and crises that match the search terms
**Validates: Requirements 15.1**

Property 66: Filters restrict results
*For any* filter applied, the displayed results should include only items that match the filter criteria
**Validates: Requirements 15.2**

Property 67: Results are ranked appropriately
*For any* search results, they should be ordered by relevance and recency with more relevant and recent items first
**Validates: Requirements 15.3**

Property 68: Multiple filters use AND logic
*For any* combination of multiple filters, results should match all filters (logical AND operation)
**Validates: Requirements 15.4**

Property 69: Special characters are sanitized
*For any* search query containing special characters or SQL injection attempts, the input should be sanitized before database queries
**Validates: Requirements 15.5**

## Error Handling

### Error Categories

1. **Validation Errors**: Invalid input data (empty claims, malformed emails, etc.)
   - Return 400 Bad Request with detailed error messages
   - Log validation failures for monitoring

2. **Authentication Errors**: Invalid credentials, expired tokens
   - Return 401 Unauthorized
   - Do not reveal whether email exists (security)

3. **Authorization Errors**: Insufficient permissions
   - Return 403 Forbidden
   - Log unauthorized access attempts

4. **Not Found Errors**: Requested resource doesn't exist
   - Return 404 Not Found
   - Provide helpful error messages

5. **Rate Limit Errors**: Too many requests
   - Return 429 Too Many Requests
   - Include Retry-After header

6. **External Service Errors**: AI API failures, email service down
   - Return 503 Service Unavailable
   - Implement retry logic with exponential backoff
   - Degrade gracefully (e.g., queue verification for later)

7. **Database Errors**: Connection failures, constraint violations
   - Return 500 Internal Server Error
   - Log detailed error for debugging
   - Never expose database details to client

8. **Business Logic Errors**: Subscription expired, usage limit exceeded
   - Return 402 Payment Required or 403 Forbidden
   - Provide clear upgrade path in error message

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
    timestamp: string
    requestId: string
  }
}
```

### Retry and Fallback Strategies

- **AI Verification**: If OpenAI API fails, queue for retry (3 attempts with exponential backoff)
- **Email Notifications**: Queue failed emails for retry (5 attempts over 24 hours)
- **External Sources**: If source unavailable, continue with available sources and note limitation
- **Database**: Implement connection pooling and automatic reconnection
- **WebSocket**: Client-side automatic reconnection with exponential backoff

## Testing Strategy

### Unit Testing

**Framework**: Jest + Supertest for API testing

**Coverage Areas**:
- Service layer functions (verification logic, confidence calculation)
- Utility functions (password hashing, token generation)
- Validation schemas
- Database repository methods
- API endpoint handlers

**Example Unit Tests**:
- Test password hashing produces different hashes for same password
- Test confidence score calculation with various source combinations
- Test JWT token generation and verification
- Test input validation for all DTOs

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run minimum 100 iterations

**Test Organization**: Each property-based test must include a comment tag referencing the design document property:
```typescript
// Feature: crisistruth-completion, Property 1: Valid registration creates encrypted account
```

**Coverage**: All 69 correctness properties defined above must have corresponding property-based tests

**Example Property Tests**:
```typescript
// Property 1: Valid registration creates encrypted account
test('valid registration creates encrypted account', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string({ minLength: 8 }),
        name: fc.string({ minLength: 1 })
      }),
      async (userData) => {
        const user = await authService.register(userData)
        const storedUser = await db.users.findById(user.id)
        
        // Password should be hashed, not plaintext
        expect(storedUser.password_hash).not.toBe(userData.password)
        expect(storedUser.password_hash).toMatch(/^\$2[aby]\$/)
      }
    ),
    { numRuns: 100 }
  )
})

// Property 8: Claim IDs are unique
test('claim IDs are unique', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.string({ minLength: 10 }), { minLength: 10, maxLength: 50 }),
      async (claimTexts) => {
        const claims = await Promise.all(
          claimTexts.map(text => claimService.submitClaim({ text, userId: testUserId }))
        )
        
        const ids = claims.map(c => c.id)
        const uniqueIds = new Set(ids)
        
        expect(uniqueIds.size).toBe(ids.length)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Integration Testing

**Framework**: Jest + Testcontainers (for PostgreSQL)

**Coverage Areas**:
- API endpoint flows (register → login → submit claim → verify)
- Database transactions and rollbacks
- WebSocket connection and message broadcasting
- External service integration (mocked)
- Authentication and authorization flows

### End-to-End Testing

**Framework**: Playwright

**Coverage Areas**:
- User registration and login flow
- Claim submission and verification viewing
- Dashboard real-time updates
- Admin panel operations
- Subscription upgrade flow

### Performance Testing

**Framework**: k6

**Scenarios**:
- Load test: 1000 concurrent users submitting claims
- Stress test: Gradually increase load until system degrades
- Spike test: Sudden traffic surge simulation
- Endurance test: Sustained load over 24 hours

**Metrics**:
- API response time (p95 < 500ms, p99 < 1000ms)
- Database query time (p95 < 100ms)
- WebSocket message latency (< 100ms)
- Throughput (> 100 verifications/second)

### Security Testing

**Areas**:
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting effectiveness
- Authentication bypass attempts
- Authorization escalation attempts
- Sensitive data exposure

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                     Load Balancer (AWS ALB)                  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Frontend (Vercel)      │  │   API Server (AWS ECS)   │
│   - Next.js SSR          │  │   - Auto-scaling         │
│   - CDN Distribution     │  │   - Health checks        │
└──────────────────────────┘  └──────────────────────────┘
                                        │
                ┌───────────────────────┼───────────────────────┐
                │                       │                       │
                ▼                       ▼                       ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  PostgreSQL (RDS)    │  │  Redis (ElastiCache) │  │  S3 (File Storage)   │
│  - Multi-AZ          │  │  - Cluster mode      │  │  - Backups           │
│  - Automated backups │  │  - Persistence       │  │  - Analytics exports │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### CI/CD Pipeline

1. **Code Push** → GitHub
2. **Automated Tests** → GitHub Actions
   - Unit tests
   - Integration tests
   - Property-based tests
   - Linting and type checking
3. **Build** → Docker images
4. **Deploy to Staging** → Automatic
5. **E2E Tests** → Playwright on staging
6. **Deploy to Production** → Manual approval
7. **Smoke Tests** → Verify production health

### Monitoring and Observability

**Metrics** (Prometheus + Grafana):
- API response times
- Error rates
- Database connection pool usage
- WebSocket connection count
- Verification processing time
- Queue depths

**Logging** (ELK Stack):
- Structured JSON logs
- Request/response logging
- Error stack traces
- Audit logs for sensitive operations

**Alerting** (PagerDuty):
- Error rate > 1%
- API response time p95 > 1s
- Database connection failures
- External service failures
- Disk space > 80%

**Tracing** (Jaeger):
- Distributed tracing for verification flow
- Database query tracing
- External API call tracing

## Business Model Implementation

### Subscription Tiers

**Free Tier**:
- 10 claim verifications per month
- Basic verification reports
- Community support
- Standard processing speed

**Pro Tier** ($29/month):
- 500 claim verifications per month
- Detailed verification reports with source analysis
- Priority processing (2x faster)
- Email support
- API access (1000 requests/day)
- Export analytics data

**Enterprise Tier** ($299/month):
- Unlimited claim verifications
- Advanced analytics and reporting
- Dedicated fact-checker assignment
- Custom source integration
- Priority support (SLA)
- API access (unlimited)
- White-label options
- Custom training for AI model

### Feature Gates

```typescript
const FEATURE_GATES = {
  free: {
    monthlyVerifications: 10,
    apiAccess: false,
    priorityProcessing: false,
    detailedReports: false,
    exportData: false,
    dedicatedFactChecker: false
  },
  pro: {
    monthlyVerifications: 500,
    apiAccess: true,
    apiRateLimit: 1000,
    priorityProcessing: true,
    detailedReports: true,
    exportData: true,
    dedicatedFactChecker: false
  },
  enterprise: {
    monthlyVerifications: Infinity,
    apiAccess: true,
    apiRateLimit: Infinity,
    priorityProcessing: true,
    detailedReports: true,
    exportData: true,
    dedicatedFactChecker: true,
    customSources: true,
    whiteLabel: true
  }
}
```

### Revenue Projections

**Year 1 Targets**:
- 10,000 free users
- 500 pro subscribers ($14,500/month)
- 20 enterprise subscribers ($5,980/month)
- **Total MRR**: $20,480
- **Annual Revenue**: $245,760

**Growth Strategy**:
- Content marketing (fact-checking guides, crisis response playbooks)
- Partnership with news organizations
- Academic institution outreach
- API marketplace listing
- Freemium conversion optimization (target 5% free → pro)

### Payment Integration

**Provider**: Stripe

**Implementation**:
- Stripe Checkout for subscription signup
- Stripe Customer Portal for subscription management
- Webhook handling for subscription events
- Automatic invoice generation
- Failed payment retry logic
- Dunning management for expired cards

## Security Considerations

### Authentication Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with short expiry (15 minutes)
- Refresh tokens stored in httpOnly cookies
- Rate limiting on login attempts
- Account lockout after 5 failed attempts
- Password strength requirements (min 8 chars, uppercase, lowercase, number)

### API Security

- API keys hashed in database
- Rate limiting per API key
- Request signing for sensitive operations
- CORS configuration for allowed origins
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)

### Data Security

- Encryption at rest (database encryption)
- Encryption in transit (TLS 1.3)
- PII data encrypted in database
- Secure session storage in Redis
- Regular security audits
- Dependency vulnerability scanning
- GDPR compliance (data export, deletion)

### Infrastructure Security

- VPC with private subnets for database
- Security groups restricting access
- WAF rules for common attacks
- DDoS protection (AWS Shield)
- Regular backups with encryption
- Disaster recovery plan
- Incident response procedures

## Scalability Considerations

### Horizontal Scaling

- Stateless API servers (can scale to N instances)
- Load balancer distributes traffic
- WebSocket connections distributed via Redis pub/sub
- Database read replicas for query scaling

### Caching Strategy

- Redis cache for:
  - User sessions
  - Frequently accessed claims
  - Verification results (24-hour TTL)
  - Source credibility ratings
  - Crisis statistics
- CDN caching for static assets
- Browser caching headers

### Database Optimization

- Indexes on frequently queried fields
- Partitioning for large tables (claims by date)
- Connection pooling
- Query optimization
- Materialized views for analytics

### Async Processing

- Message queue (AWS SQS) for:
  - Verification processing
  - Email notifications
  - Analytics calculations
- Worker processes for background jobs
- Retry logic with exponential backoff

### Performance Targets

- API response time: p95 < 500ms, p99 < 1000ms
- Database query time: p95 < 100ms
- Verification processing: < 5 seconds for 90% of claims
- WebSocket latency: < 100ms
- Support 10,000 concurrent users
- Handle 100 verifications/second
