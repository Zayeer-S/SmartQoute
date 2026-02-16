# User Stories - Ticket & Quote Management System
## Sprint 1 - Must Have Requirements

---

### Goal 1: Ticket Submission System

#### M-001: Structured Ticket Submission Form
**User Story:**
```
As a customer
I want to submit a support ticket through a structured form with all necessary details
So that the support team has complete information to generate an accurate quote
```

**Acceptance Criteria:**
- [ ] Form contains dropdown for Ticket Type (Support/Incident/Enhancement)
- [ ] Form contains text input for Title with minimum 5 characters validation
- [ ] Form contains rich text area for Description with minimum 50 characters requirement
- [ ] Form contains dropdown for Severity (Low/Medium/High/Critical)
- [ ] Form contains dropdown for Business Impact (Minor/Moderate/Major/Critical)
- [ ] Form contains date picker for Deadline with future date validation (must be at least 24 hours in future)
- [ ] Form contains numeric input for Users Affected with minimum value of 1
- [ ] Form contains file upload component supporting .jpg, .png, .pdf, .log formats with 10MB max size
- [ ] All fields display appropriate labels and placeholder text
- [ ] Required fields are clearly marked with asterisk (*)

---

#### M-002: Form Validation
**User Story:**
```
As a customer
I want immediate feedback when I fill out the ticket form incorrectly
So that I can correct errors before submission and avoid delays
```

**Acceptance Criteria:**
- [ ] Client-side validation displays error messages in real-time (within 200ms)
- [ ] Client-side validation displays error messages in real-time (within 200ms)
- [ ] Title field shows error if less than 5 characters or exceeds 200 characters
- [ ] Description field shows error if less than 50 characters
- [ ] Numeric fields reject non-numeric input
- [ ] Date picker prevents selection of past dates
- [ ] File upload validates file type before accepting
- [ ] File upload validates file size (max 10MB) before accepting
- [ ] Server-side validation re-checks all fields before database commit
- [ ] Server returns appropriate 400 error codes with specific field errors
- [ ] All validation messages are user-friendly (no technical jarrgon)

---

#### M-003: Submission Confirmation
**User Story:**
```
As a customer
I want to receive immediate confirmation with a unique reference number when I submit a ticket
So that I can track my ticket and reference it in future communications
```

**Acceptance Criteria:**
- [ ] System generates unique alphanumeric ticket reference (format: TKT-YYYYMMDD-XXXX)
- [ ] Success page displays immediately after valid submission
- [ ] Success page shows ticket reference number prominently
- [ ] Success page includes submission timestamp
- [ ] Success page provides link to view ticket details
- [ ] Success page provides link to submit another ticket
- [ ] Confirmation includes summary of submitted ticket details
- [ ] Reference number is copyable with one-click copy button

---

### Goal 2: Quote Generation Engine

#### M-004: Automated Quote Calculation - Base Logic
**User Story:**
```
As an admin
I want the system to automatically calculate quote estimates based on ticket details
So that customers receive consistent, fair pricing without manual calculation delays
```

**Acceptance Criteria:**
- [ ] System applies base time estimation based on ticket type:
  - Support: 2 hours base
  - Incident: 4 hours base
  - Enhancement: 8 hours base
- [ ] System applies severity multiplier:
  - Low: 1.0x
  - Medium: 1.5x
  - High: 2.0x
  - Critical: 3.0x
- [ ] System applies business impact multiplier:
  - Minor: 1.0x
  - Moderate: 1.2x
  - Major: 1.5x
  - Critical: 2.0x
- [ ] System applies users affected factor: +0.5 hours per 10 users affected
- [ ] System applies deadline urgency factor:
  - >7 days: 1.0x
  - 3-7 days: 1.3x
  - 1-3 days: 1.6x
  - <24 hours: 2.0x
- [ ] Formula: `Total Hours = (Base Hours × Severity × Impact) + (Users Affected / 10 × 0.5) × Urgency`

---

#### M-005: Cost Calculation
**User Story:**
```
As a business owner
I want the system to calculate total cost based on estimated hours and hourly rate
So that we provide transparent pricing to customers
```

**Acceptance Criteria:**
- [ ] System retrieves hourly rate from configuration (default: £75/hour)
- [ ] System calculates: `Total Cost = Total Hours × Hourly Rate`
- [ ] Cost is rounded to 2 decimal places
- [ ] Cost is displayed in GBP (£) currency format
- [ ] Calculation includes breakdown showing: hours, rate, subtotal
- [ ] Admin can override hourly rate per quote if needed
- [ ] System logs original vs. adjusted rates for audit purposes
- [ ] Form contains rich text area for Description with minimum 50 characters requirement

---

#### M-006: Priority Level Assignment
**User Story:**
```
As an admin
I want tickets automatically assigned priority levels based on severity and business impact
So that I can quickly identify which tickets need immediate attention
```

**Acceptance Criteria:**
- [ ] System assigns priority using matrix:
  - P1-Critical: Severity=Critical OR Business Impact=Critical
  - P2-High: Severity=High OR Business Impact=Major
  - P3-Medium: Severity=Medium OR Business Impact=Moderate
  - P4-Low: All others
- [ ] Priority badge displays prominently on ticket card
- [ ] Priority uses color coding:
  - P1: Red (#DC2626)
  - P2: Orange (#EA580C)
  - P3: Yellow (#CA8A04)
  - P4: Green (#16A34A)
- [ ] Admin dashboard allows filtering by priority
- [ ] Priority is recalculated if admin adjusts severity/impact

---

#### M-007: Effort Level Categorization
**User Story:**
```
As a customer
I want to see at a glance whether my ticket requires low, medium, or high effort
So that I understand the complexity of the work involved
```

**Acceptance Criteria:**
- [ ] System categorizes effort based on total estimated hours:
  - Low: <8 hours
  - Medium: 8-24 hours
  - High: >24 hours
- [ ] Effort level displays on quote summary
- [ ] Effort level uses visual indicator (icon or badge)
- [ ] Effort level is included in quote breakdown

---

#### M-008: Quote Generation Performance
**User Story:**
```
As a customer
I want my quote generated immediately after ticket submission
So that I can make quick decisions about proceeding with the work
```

**Acceptance Criteria:**
- [ ] Quote calculation completes within 3 seconds of ticket submission
- [ ] System displays loading indicator during calculation
- [ ] If calculation takes >3 seconds, user receives notification with ticket reference
- [ ] Quote is automatically associated with ticket in database
- [ ] Quote timestamp is recorded for SLA tracking
- [ ] System handles concurrent quote generation (10+ simultaneous submissions)

---

### Goal 3: Database & Data Persistence

#### M-009: Relational Database Design
**User Story:**
```
As a developer
I want a normalized normalized, well-structured database schema
So that data is efficiently stored, easily queryable, and maintains integrity
```

**Acceptance Criteria:**
- [ ] Database follows 3rd Normal Form (3NF)
- [ ] Schema includes tables: users, tickets, quotes, attachments, audit_logs
- [ ] Primary keys are defined for all tables
- [ ] Foreign keys establish relationships between tables
- [ ] Indexes are created on frequently queried columns (user_id, ticket_id, status, created_at)
- [ ] Column data types are appropriate for data being stored
- [ ] not null constraints on required fields
- [ ] DEFAULT values for status fields
- [ ] Schema documentation generated (ERD diagram)

---

#### M-010: Data Persistence with Timestamps
**User Story:**
```
As an admin
I want all ticket and quote data automatically timestamped
So that I can track when actions occurred and maintain audit trails
```

**Acceptance Criteria:**
- [ ] All tables include `created_at` timestamp (default: CURRENT_TIMESTAMP)
- [ ] All tables include `updated_at` timestamp (auto-update on modification)
- [ ] Timestamps stored in UTC timezone
- [ ] Soft delete implemented using `deleted_at` column (not hard deletes)
- [ ] Status change history captured in audit_logs table
- [ ] Timestamps displayed in user's local timezone in UI

---

#### M-011: Database Migrations & Version Control
**User Story:**
```
As a developer
I want database schema changes tracked and versioned
So that deployments are consistent and rollbacks are possible
```

**Acceptance Criteria:**
- [ ] Migration framework implemented (e.g., Knex, Sequelize, TypeORM)
- [ ] Initial schema migration created
- [ ] Migrations are sequential and numbered (001_initial_schema.sql)
- [ ] Each migration includes up() and down() functions
- [ ] Migration status tracked in database (schema_migrations table)
- [ ] Migration files stored in version control (Git)
- [ ] Rollback tested for each migration
- [ ] Seed data migrations created for development environment

---

#### M-012: Data Integrity Constraints
**User Story:**
```
As a developer
I want database constraints to enforce data integrity
So that invalid data cannot be stored and relationships are maintained
```

**Acceptance Criteria:**
- [ ] Foreign key constraints prevent orphaned records
- [ ] CHECK constraints validate enum values (status, severity, etc.)
- [ ] UNIQUE constraints on email addresses and ticket references
- [ ] CASCADE rules defined for related record deletion
- [ ] Length constraints match application validation
- [ ] Constraint violations return meaningful error messages
- [ ] Database-level validation complements application-level validation

---

### Goal 4: Admin Dashboard

#### M-013: Admin Authentication & RBAC
**User Story:**
```
As an admin
I want secure authentication with role-based access control
So that only authorized personnel can access admin functions
```

**Acceptance Criteria:**
- [ ] Admin login page with email/password fields
- [ ] Password must meet requirements (8+ chars, 1 uppercase, 1 number, 1 special char)
- [ ] Failed login attempts logged (max 5 attempts before 15-min lockout)
- [ ] Successful login creates session token (24-hour expiry)
- [ ] Role field in users table (admin, customer)
- [ ] Middleware checks role before allowing access to admin routes
- [ ] Admin routes return 403 Forbidden for non-admin users
- [ ] Session automatically expires after 30 minutes of inactivity
- [ ] "Remember me" option extends session to 30 days
- [ ] Logout button clears session and redirects to login

---

#### M-014: Ticket Queue View with Filtering
**User Story:**
```
As an admin
I want to view all tickets in a filterable queue
So that I can quickly find and prioritize work
```

**Acceptance Criteria:**
- [ ] Default view shows all tickets in table/card layout
- [ ] Table displays: reference, title, customer, status, severity, priority, created date
- [ ] Filter by status (Pending Quote/Quote Sent/Approved/Rejected/In Progress/Resolved)
- [ ] Filter by severity (Low/Medium/High/Critical)
- [ ] Filter by ticket type (Support/Incident/Enhancement)
- [ ] Filter by date range (created_at: from/to date pickers)
- [ ] Filters can be combined (AND logic)
- [ ] "Clear filters" button resets all filters
- [ ] Filtered results update without page reload
- [ ] Results show count (e.g., "Showing 15 of 247 tickets")
- [ ] Pagination implemented (20 tickets per page)
- [ ] Sort by column (created_at, severity, priority) ascending/descending

---

#### M-015: Quote Review & Manual Adjustment
**User Story:**
```
As an admin
I want to review auto-generated quotes and adjust them if necessary
So that quotes accurately reflect actual work required
```

**Acceptance Criteria:**
- [ ] Quote detail view shows auto-calculated breakdown
- [ ] Breakdown displays: base hours, multipliers applied, total hours, hourly rate, total cost
- [ ] "Edit Quote" button opens adjustment modal
- [ ] Admin can override:
  - Estimated hours (with reason field - required)
  - Hourly rate (with reason field - required)
  - Add/remove line items
- [ ] Adjusted values highlighted in different color
- [ ] Original vs. adjusted values shown side-by-side
- [ ] "Adjustment reason" field required (min 20 characters)
- [ ] "Save adjustment" creates audit log entry
- [ ] Quote status changes to "Manually Adjusted"
- [ ] Customer sees most recent quote version only

---

#### M-016: Quote Approval/Rejection Workflow
**User Story:**
```
As an admin
I want to approve or reject quotes before sending to customers
So that we maintain quality control on pricing
```

**Acceptance Criteria:**
- [ ] Quote starts in "Pending Review" status
- [ ] Admin can click "Approve Quote" button
- [ ] Approval prompts for confirmation dialog
- [ ] Approved quote status changes to "Quote Sent"
- [ ] Admin can click "Reject Quote" button (requires reason - min 20 chars)
- [ ] Rejected quote status changes to "Rejected"
- [ ] Rejected quotes hidden from customer view
- [ ] Admin can re-open rejected quotes for adjustment
- [ ] Approval/rejection timestamp recorded
- [ ] Approval/rejection logged in audit trail with admin_id

---

#### M-017: Status Update with Audit Trail
**User Story:**
```
As an admin
I want to update ticket status and see complete change history
So that all stakeholders know the current state and historical progress
```

**Acceptance Criteria:**
- [ ] Status dropdown available on ticket detail page
- [ ] Status options: Pending Quote, Quote Sent, Approved, Rejected, In Progress, Resolved, Closed
- [ ] Status change requires optional note (max 500 chars)
- [ ] Status change creates audit_logs entry with:
  - timestamp
  - admin_id
  - old_status
  - new_status
  - note
- [ ] Audit trail displayed on ticket detail page (newest first)
- [ ] Audit trail shows: timestamp, user, action, note
- [ ] Status change triggers customer notification (if applicable)
- [ ] Invalid status transitions prevented (business logic rules)
- [ ] Timeline view displays all status changes visually

---

### Goal 5: Customer Dashboard

#### M-018: Customer Authentication
**User Story:**
```
As a customer
I want to securely log in to view my tickets
So that my data is protected and only I can access my information
```

**Acceptance Criteria:**
- [ ] Customer login page with email/password fields
- [ ] Registration page with fields: name, email, password, confirm password
- [ ] Email verification required before first login
- [ ] Verification email sent on registration with unique token (24-hour expiry)
- [ ] Password hashed using bcrypt before storage
- [ ] Session-based authentication (JWT alternative: session cookies)
- [ ] Session expires after 24 hours or logout
- [ ] "Forgot password" link triggers password reset email
- [ ] Password reset token valid for 1 hour
- [ ] Account lockout after 5 failed login attempts (15-min cooldown)
- [ ] Login success redirects to customer dashboard

---

#### M-019: View Submitted Tickets
**User Story:**
```
As a customer
I want to see all my submitted tickets with current status
So that I can track progress on my requests
```

**Acceptance Criteria:**
- [ ] Dashboard displays customer's tickets only (filtered by user_id)
- [ ] Default view shows tickets sorted by created_at descending (newest first)
- [ ] Each ticket card displays:
  - Reference number
  - Title
  - Status (with color-coded badge)
  - Severity
  - Created date
  - Last updated date
- [ ] Click on ticket card navigates to detail view
- [ ] "Submit New Ticket" button prominently displayed
- [ ] Empty state message if no tickets exist
- [ ] Pagination if >10 tickets
- [ ] Simple filter: "Show all" / "Pending" / "In Progress" / "Resolved"

---

#### M-020: View Quote Breakdown
**User Story:**
```
As a customer
I want to see detailed quote breakdown showing how cost was calculated
So that I understand what I'm paying for and can make informed decisions
```

**Acceptance Criteria:**
- [ ] Quote summary card displays on ticket detail page
- [ ] Summary shows:
  - Total estimated hours
  - Hourly rate (£X/hour)
  - Total cost (prominently displayed)
  - Priority level
  - Effort level
- [ ] "View Breakdown" expands detailed calculation:
  - Base hours for ticket type
  - Severity multiplier applied
  - Business impact multiplier applied
  - Users affected adjustment
  - Deadline urgency factor
  - Final calculation formula
- [ ] Breakdown uses clear, non-technical language
- [ ] Visual progress bars or charts for multipliers
- [ ] "Download Quote PDF" button available
- [ ] Quote version number displayed if manually adjusted

---

#### M-021: Quote Acceptance/Rejection
**User Story:**
```
As a customer
I want to accept or reject quotes with optional comments
So that I can approve work to proceed or decline with feedback
```

**Acceptance Criteria:**
- [ ] Quote actions visible only when status = "Quote Sent"
- [ ] "Accept Quote" button prominent with green color
- [ ] "Reject Quote" button visible with red color
- [ ] Acceptance prompts confirmation dialog: "Proceed with work at £X cost?"
- [ ] Rejection opens modal with optional comment field (max 500 chars)
- [ ] Acceptance changes ticket status to "Approved"
- [ ] Rejection changes ticket status to "Rejected"
- [ ] Comment stored in ticket_notes table
- [ ] Action timestamp recorded
- [ ] Admin receives notification of customer decision
- [ ] Accepted quotes cannot be un-accepted (permanent action warning)
- [ ] After action, buttons disabled and replaced with status message

---

#### M-022: Real-time Status Updates
**User Story:**
```
As a customer
I want to see status updates on my tickets without refreshing the page
So that I'm always aware of progress
```

**Acceptance Criteria:**
- [ ] Status badge updates automatically when admin changes status
- [ ] New audit log entries appear in timeline without page refresh
- [ ] "Last updated" timestamp refreshes automatically
- [ ] Visual notification (toast/alert) when status changes
- [ ] Polling interval: every 30 seconds when page active
- [ ] Polling stops when page inactive (tab not focused)
- [ ] "Refresh" button available for manual update
- [ ] Loading indicator shows during data fetch

---

### Goal 6: Security & Access Control

#### M-023: Secure Password Hashing
**User Story:**
```
As a security-conscious user
I want my password securely hashed
So that my account remains protected even if the database is compromised
```

**Acceptance Criteria:**
- [ ] Passwords hashed using bcrypt with 10 salt rounds minimum
- [ ] Plain text passwords never stored in database
- [ ] Password hashing occurs before database insert
- [ ] Existing passwords never displayed (even to admins)
- [ ] Password reset generates new hash (old hash never reused)
- [ ] Hashing completes in <500ms
- [ ] Failed hashing returns user-friendly error (no technical details exposed)

---

#### M-024: JWT-based API Authentication
**User Story:**
```
As a developer
I want API endpoints protected with JWT tokens
So that only authenticated requests can access sensitive data
```

**Acceptance Criteria:**
- [ ] JWT generated on successful login
- [ ] Token includes: user_id, role, email, expiry
- [ ] Token expiry set to 24 hours
- [ ] Token stored in httpOnly cookie (not localStorage)
- [ ] All API endpoints (except /login, /register) require valid token
- [ ] Middleware validates token before processing request
- [ ] Expired tokens return 401 Unauthorized
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Token refresh endpoint available (/api/refresh-token)
- [ ] Token blacklist on logout (store in Redis with TTL)

---

#### M-025: Role-Based Access Control (RBAC)
**User Story:**
```
As a system administrator
I want granular role-based permissions
So that users only access functions appropriate to their role
```

**Acceptance Criteria:**
- [ ] Two roles defined: 'customer', 'admin'
- [ ] Customers can only:
  - View own tickets
  - Create tickets
  - Accept/reject own quotes
  - Update own profile
- [ ] Admins can:
  - View all tickets
  - Adjust quotes
  - Approve/reject quotes
  - Update ticket status
  - View analytics
- [ ] Role checked on every protected route
- [ ] Frontend hides unauthorized actions (UI enforcement)
- [ ] Backend enforces permissions (API enforcement)
- [ ] Unauthorized access returns 403 Forbidden
- [ ] Role stored in JWT claims
- [ ] Role cannot be modified by user (only by database admin)

---

#### M-026: SQL Injection Prevention
**User Story:**
```
As a security-conscious developer
I want all database queries protected from SQL injection
So that attackers cannot manipulate queries or access unauthorized data
```

**Acceptance Criteria:**
- [ ] All queries use parameterized statements (prepared statements)
- [ ] No string concatenation in SQL queries
- [ ] ORM (Sequelize/TypeORM) used for standard CRUD operations
- [ ] Raw queries avoided; if necessary, properly escaped
- [ ] User input never directly interpolated into queries
- [ ] Input validation on all fields before database operations
- [ ] Special characters sanitized (e.g., ', ", --, ;)
- [ ] Database user has minimal required permissions (not root)

---

#### M-027: HTTPS Enforcement
**User Story:**
```
As a user
I want all communication encrypted
So that my sensitive data cannot be intercepted
```

**Acceptance Criteria:**
- [ ] SSL/TLS certificate installed on server
- [ ] HTTP requests automatically redirect to HTTPS (301 permanent)
- [ ] HSTS header enabled (max-age=31536000; includeSubDomains)
- [ ] Secure cookie flag set (httpOnly, secure, sameSite=strict)
- [ ] Mixed content warnings eliminated (all resources loaded via HTTPS)
- [ ] TLS 1.2+ required (TLS 1.0/1.1 disabled)
- [ ] Certificate auto-renewal configured (Let's Encrypt)

---

### Goal-7: Non-Functional Requirements

#### M-028: Responsive UI Design
**User Story:**
```
As a user on any device
I want the application to work seamlessly on mobile, tablet, and desktop
So that I can access the system anywhere
```

**Acceptance Criteria:**
- [ ] Application renders correctly on viewport widths: 320px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] No horizontal scrolling on any screen size
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Font sizes scale appropriately (min 16px base)
- [ ] Navigation menu collapses to hamburger on mobile
- [ ] Forms stack vertically on mobile, horizontal on desktop
- [ ] Tables convert to card layout on mobile (<768px)
- [ ] Images scale proportionally (max-width: 100%)
- [ ] Tested on: Chrome, Firefox, Safari (iOS), Chrome (Android)

---

#### M-029: Page Load Performance
**User Story:**
```
As a user
I want pages to load quickly
So that I don't waste time waiting
```

**Acceptance Criteria:**
- [ ] Initial page load <3 seconds on standard broadband (10 Mbps)
- [ ] Subsequent page loads <1 second (cached resources)
- [ ] Largest Contentful Paint (LCP) <2.5 seconds
- [ ] First Input Delay (FID) <100ms
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] JavaScript bundle size <200KB (gzipped)
- [ ] CSS bundle size <50KB (gzipped)
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Code splitting implemented for routes

---

#### M-030: Form Validation Feedback
**User Story:**
```
As a user filling out forms
I want instant feedback on errors
So that I can correct mistakes immediately
```

**Acceptance Criteria:**
- [ ] Validation feedback appears within 200ms of input blur
- [ ] Error messages display below field in red color
- [ ] Error icons display next to invalid fields
- [ ] Field border changes to red on error
- [ ] Success indicators (green checkmark) on valid fields
- [ ] "Submit" button disabled until form valid
- [ ] Validation re-runs on input change (debounced 300ms)
- [ ] Error messages are specific (e.g., "Password must be at least 8 characters")
- [ ] Screen reader accessible error announcements

---

#### M-031: Error Handling & User-Friendly Messages
**User Story:**
```
As a user
I want clear, helpful error messages when something goes wrong
So that I know what happened and how to fix it
```

**Acceptance Criteria:**
- [ ] No stack traces or technical jargon exposed to users
- [ ] HTTP errors return user-friendly messages:
  - 400: "Invalid data submitted. Please check your inputs."
  - 401: "Session expired. Please log in again."
  - 403: "You don't have permission to access this."
  - 404: "Page not found."
  - 500: "Something went wrong. Please try again later."
- [ ] Error messages displayed in modal or toast notification
- [ ] Errors logged server-side with full details (for debugging)
- [ ] Error boundary catches React crashes gracefully
- [ ] Network errors handled with retry option
- [ ] "Contact support" link provided for persistent errors

---

#### M-032: Database Connection Pooling
**User Story:**
```
As a system administrator
I want efficient database connection management
So that the system scales to handle multiple concurrent users
```

**Acceptance Criteria:**
- [ ] Connection pool configured with:
  - Min connections: 5
  - Max connections: 20
  - Idle timeout: 30 seconds
  - Connection timeout: 10 seconds
- [ ] Failed connections automatically retry (max 3 attempts)
- [ ] Connection pool monitors health
- [ ] Connections closed gracefully on server shutdown
- [ ] Connection errors logged with details
- [ ] Pool exhaustion triggers alert/log
- [ ] System handles 50+ concurrent users without degradation

---

## Sprint 1 - Should Have Requirements

---

### Goal 8: Email Notifications

#### S-005: Ticket Submission Confirmation Email
**User Story:**
```
As a customer
I want to receive email confirmation when I submit a ticket
So that I have a permanent record and peace of mind
```

**Acceptance Criteria:**
- [ ] Email sent immediately after successful ticket submission
- [ ] Email includes:
  - Ticket reference number
  - Submission timestamp
  - Ticket title and description
  - Expected quote delivery time (e.g., "within one hour")
  - Link to view ticket in dashboard
- [ ] Email sent from no-reply@ticketsystem.com
- [ ] Email subject: "Ticket Submitted: [Reference] - [Title]"
- [ ] Email uses professional HTML template (company branding)
- [ ] Plain text alternative provided for email clients
- [ ] Email delivery failures logged (no user-facing error)


---

#### S-006: Quote Ready Notification Email
**User Story:**
```
As a customer
I want to receive email when my quote is ready
So that I can review and respond promptly
```

**Acceptance Criteria:**
- [ ] Email sent when quote status changes to "Quote Sent"
- [ ] Email includes:
  - Ticket reference and title
  - Total estimated cost (prominently displayed)
  - Estimated hours
  - Priority level
  - Link to view full quote breakdown
  - Accept/Reject buttons (deep links to dashboard)
- [ ] Email subject: "Quote Ready: [Reference] - £[Cost]"
- [ ] Email templates customizable via config
- [ ] Delivery tracked (opened/clicked metrics optional)

---

#### S-007: Quote Response Notification Email
**User Story:**
```
As an admin
I want to receive email when customers accept or reject quotes
So that I can take immediate action
```

**Acceptance Criteria:**
- [ ] Email sent to admin email address on quote acceptance/rejection
- [ ] Email includes:
  - Ticket reference and title
  - Customer name and email
  - Action taken (Accepted/Rejected)
  - Customer comment (if provided)
  - Link to ticket in admin dashboard
- [ ] Email subject: "[Action] Quote [Reference] by [Customer Name]"
- [ ] Color-coded: green for acceptance, red for rejection

---

#### S-008: Status Change Notification Email
**User Story:**
```
As a customer
I want to receive email when my ticket status changes
So that I'm kept informed without checking the dashboard constantly
```

**Acceptance Criteria:**
- [ ] Email sent when ticket status changes to: In Progress, Resolved, Closed
- [ ] Email includes:
  - Ticket reference and title
  - New status
  - Admin note (if provided)
  - Next steps or expected timeline
  - Link to ticket dashboard
- [ ] Email subject: "Status Update: [reference] - Now [Status]"
- [ ] No email sent for minor status changes (e.g., Pending Quote → Quote Sent)


---

#### S-009: Configurable Email Templates
**User Story:**
```
As an admin
I want to customize email templates
So that branding and messaging align with company standards
```

**Acceptance Criteria:**
- [ ] Email templates stored in /config/email-templates/ directory
- [ ] Templates use Handlebars or EJS for variable substitution
- [ ] Templates include placeholders: {{customerName}}, {{ticketReference}}, {{cost}}, etc.
- [ ] Admin can edit templates via config file (no code changes)
- [ ] Templates include header/footer with company logo
- [ ] Color scheme configurable via CSS variables
- [ ] Preview functionality for testing templates
- [ ] Fallback to default template if custom template malformed

---

### Goal 9: SLA Management

#### S-014: SLA Target Times
**User Story:**
```
As a business owner
I want to define SLA targets based on severity levels
So that customers receive timely service matching urgency
```

**Acceptance Criteria:**
- [ ] SLA targets configured per severity:
  - Critical: 4 hours to first response, 24 hours to resolution
  - High: 8 hours to first response, 48 hours to resolution
  - Medium: 24 hours to first response, 5 days to resolution
  - Low: 48 hours to first response, 10 days to resolution
- [ ] SLA clock starts at ticket submission timestamp
- [ ] SLA pauses when waiting for customer input (status: Awaiting Customer)
- [ ] SLA targets stored in config file
- [ ] SLA countdown displayed on ticket detail page
- [ ] SLA remaining time calculated in real-time

---

#### S-015: SLA Countdown Timer
**User Story:**
```
As an admin
I want to see SLA countdown timers on tickets
So that I can prioritize work to avoid breaches
```

**Acceptance Criteria:**
- [ ] Timer displays on admin ticket queue (e.g., "3h 24m remaining")
- [ ] Timer uses color coding:
  - Green: >50% time remaining
  - Yellow: 25-50% time remaining
  - Orange: 10-25% time remaining
  - Red: <10% time remaining
- [ ] Timer updates every minute
- [ ] Expired timers show "SLA Breached" in red
- [ ] Timer pauses when ticket status = "awaiting cusotmer..
- [ ] Hover over timer shows SLA target deadline

---

#### S-016: SLA Breach Warning Alerts
**User Story:**
```
As an admin
I want automated alerts before SLA breaches
So that I can take preventive action
```

**Acceptance Criteria:**
- [ ] Email alert sent at 75% of SLA time consumed
- [ ] Email alert sent at 90% of SLA time consumed
- [ ] Alert email includes:
  - Ticket reference and title
  - Time remaining until breach
  - Current ticket status
  - Assigned admin (if applicable)
  - Link to ticket
- [ ] Dashboard notification badge shows SLA warning count
- [ ] Alerts sent to admin email list (configurable)
- [ ] Alert threshold percentages configurable (75%, 90%)

---

#### S-017: SLA Compliance Reporting
**User Story:**
```
As a manager
I want to see SLA compliance metrics
So that I can monitor team performance and identify improvement areas
```

**Acceptance Criteria:**
- [ ] Report shows:
  - Total tickets by severity
  - SLA met count vs. breached count
  - Average resolution time by severity
  - Compliance percentage (target: >95%)
- [ ] Report filterable by date range
- [ ] Report exportable to csv
- [ ] Visual charts: bar chart for compliance %, line chart for trend
- [ ] "At-risk" tickets highlighted (approaching SLA deadline)

---

### Goal 10: Quote History & Audit

#### S-001: Quote Revision History
**User Story:**
```
As an admin
I want to see complete history of quote modifications
So that I can audit changes and understand decision-making
```

**Acceptance Criteria:**
- [ ] Revision history table created: quote_revisions (quote_id, version, hours, cost, reason, admin_id, created_at)
- [ ] Every manual adjustment creates new revision record
- [ ] Revision history displays on quote detail page
- [ ] Each revision shows:
  - Version number (v1, v2, v3...)
  - Timestamp
  - Admin who made change
  - Old values → New values (highlighted)
  - Adjustment reason
- [ ] Ability to view specific revision details
- [ ] Cannot edit or delete revision history (immutable audit log)

---

#### S-002: Timestamp & User Tracking
**User Story:**
```
As a compliance officer
I want all quote changes tracked with timestamps and user attribution
So that we maintain audit compliance
```

**Acceptance Criteria:**
- [ ] Every quote change records:
  - admin_id (who made change)
  - changed_at (timestamp in UTC)
  - ip_address (for security audit)
  - user_agent (browser/device info)
- [ ] Timestamp displayed in user's local timezone in UI
- [ ] User attribution shown as "Changed by [Admin Name]"
- [ ] Audit log is immutable (no UPDATE or DELETE allowed)
- [ ] Audit log retention: permanent (never deleted)

---

#### S-003: Admin Notes on Quote Adjustments
**User Story:**
```
As an admin
I want to add internal notes when adjusting quotes
So that other team members understand the rationale
```

**Acceptance Criteria:**
- [ ] "Admin Notes" field available on quote adjustment form
- [ ] Notes field supports up to 1000 characters
- [ ] Notes visible only to admin users (not customers)
- [ ] Notes stored in quote_revisions table
- [ ] Notes displayed in revision history
- [ ] Notes can include @mentions for other admins (optional)

---

#### S-004: Change Log in Admin Dashboard
**User Story:**
```
As an admin
I want to see a unified change log across all quote
So that I can monitor team activity
```

**Acceptance Criteria:**
- [ ] "Change Log" page in admin dashboard
- [ ] Log displays all quote modifications across all tickets
- [ ] Each entry shows:
  - Timestamp
  - Ticket reference
  - Admin name
  - Change type (Created/Adjusted/Approved/Rejected)
  - Brief summary
- [ ] Log filterable by:
  - Date range
  - Admin user
  - Change type
- [ ] Log sortable by timestamp (newest first default)
- [ ] Pagination (50 entries per page)

---

### Goal 11: Internal Collaboration

#### S-018: Internal Comments Section
**User Story:**
```
As an admin
I want to add internal comments on tickets
So that the team can collaborate without customer visibility
```

**Acceptance Criteria:**
- [ ] "Internal Comments" tab on ticket detail page (admin only)
- [ ] Comment form with rich text editor
- [ ] Comments display chronologically with timestamps
- [ ] Each comment shows: author name, timestamp, comment text
- [ ] Comments editable by author within 5 minutes of posting
- [ ] Comments marked as "edited" if modified
- [ ] Comments never visible to customers
- [ ] Comment count badge on "Internal Comments" tab

---


#### S-020: Comment Threading
**User Story:**
```
As an admin
I want to reply to specific comments
So that discussions are organized and contextual
```

**Acceptance Criteria:**
- [ ] "Reply" button on each comment
- [ ] Replies indented under parent comment
- [ ] Reply shows "In reply to @UserName"
- [ ] Thread can nest up to 3 levels deep
- [ ] Collapsible threads (show/hide replies)
- [ ] Reply count displayed on parent comment (e.g., "3 replies")

---

#### S-021: Activity Timeline
**User Story:**
```
As an admin
I want a unified timeline showing all ticket interactions
So that I can quickly understand ticket history
```

**Acceptance Criteria:**
- [ ] Timeline displays all events chronologically:
  - Ticket created
  - Quote generated
  - Quote adjusted
  - Status changes
  - Customer acceptance/rejection
  - Internal comments
  - @mentions
- [ ] Each timeline entry shows:
  - Icon (based on event type)
  - Timestamp (relative: "2 hours ago")
  - Actor (who performed action)
  - Description
- [ ] Timeline filterable: "All" / "Status Changes" / "Comments" / "Quote Changes"
- [ ] Timeline auto-updates (polling every 60 seconds)

---

## Definition of Done (DoD)
Each user story is considered "Done" when:
1. All acceptance criteria met
2. Code reviewed and approved by peer
3. Unit tests written (50%+ coverage)
4. Integration tests passing
5. Documentation updated (README, API docs)
6. Deployed to prod
7. No critical or high-severity bugs

---
