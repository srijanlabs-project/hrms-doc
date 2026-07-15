---
id: HRMS-SUB-00-05
title: Notification engine Specification
document: 05-notification-engine.md
version: 2.1
status: Draft
---

# 1. Purpose and Scope

Notification Engine is the shared service responsible for generating, personalizing, scheduling, routing, retrying, and tracking notifications across the HRMS platform.

In scope:

- Event-triggered and scheduled notification creation
- Template rendering and localization
- Audience resolution
- Channel selection and fallback
- Delivery tracking, retries, and suppression
- Notification preferences and mandatory-message handling

# 2. Business Context

Enterprise HRMS workflows depend on timely approvals, reminders, deadline management, employee communications, and exception escalation. Poor notification handling leads to delays, missed tasks, and user distrust.

Business outcomes:

- Improve action completion rates
- Reduce missed approvals and deadlines
- Standardize communication behavior across modules
- Provide delivery traceability and support diagnostics

# 3. Actors and Responsibilities

Primary roles:

- Communications Admin
- Tenant Admin
- Workflow or Process Owner
- End User
- Support Team

Responsibilities:

- Admins maintain templates, channels, and policy settings
- Process owners define which business events must notify whom and when
- End users receive and act on messages
- Support teams investigate failed or duplicated delivery

# 4. Functional Behavior

The engine shall support:

- Event-triggered notifications
- Scheduled reminders
- Channel support for email, SMS, push, and approved messaging platforms
- Dynamic tokens and conditional content blocks
- Localization and template variants
- Mandatory vs optional communication treatment
- Retry and fallback rules
- Delivery status tracking
- Notification suppression, deduplication, and throttling

Examples:

- Approval task assignment
- Missed punch reminder
- Join-date readiness blocker alert
- Payroll ready-for-approval alert
- Policy announcement

# 5. Data and Field Design

Core entities:

- `notification_template`
- `notification_template_version`
- `notification_event_binding`
- `notification_instance`
- `notification_recipient`
- `notification_delivery_attempt`
- `notification_preference`

Important field groups:

- Event or trigger key
- Template code and locale
- Recipient resolution mode
- Channel priority and fallback sequence
- Delivery status and timestamps
- Mandatory flag and suppression behavior

# 6. UX and Interaction Model

Primary screens:

- Template catalog
- Template editor
- Trigger binding screen
- Delivery monitor
- User communication preference screen

UX expectations:

- Administrators should understand what business event each template is tied to
- Delivery views should clearly distinguish template issues, recipient issues, and channel-provider issues
- End users should be able to manage preferences for non-mandatory communications where policy permits

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/platform/notifications/send`
- `POST /api/v1/platform/notifications/templates`
- `PUT /api/v1/platform/notifications/templates/{templateId}`
- `GET /api/v1/platform/notifications/{id}/status`
- `POST /api/v1/platform/notifications/retry/{notificationId}`

API expectations:

- Send APIs must support idempotency keys for duplicate-trigger protection
- Template APIs must validate required tokens and locale integrity
- Status APIs must expose channel attempt history where authorized

# 8. Workflow and Business Rules

Typical flow:

1. Module triggers notification event.
2. Engine resolves audience and template binding.
3. Engine renders localized content and selects channel.
4. Delivery is attempted and tracked.
5. Retry, fallback, or support escalation occurs if configured.

Critical rules:

- Mandatory messages must not be silently suppressed by user preference
- Duplicate event storms should be deduplicated or throttled
- Fallback to alternate channel should be controlled by policy and message criticality

# 9. State Machine

Notification states:

- Created
- Queued
- Sending
- Delivered
- Failed
- Retrying
- Suppressed
- Expired

# 10. Events and Notifications

Published events:

- `notification.created`
- `notification.sent`
- `notification.failed`
- `notification.retried`
- `notification.suppressed`

Consumed events:

- Module business events
- Workflow events
- User preference updates
- Channel-provider callbacks

# 11. Reports and Dashboards

Reports:

- Delivery success report
- Failed notification report
- Template usage report
- Channel performance report

Dashboards:

- Notifications sent by channel
- Failure trend by provider
- Retry backlog
- Mandatory message delivery risk

# 12. Security, Permissions, and Audit

Security requirements:

- Template editing must be permission-controlled
- Sensitive business context in notifications must be minimized by channel
- Provider secrets and channel credentials must be securely managed outside user-facing config

Audit requirements:

- Template creation and publish history
- Event-to-notification linkage
- Retry and manual resend actions
- Preference changes affecting delivery

# 13. Configuration

Configurable items:

- Channel enablement
- Template localization
- Retry counts and intervals
- Fallback channel rules
- Deduplication window
- Preference policy by message type

# 14. Edge Cases and Exception Handling

- Recipient opted out of non-mandatory channel
- Template token missing
- Primary provider down at send time
- Duplicate event generates repeated notifications
- User account inactive at delivery time

# 15. Test Scenarios

- Send approval notification successfully
- Retry after provider failure
- Suppress non-mandatory message per preference
- Deliver mandatory message despite preference opt-out
- Deduplicate repeated business event

# 16. Dependencies and Integrations

Dependencies:

- Workflow engine
- Template engine
- Localization engine
- Audit engine

Integrations:

- Email gateway
- SMS provider
- Push notification service
- Messaging app provider

# 17. Assumptions

- Channel providers are integrated and monitored
- Source modules classify mandatory vs informational messages correctly
