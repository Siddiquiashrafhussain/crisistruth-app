# Implementation Plan

- [ ] 1. Set up backend project structure and core infrastructure
  - Initialize Node.js/TypeScript project with Express
  - Configure Prisma ORM with PostgreSQL
  - Set up Redis connection for caching and sessions
  - Configure environment variables and secrets management
  - Set up ESLint, Prettier, and TypeScript strict mode
  - Create Docker Compose for local development (PostgreSQL + Redis)
  - _Requirements: 8.1, 8.2, 8.4, 8.5_

- [ ] 1.1 Write property test for database referential integrity
  - **Property 33: Referential integrity is enforced**
  - **Validates: Requirements 8.1**

- [ ] 1.2 Write property test for foreign key constraints
  - **Property 36: Foreign key constraints exist**
  - **Validates: Requirements 8.5**

- [ ] 2. Implement database schema and migrations
  - Create Prisma schema with all tables (users, claims, verifications, sources, crises, etc.)
  - Define relationships and foreign keys
  - Create indexes for performance optimization
  - Generate and run initial migration
  - Seed database with initial data (source types, admin user)
  - _Requirements: 8.1, 8.2, 8.5_

- [ ] 2.1 Write property test for transaction ACID properties
  - **Property 35: Transactions maintain ACID properties**
  - **Validates: Requirements 8.4**

- [ ] 3. Implement authentication service
  - Create user registration endpoint with password hashing (bcrypt)
  - Implement login endpoint with JWT token generation
  - Create token verification middleware
  - Implement refresh token mechanism
  - Add password reset functionality with email tokens
  - Implement session management with Redis
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

- [ ] 3.1 Write property test for valid registration
  - **Property 1: Valid registration creates encrypted account**
  - **Validates: Requirements 1.1**

- [ ] 3.2 Write property test for password encryption
  - **Property 34: Passwords are encrypted**
  - **Validates: Requirements 8.2**

- [ ] 3.3 Write property test for valid authentication
  - **Property 2: Valid credentials authenticate successfully**
  - **Validates: Requirements 1.2**

- [ ] 3.4 Write property test for invalid credentials rejection
  - **Property 3: Invalid credentials are rejected**
  - **Validates: Requirements 1.3**

- [ ] 3.5 Write property test for password reset
  - **Property 5: Password reset sends secure link**
  - **Validates: Requirements 1.5**

- [ ] 3.6 Write property test for session expiry
  - **Property 6: Expired sessions require re-authentication**
  - **Validates: Requirements 1.6**

- [ ] 4. Implement authorization middleware
  - Create role-based access control (RBAC) middleware
  - Implement permission checking for protected routes
  - Add subscription tier verification
  - Create feature gate checking utility
  - _Requirements: 1.4, 10.2_

- [ ] 4.1 Write property test for authorization gates
  - **Property 4: Authorization gates protected resources**
  - **Validates: Requirements 1.4**

- [ ] 4.2 Write property test for feature access gating
  - **Property 43: Feature access is gated by tier**
  - **Validates: Requirements 10.2**

- [ ] 5. Implement claim service and API endpoints
  - Create POST /api/claims endpoint for claim submission
  - Implement claim validation (non-empty, length limits)
  - Create GET /api/claims/:id endpoint
  - Create GET /api/users/:userId/claims endpoint with pagination
  - Implement claim search and filtering
  - Add claim-crisis association endpoint
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 15.1, 15.2_

- [ ] 5.1 Write property test for valid claim storage
  - **Property 7: Valid claims are stored with metadata**
  - **Validates: Requirements 2.1**

- [ ] 5.2 Write property test for claim ID uniqueness
  - **Property 8: Claim IDs are unique**
  - **Validates: Requirements 2.2**

- [ ] 5.3 Write property test for whitespace rejection
  - **Property 9: Whitespace-only claims are rejected**
  - **Validates: Requirements 2.3**

- [ ] 5.4 Write property test for user claim history
  - **Property 10: User claim history is complete**
  - **Validates: Requirements 2.5**

- [ ] 5.5 Write property test for search functionality
  - **Property 65: Search returns matching results**
  - **Validates: Requirements 15.1**

- [ ] 5.6 Write property test for filtering
  - **Property 66: Filters restrict results**
  - **Validates: Requirements 15.2**

- [ ] 5.7 Write property test for search input sanitization
  - **Property 69: Special characters are sanitized**
  - **Validates: Requirements 15.5**

- [ ] 6. Implement AI verification service
  - Integrate OpenAI API for claim analysis
  - Create NLP assertion extraction logic
  - Implement external source querying (mock sources initially)
  - Create confidence score calculation algorithm
  - Implement verification report generation
  - Add error handling for external service failures
  - Implement async processing with progress tracking
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 6.1 Write property test for assertion extraction
  - **Property 11: Claims are analyzed for assertions**
  - **Validates: Requirements 3.1**

- [ ] 6.2 Write property test for multiple source queries
  - **Property 12: Multiple sources are queried**
  - **Validates: Requirements 3.2**

- [ ] 6.3 Write property test for confidence score calculation
  - **Property 13: Confidence scores reflect source credibility**
  - **Validates: Requirements 3.3**

- [ ] 6.4 Write property test for comprehensive reports
  - **Property 14: Verification reports are comprehensive**
  - **Validates: Requirements 3.4**

- [ ] 7. Implement source management service
  - Create POST /api/admin/sources endpoint
  - Implement source credibility rating storage
  - Create PUT /api/admin/sources/:id/credibility endpoint
  - Implement source activation/deactivation
  - Create source listing with filters
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7.1 Write property test for source storage
  - **Property 15: Sources are stored with credibility**
  - **Validates: Requirements 4.1**

- [ ] 7.2 Write property test for credibility impact on scores
  - **Property 16: Source credibility affects confidence scores**
  - **Validates: Requirements 4.2, 4.5**

- [ ] 7.3 Write property test for credibility updates
  - **Property 17: Credibility updates apply to future verifications**
  - **Validates: Requirements 4.3**

- [ ] 7.4 Write property test for inactive source exclusion
  - **Property 18: Inactive sources are excluded**
  - **Validates: Requirements 4.4**

- [ ] 8. Implement crisis management service
  - Create POST /api/admin/crises endpoint
  - Implement crisis data storage with all fields
  - Create GET /api/crises/:id endpoint with associated claims
  - Implement crisis statistics calculation
  - Create PUT /api/admin/crises/:id endpoint
  - Add crisis listing with filters and search
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8.1 Write property test for crisis storage
  - **Property 19: Crisis data is stored completely**
  - **Validates: Requirements 5.1**

- [ ] 8.2 Write property test for claim-crisis associations
  - **Property 20: Claim-crisis associations are maintained**
  - **Validates: Requirements 5.2**

- [ ] 8.3 Write property test for crisis claim display
  - **Property 21: Crisis views show all associated claims**
  - **Validates: Requirements 5.3**

- [ ] 8.4 Write property test for crisis statistics accuracy
  - **Property 22: Crisis statistics are accurate**
  - **Validates: Requirements 5.4**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement fact-checker management service
  - Create POST /api/admin/fact-checkers endpoint
  - Implement fact-checker profile storage
  - Create POST /api/admin/claims/:id/assign endpoint
  - Implement claim assignment notification
  - Create POST /api/fact-checkers/reviews endpoint
  - Implement performance metrics calculation
  - Add fact-checker deactivation with history preservation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10.1 Write property test for fact-checker profile storage
  - **Property 23: Fact-checker profiles are stored**
  - **Validates: Requirements 6.1**

- [ ] 10.2 Write property test for claim assignment
  - **Property 24: Claim assignment updates status and notifies**
  - **Validates: Requirements 6.2**

- [ ] 10.3 Write property test for review submission
  - **Property 25: Reviews update verification status**
  - **Validates: Requirements 6.3**

- [ ] 10.4 Write property test for performance metrics
  - **Property 26: Performance metrics are calculated correctly**
  - **Validates: Requirements 6.4**

- [ ] 10.5 Write property test for deactivation
  - **Property 27: Deactivated fact-checkers preserve history**
  - **Validates: Requirements 6.5**

- [ ] 11. Implement RESTful API with rate limiting
  - Create API key generation and management
  - Implement rate limiting middleware (Redis-based)
  - Add API request logging
  - Create API documentation with OpenAPI/Swagger
  - Implement API versioning (v1)
  - Add CORS configuration
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11.1 Write property test for API JSON responses
  - **Property 28: Valid API requests return JSON**
  - **Validates: Requirements 7.1**

- [ ] 11.2 Write property test for API claim status
  - **Property 29: API returns current claim status**
  - **Validates: Requirements 7.2**

- [ ] 11.3 Write property test for rate limiting
  - **Property 30: Rate limits are enforced**
  - **Validates: Requirements 7.3**

- [ ] 11.4 Write property test for API authentication
  - **Property 31: Invalid API credentials are rejected**
  - **Validates: Requirements 7.4**

- [ ] 11.5 Write property test for API logging
  - **Property 32: API requests are logged**
  - **Validates: Requirements 7.5**

- [ ] 12. Implement WebSocket server for real-time updates
  - Set up Socket.io server
  - Implement WebSocket authentication
  - Create room-based broadcasting (crisis rooms, user rooms)
  - Implement verification update broadcasting
  - Add crisis statistics update broadcasting
  - Implement connection management and reconnection logic
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 12.1 Write property test for verification broadcasts
  - **Property 37: Verification updates are broadcast**
  - **Validates: Requirements 9.1**

- [ ] 12.2 Write property test for statistics broadcasts
  - **Property 38: Crisis statistics updates are broadcast**
  - **Validates: Requirements 9.2**

- [ ] 12.3 Write property test for connection establishment
  - **Property 39: Dashboard connections are established**
  - **Validates: Requirements 9.3**

- [ ] 12.4 Write property test for reconnection
  - **Property 40: Disconnections trigger reconnection**
  - **Validates: Requirements 9.4**

- [ ] 12.5 Write property test for multi-client sync
  - **Property 41: Multi-client synchronization works**
  - **Validates: Requirements 9.5**

- [ ] 13. Implement subscription and payment system
  - Integrate Stripe API
  - Create subscription tier management
  - Implement Stripe webhook handlers
  - Add subscription activation logic
  - Implement feature gate checking
  - Create subscription expiry handling
  - Add usage tracking per tier
  - Implement subscription upgrade/downgrade flows
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 13.1 Write property test for subscription activation
  - **Property 42: Subscription activation works**
  - **Validates: Requirements 10.1**

- [ ] 13.2 Write property test for subscription expiry
  - **Property 44: Expired subscriptions downgrade**
  - **Validates: Requirements 10.3**

- [ ] 13.3 Write property test for immediate permission updates
  - **Property 45: Subscription changes are immediate**
  - **Validates: Requirements 10.4**

- [ ] 13.4 Write property test for usage limit enforcement
  - **Property 46: Usage limits are enforced**
  - **Validates: Requirements 10.5**

- [ ] 14. Implement analytics and reporting service
  - Create analytics data aggregation queries
  - Implement platform statistics calculation
  - Create verification accuracy calculation
  - Implement user engagement metrics
  - Add time-based trend analysis
  - Create report generation (CSV, JSON export)
  - Add performance metrics tracking
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 14.1 Write property test for comprehensive analytics
  - **Property 47: Analytics reports are comprehensive**
  - **Validates: Requirements 11.1**

- [ ] 14.2 Write property test for accuracy calculation
  - **Property 48: Accuracy is calculated from comparisons**
  - **Validates: Requirements 11.2**

- [ ] 14.3 Write property test for trend aggregation
  - **Property 49: Trends are aggregated correctly**
  - **Validates: Requirements 11.3**

- [ ] 14.4 Write property test for performance metrics
  - **Property 50: Performance metrics reflect reality**
  - **Validates: Requirements 11.4**

- [ ] 14.5 Write property test for export formats
  - **Property 51: Export formats are standard**
  - **Validates: Requirements 11.5**

- [ ] 15. Implement content moderation system
  - Create POST /api/claims/:id/flag endpoint
  - Implement flag recording with reason and timestamp
  - Add automatic escalation logic for multiple flags
  - Create admin moderation endpoints (approve, remove, warn)
  - Implement soft deletion for removed content
  - Add moderation action audit logging
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 15.1 Write property test for flag recording
  - **Property 52: Flags are recorded**
  - **Validates: Requirements 12.1**

- [ ] 15.2 Write property test for escalation
  - **Property 53: Multiple flags trigger escalation**
  - **Validates: Requirements 12.2**

- [ ] 15.3 Write property test for moderation actions
  - **Property 54: Moderation actions are available**
  - **Validates: Requirements 12.3**

- [ ] 15.4 Write property test for soft deletion
  - **Property 55: Removed content is soft-deleted**
  - **Validates: Requirements 12.4**

- [ ] 15.5 Write property test for moderation logging
  - **Property 56: Moderation is logged**
  - **Validates: Requirements 12.5**

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Implement email notification system
  - Integrate SendGrid API
  - Create email templates (verification complete, assignment, alerts)
  - Implement verification completion email
  - Add fact-checker assignment email
  - Create critical alert email for admins
  - Implement notification preference management
  - Add email queue with retry logic
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 17.1 Write property test for verification emails
  - **Property 61: Verification completion sends email**
  - **Validates: Requirements 14.1**

- [ ] 17.2 Write property test for assignment emails
  - **Property 62: Assignment sends email**
  - **Validates: Requirements 14.2**

- [ ] 17.3 Write property test for alert emails
  - **Property 63: Critical alerts email admins**
  - **Validates: Requirements 14.3**

- [ ] 17.4 Write property test for opt-out preferences
  - **Property 64: Opt-out preferences are respected**
  - **Validates: Requirements 14.4**

- [ ] 18. Implement multi-language support backend
  - Create language preference storage
  - Implement language detection for claims
  - Add language-specific source routing
  - Create result localization logic
  - Implement language preference persistence
  - Add translation loading system
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 18.1 Write property test for UI language display
  - **Property 57: UI displays in selected language**
  - **Validates: Requirements 13.1**

- [ ] 18.2 Write property test for language-appropriate sources
  - **Property 58: Verification uses language-appropriate sources**
  - **Validates: Requirements 13.2**

- [ ] 18.3 Write property test for result localization
  - **Property 59: Results are localized**
  - **Validates: Requirements 13.3**

- [ ] 18.4 Write property test for preference persistence
  - **Property 60: Language preferences persist**
  - **Validates: Requirements 13.4**

- [ ] 19. Implement advanced search and filtering
  - Create full-text search using PostgreSQL
  - Implement filter combination logic (AND operations)
  - Add result ranking by relevance and recency
  - Implement input sanitization for security
  - Add search result pagination
  - Create search analytics tracking
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 19.1 Write property test for result ranking
  - **Property 67: Results are ranked appropriately**
  - **Validates: Requirements 15.3**

- [ ] 19.2 Write property test for filter combination
  - **Property 68: Multiple filters use AND logic**
  - **Validates: Requirements 15.4**

- [ ] 20. Connect frontend to backend API
  - Create API client service in frontend
  - Implement authentication flow (login, register, logout)
  - Connect claim submission to backend
  - Integrate verification results display
  - Connect dashboard to real-time WebSocket
  - Implement admin panel API integration
  - Add error handling and loading states
  - _Requirements: All frontend-backend integration_

- [ ] 21. Implement WebSocket client in frontend
  - Set up Socket.io client
  - Implement authentication for WebSocket
  - Add automatic reconnection logic
  - Create event listeners for verification updates
  - Implement crisis statistics update handling
  - Add connection status indicators
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 22. Implement subscription UI and payment flow
  - Create subscription tier selection page
  - Integrate Stripe Checkout
  - Implement subscription management page
  - Add usage tracking display
  - Create upgrade/downgrade flows
  - Implement feature gate UI (upgrade prompts)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 23. Implement admin panel functionality
  - Connect fact-checker management to API
  - Implement crisis creation and management
  - Add source management interface
  - Create content moderation interface
  - Implement analytics dashboard
  - Add system settings management
  - _Requirements: 4.1, 5.1, 6.1, 12.3, 11.1_

- [ ] 24. Implement user profile and settings
  - Create user profile page
  - Add email notification preferences
  - Implement language selection
  - Add password change functionality
  - Create claim history view
  - Implement account deletion (GDPR)
  - _Requirements: 13.1, 14.4_

- [ ] 25. Add error handling and validation throughout
  - Implement global error boundary in frontend
  - Add form validation with Zod schemas
  - Create user-friendly error messages
  - Implement retry logic for failed requests
  - Add loading states for async operations
  - Create toast notifications for user feedback
  - _Requirements: All error handling requirements_

- [ ] 26. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 27. Implement security measures
  - Add CSRF protection
  - Implement XSS prevention
  - Add SQL injection prevention (verify parameterized queries)
  - Implement rate limiting on all endpoints
  - Add security headers (helmet.js)
  - Create security audit logging
  - Implement account lockout after failed attempts
  - _Requirements: Security considerations from design_

- [ ] 28. Set up monitoring and logging
  - Implement structured logging (Winston)
  - Add request/response logging
  - Create error tracking (Sentry integration)
  - Implement performance monitoring
  - Add health check endpoints
  - Create metrics collection (Prometheus format)
  - _Requirements: Observability from design_

- [ ] 29. Optimize performance
  - Implement Redis caching for frequent queries
  - Add database query optimization
  - Create CDN configuration for static assets
  - Implement lazy loading for frontend components
  - Add image optimization
  - Create database connection pooling
  - Implement pagination for all list endpoints
  - _Requirements: Performance targets from design_

- [ ] 30. Create deployment configuration
  - Create Dockerfile for backend
  - Set up Docker Compose for full stack
  - Create Kubernetes manifests (optional)
  - Configure environment variables for production
  - Set up database migration scripts
  - Create backup and restore procedures
  - Document deployment process
  - _Requirements: Deployment architecture from design_

- [ ] 30.1 Write integration tests for critical user flows
  - Test registration → login → claim submission → verification
  - Test admin crisis creation → claim association → statistics
  - Test subscription upgrade → feature access → usage tracking
  - Test fact-checker assignment → review → metrics update

- [ ] 30.2 Write end-to-end tests with Playwright
  - Test complete user journey from homepage to verification result
  - Test admin panel operations
  - Test real-time dashboard updates
  - Test subscription payment flow

- [ ] 31. Create documentation
  - Write API documentation (OpenAPI/Swagger)
  - Create user guide
  - Write admin manual
  - Document deployment procedures
  - Create developer setup guide
  - Write architecture documentation
  - _Requirements: Documentation for all features_

- [ ] 32. Final testing and quality assurance
  - Run full test suite (unit, integration, property-based)
  - Perform security audit
  - Test all user flows manually
  - Verify all requirements are met
  - Check accessibility compliance
  - Test on multiple browsers and devices
  - Perform load testing
  - _Requirements: All requirements validation_

- [ ] 33. Final Checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.
